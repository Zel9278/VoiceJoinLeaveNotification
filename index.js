require("dotenv").config()
const { Client, Intents } = require("discord.js")
const client = new Client({ intents: Object.values(Intents.FLAGS) })


client.on("ready", () => console.log("Bot is ready!"))
client.on("voiceStateUpdate", onVoiceStatusUpdate)
client.login(process.env.TOKEN)

const colors = {
  YELLOW: 0x555500,
  PURPLE: 0x7755ff,
  RED: 0xff0055,
  BLUE: 0x0055ff,
}

const match = {
  hasResult: false,
  when(cond, getResult) {
    if (!cond) return this

    return {
      hasResult: true,
      result: getResult(),
      when() { return this }
    }
  }
}

function shortenSessionId(id) {
  return id.replace(/(?<=.{5}).+(?=.{5})/, "...")
}

const ignoredStates = [
  "selfDeaf", "selfMute", "selfVideo", "serverDeaf", "serverMute", "streaming",
]

function onVoiceStatusUpdate(oldState, newState) {
  for (const stateName of ignoredStates) {
    if (oldState[stateName] !== newState[stateName]) return
  }


  const guild = oldState.guild ?? newState.guild
  const logChannel = guild.channels.cache.find((ch) => ch.name === "vc-log")
  const oldVoiceChannel = oldState.channelId
  const newVoiceChannel = newState.channelId
  const oldSessionId = shortenSessionId(oldState.sessionId)
  const newSessionId = shortenSessionId(newState.sessionId)

  const { hasResult, result: partialEmbed } = match

    .when(oldState.sessionId !== newState.sessionId, () => ({
      title: `${newState.member?.user?.tag} Changed Session`,
      description: `${oldSessionId} -> ${newSessionId}`,
      color: colors.YELLOW,
    }))

    .when(oldUserChannel !== null && newUserChannel !== null, () => ({
      title: `${newState.member?.user?.tag} Moved`,
      description: `${oldState.channel} -> ${newState.channel}`,
      color: colors.PURPLE,
    }))

    .when(oldUserChannel !== null, () => ({
      title: `${newState.member?.user?.tag} Left - ${oldState.channel.name}`,
      description: "NO",
      color: colors.RED,
    }))

    .when(newUserChannel !== null, () => ({
      title: `${newState.member?.user?.tag} Joined - ${newState.channel.name}`,
      description: "はお",
      color: colors.BLUE,
    }))

  channel?.send({
    ...partialEmbed,
    timestamp: new Date(),
  })
}
