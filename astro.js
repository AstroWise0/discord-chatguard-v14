const { Client, GatewayIntentBits, Partials, PermissionsBitField, EmbedBuilder, ActivityType } = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const config = require("./config.json");
const map = new Map();
const lımıt = 5;
const TIME = 10000;
const DIFF = 2000;

// İntentler ile yeni bir client oluşturma
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Message, Partials.Channel, Partials.User]
});

client.on("ready", () => {
    client.user.setPresence({ 
        activities: [{ name: "Astro Was Here ❤️", type: ActivityType.Watching }], 
        status: "dnd" 
    });
    
    // Ses kanalına bağlanma (v14'te farklı)
    if (config.ses) {
        const channel = client.channels.cache.get(config.ses);
        if (channel && channel.type === 2) { // 2 = GUILD_VOICE
            try {
                joinVoiceChannel({
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                    selfDeaf: true,
                    selfMute: true
                });
                console.log(`${channel.name} ses kanalına başarıyla bağlanıldı.`);
            } catch (error) {
                console.error("Ses kanalına bağlanırken hata:", error);
            }
        } else {
            console.log("Belirtilen ses kanalı bulunamadı veya ses kanalı değil.");
        }
    }
});

client.login(config.token)
    .then(() => console.log(`${client.user.username} Olarak Giriş Yapıldı Bot Aktif Developed By Astro Wise`))
    .catch(() => console.log("Bot Giriş Yaparken Bir Hata Oldu"));

client.on('messageCreate', async (msg) => {
    if (msg.channel.type === 1) return; // 1 = DM

    if (msg.content === 'sa') {
        msg.reply('Aleyküm Selam Hoşgeldin ');
    }
    else if (msg.content === 'sea') {
        msg.reply('Aleyküm Selam Hoşgeldin ');
    }
    else if (msg.content === 'hi') {
        msg.reply('Hi welcome ');
    }
});

client.on('messageCreate', async message => {
    if (message.channel.type === 1) return; // 1 = DM
    let reklamlar = ["discord.app", "discord.gg", "discordapp", "discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az", ".cf", ".me", ".in"];
    let kelimeler = message.content.slice(" ").split(/ +/g);

    if (reklamlar.some(word => message.content.toLowerCase().includes(word))) {
        if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        
        try {
            await message.delete();
        } catch (error) {
            console.error("Mesaj silinirken hata:", error);
        }

        await db.add(`reklam_${message.author.id}`, 1);
        const reklamCount = await db.get(`reklam_${message.author.id}`) || 0;
        
        if (reklamCount === 1) {
            message.channel.send(`${message.author} Reklam yapmana izin vermem! Eğer 2 kez daha reklam yaparsan seni banlayacağım! (1/3)`)
                .then(astro => setTimeout(() => astro.delete().catch(e => {}), 5000));
        }
        else if (reklamCount === 2) {
            message.channel.send(`${message.author} Reklam yapmana izin vermem! Eğer 1 kez daha reklam yaparsan seni banlayacağım! (2/3)`)
                .then(astro => setTimeout(() => astro.delete().catch(e => {}), 5000));
        }
        else if (reklamCount >= 3) {
            message.channel.send(`${message.author} Reklam yapma demiştim bu yüzden seni banladım`);
            
            try {
                await message.author.send(`${message.author} Reklam yapma demiştim bu yüzden seni banladım`);
            } catch (error) {
                message.channel.send(`${message.author} Kişisine bilgilendirme mesajı yollayamadım`);
            }
            
            try {
                await message.guild.members.ban(message.author.id, { reason: "Astro Chat Guard" });
            } catch (error) {
                message.channel.send(`${message.author} Kişisini banlayamadım`);
            }
            
            await db.delete(`reklam_${message.author.id}`);
        }   
    }
});

