require("dotenv").config()
const { Client, Intents } = require("discord.js")
const client = new Client({ intents: Object.values(Intents.FLAGS) })


client.on("ready", () => console.log("Bot is ready!"))
client.on("voiceStateUpdate", onVoiceStatusUpdate)
client.login(process.env.TOKEN)


function onVoiceStatusUpdate(oldState, newState) {
  if (oldState.selfDeaf !== newState.selfDeaf) return
  if (oldState.selfMute !== newState.selfMute) return
  if (oldState.selfVideo !== newState.selfVideo) return
  if (oldState.serverDeaf !== newState.serverDeaf) return
  if (oldState.serverMute !== newState.serverMute) return
  if (oldState.streaming !== newState.streaming) return

  const guild = client.guilds.resolve(
    newState.guild?.id || oldState.guild?.id
  )
  if (!guild) return
  const channel = guild.channels.cache.find((ch) => ch.name === "vc-log")
  const oldUserChannel = oldState.channelId
  const newUserChannel = newState.channelId
  const oldSessionId = oldState.sessionId.replace(
    /(?<=.{5}).+(?=.{5})/,
    "..."
  )
  const newSessionId = newState.sessionId.replace(
    /(?<=.{5}).+(?=.{5})/,
    "..."
  )

  if (oldState.sessionId !== newState.sessionId)
    return channel?.send({
      embeds: [
        {
          title: `${newState.member?.user?.tag} Changed Session`,
          description: `${oldSessionId} -> ${newSessionId}`,
          color: 0x555500,
          timestamp: new Date(),
        },
      ],
    })

  if (oldUserChannel && newUserChannel)
    return channel?.send({
      embeds: [
        {
          title: `${newState.member?.user?.tag} Moved`,
          description: `${oldState.channel} -> ${newState.channel}`,
          color: 0x7755ff,
          timestamp: new Date(),
        },
      ],
    })

  if (oldUserChannel)
    return channel?.send({
      embeds: [
        {
          title: `${newState.member?.user?.tag} Left - ${oldState.channel.name}`,
          description: "NO",
          color: 0xff0055,
          timestamp: new Date(),
        },
      ],
    })

  if (newUserChannel)
    return channel?.send({
      embeds: [
        {
          title: `${newState.member?.user?.tag} Joined - ${newState.channel.name}`,
          description: "はお",
          color: 0x0055ff,
          timestamp: new Date(),
        },
      ],
    })
}
