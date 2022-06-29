require("dotenv").config();

const { Client, Intents } = require("discord.js");
const client = new Client({
    intents: Object.values(Intents.FLAGS),
});

client.on("ready", () => {
    console.log("Bot is ready!");
});

client.on("voiceStateUpdate", (oldState, newState) => {
    if (oldState.selfDeaf !== newState.selfDeaf) return;
    if (oldState.selfMute !== newState.selfMute) return;
    if (oldState.selfVideo !== newState.selfVideo) return;
    if (oldState.serverDeaf !== newState.serverDeaf) return;
    if (oldState.serverMute !== newState.serverMute) return;
    if (oldState.sessionId !== newState.sessionId) return;
    if (oldState.streaming !== newState.streaming) return;

    const guild = client.guilds.resolve(newState.guild.id);
    if (!guild) return;
    const channel = guild.channels.cache.find(ch => ch.name === "vc-log");
    const oldUserChannel = oldState.channelId;
    const newUserChannel = newState.channelId;

    if(oldUserChannel && newUserChannel) return channel?.send({
        embeds: [{
            title: `${newState.member?.user?.tag} Moved`,
            description: `${oldState.channel} -> ${newState.channel}`,
            color: 0x7755ff,
            timestamp: new Date()
        }]
    });

    if (oldUserChannel)return channel?.send({
        embeds: [{
            title: `${newState.member?.user?.tag} Leaved`,
            description: "NO",
            color: 0xff0055,
            timestamp: new Date()
        }]
    });

    if (newUserChannel) return channel?.send({
        embeds: [{
            title: `${newState.member?.user?.tag} Joined`,
            description: "はお",
            color: 0x0055ff,
            timestamp: new Date()
        }]
    });
});

client.login(process.env.TOKEN);