client.on("messageUpdate", async (oldMsg, newMsg) => {
    if (!newMsg.guild || !newMsg.member) return;
    
    let reklamlar = ["discord.app", "discord.gg", "discordapp", "discordgg", ".com", ".net", ".xyz", ".tk", ".pw", ".io", ".me", ".gg", "www.", "https", "http", ".gl", ".org", ".com.tr", ".biz", ".party", ".rf.gd", ".az", ".cf", ".me", ".in"];
    
    if (reklamlar.some(word => newMsg.content && newMsg.content.toLowerCase().includes(word))) {
        if (newMsg.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        
        try {
            await newMsg.delete();
        } catch (error) {
            console.error("Mesaj silinirken hata:", error);
        }

        await db.add(`reklam_${newMsg.author.id}`, 1);
        const reklamCount = await db.get(`reklam_${newMsg.author.id}`) || 0;
        
        if (reklamCount === 1) {
            newMsg.channel.send(`${newMsg.author}, Reklam yapmana izin vermem! Eğer 2 kez daha reklam yaparsan seni banlayacağım! (1/3)`)
                .then(astro => setTimeout(() => astro.delete().catch(e => {}), 5000));
        }
        else if (reklamCount === 2) {
            newMsg.channel.send(`${newMsg.author}, Reklam yapmana izin vermem! Eğer 1 kez daha reklam yaparsan seni banlayacağım! (2/3)`)
                .then(astro => setTimeout(() => astro.delete().catch(e => {}), 5000));
        }
        else if (reklamCount >= 3) {
            newMsg.channel.send(`${newMsg.author}, Reklam yapma demiştim bu yüzden seni banladım`);
            
            try {
                await newMsg.author.send(`${newMsg.author}, Reklam yapma demiştim bu yüzden seni banladım`);
            } catch (error) {
                newMsg.channel.send(`${newMsg.author} Kişisine bilgilendirme mesajı yollayamadım`);
            }
            
            try {
                await newMsg.guild.members.ban(newMsg.author.id, { reason: "Astro Chat Guard" });
            } catch (error) {
                newMsg.channel.send(`${newMsg.author} Kişisini banlayamadım`);
            }
            
            await db.delete(`reklam_${newMsg.author.id}`);
        }
    }
});

client.on("messageCreate", async msg => {
    if (msg.channel.type === 1) return; // 1 = DM

    const kufur = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "mal", "sik", "yarrak", "am", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "ak", "amq",];
    if (kufur.some(word => msg.content && msg.content.includes(word))) {
        try {
            if (!msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                await msg.delete();
                return msg.channel.send('Heey! Küfür Yasak.')
                    .then(astro => setTimeout(() => astro.delete().catch(e => {}), 5000));
            }
        } catch (err) {
            console.log(err);
        }
    }
});

client.on("messageCreate", async msg => {
    if (msg.channel.type === 1) return; // 1 = DM
    if (msg.author.bot) return;
    if (msg.content && msg.content.length > 1) {
        let caps = msg.content.toUpperCase();
        if (msg.content == caps) {
            if (!msg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                if (!msg.mentions.users.first()) {
                    try {
                        await msg.delete();
                        return msg.channel.send(`${msg.member}, Capslock Kapat Lütfen!`)
                            .then(astro => setTimeout(() => astro.delete().catch(e => {}), 5000));
                    } catch (error) {
                        console.error("Mesaj silinirken hata:", error);
                    }
                }
            }
        }
    }
});

client.on("messageUpdate", async (oldMsg, newMsg) => {
    if (!newMsg.guild || !newMsg.member) return;

    const kufur = ["oç", "amk", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk", "sikim", "sikiyim", "orospu çocuğu", "piç kurusu", "kahpe", "orospu", "mal", "sik", "yarrak", "am", "amcık", "amık", "yarram", "sikimi ye", "mk", "mq", "aq", "ak", "amq",];
    if (kufur.some(word => newMsg.content && newMsg.content.includes(word))) {
        try {
            if (!newMsg.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                await newMsg.delete();
                return newMsg.channel.send('Yakaladım Seni! Küfür Yasak.')
                    .then(astro => setTimeout(() => astro.delete().catch(e => {}), 5000));
            }
        } catch (err) {
            console.log(err);
        }
    }
});

client.on('messageCreate', async message => {
    if (message.channel.type === 1) return; // 1 = DM
    if (message.author.bot) return;
    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    // Spam koruması
    if (map.has(message.author.id)) {
        const userData = map.get(message.author.id);
        const { lastMessage, timer } = userData;
        const difference = message.createdTimestamp - lastMessage.createdTimestamp;
        let msgCount = userData.msgCount;

        if (difference > DIFF) {
            clearTimeout(timer);
            userData.msgCount = 1;
            userData.lastMessage = message;
            userData.timer = setTimeout(() => {
                map.delete(message.author.id);
            }, TIME);
            map.set(message.author.id, userData);
        } else {
            ++msgCount;
            if (parseInt(msgCount) === lımıt) {
                let muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
                if (!muteRole) {
                    try {
                        muteRole = await message.guild.roles.create({
                            name: 'Muted',
                            color: '#000000',
                            permissions: []
                        });
                        message.guild.channels.cache.forEach(async (channel) => {
                            await channel.permissionOverwrites.create(muteRole, {
                                SendMessages: false,
                                AddReactions: false
                            });
                        });
                    } catch (e) {
                        console.log(e);
                    }
                }
                
                if (muteRole) {
                    message.member.roles.add(muteRole);
                    message.channel.send(`${message.author}, Spam yaptığın için 15 dakika boyunca susturuldun!`);
                    
                    setTimeout(() => {
                        message.member.roles.remove(muteRole);
                        message.channel.send(`${message.author}, Susturulman kaldırıldı. Lütfen tekrar spam yapma!`);
                    }, 15 * 60 * 1000); // 15 dakika
                }
            } else {
                userData.msgCount = msgCount;
                map.set(message.author.id, userData);
            }
        }
    } else {
        let fn = setTimeout(() => {
            map.delete(message.author.id);
        }, TIME);
        map.set(message.author.id, {
            msgCount: 1,
            lastMessage: message,
            timer: fn
        });
    }
});

// Emoji spam koruması
client.on('messageCreate', async message => {
    if (message.channel.type === 1) return; // 1 = DM
    if (message.author.bot) return;
    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
    
    const regex = /<a?:.+?:\d+>/g;
    if (message.content) {
        const emojis = message.content.match(regex);
        if (emojis && emojis.length > 5) {
            try {
                await message.delete();
                return message.channel.send(`${message.author}, Çok fazla emoji kullanma!`)
                    .then(astro => setTimeout(() => astro.delete().catch(e => {}), 5000));
            } catch (error) {
                console.error("Mesaj silinirken hata:", error);
            }
        }
    }
});

// Etiket spam koruması
client.on('messageCreate', async message => {
    if (message.channel.type === 1) return; // 1 = DM
    if (message.author.bot) return;
    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
    
    if (message.mentions.users.size >= 4) {
        try {
            await message.delete();
            return message.channel.send(`${message.author}, Çok fazla kişiyi etiketleme!`)
                .then(astro => setTimeout(() => astro.delete().catch(e => {}), 5000));
        } catch (error) {
            console.error("Mesaj silinirken hata:", error);
        }
    }
});

// Ses kanalına bağlanma için Voice State Update eventi
client.on('voiceStateUpdate', async (oldState, newState) => {
    // Bot yeniden bağlandığında veya ses kanalından atıldığında tekrar bağlanma
    if (newState.member.id === client.user.id && !newState.channelId) {
        // Bot ses kanalından atıldı, tekrar bağlan
        if (config.ses) {
            const channel = client.channels.cache.get(config.ses);
            if (channel && channel.joinable && channel.type === 2) { // 2 = GUILD_VOICE
                try {
                    setTimeout(() => {
                        joinVoiceChannel({
                            channelId: channel.id,
                            guildId: channel.guild.id,
                            adapterCreator: channel.guild.voiceAdapterCreator,
                            selfDeaf: false,
                            selfMute: false
                        });
                        console.log(`${channel.name} ses kanalına tekrar bağlanıldı.`);
                    }, 5000); // 5 saniye bekle ve tekrar bağlan
                } catch (error) {
                    console.error("Ses kanalına tekrar bağlanırken hata:", error);
                }
            }
        }
    }
});

// Hata yakalama
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});