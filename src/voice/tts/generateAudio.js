// const fs = require("node:fs");
const { default: axios } = require("axios");
const { createAudioResource } = require("@discordjs/voice");
const { Readable } = require("node:stream");
const rpc = axios.create({ baseURL: "http://localhost:50021", proxy: false });


module.exports = async function readMessages(message, messageContent) {
	// const soundPath = `sounds/${message.author.id}.wav`;
	// const soundPath = `sounds/${message.id}.wav`;
	// const defaultVoice = "14";
	const defaultVoice = "14";
	const VoiceMap = new Map;
	let voice = VoiceMap.get(message.author.id);
	if (!voice) {
		voice = defaultVoice;
	}

	// const convMessage = message;
	const resource = await generateAudio(messageContent, voice);
	// await play(convMessage, soundPath);
	console.log(messageContent);

	// ここまで 旧readMessages.jsの内容
	// ここから 旧generateAudio.jsの内容
	async function generateAudio(text, speakerName) {
		const audioQuery = await rpc.post(`audio_query?text=${encodeURI(text)}&speaker=${speakerName}`, {
			headers: {
				"outputStereo": "false",
			},
		});

		const synthesis = await rpc.post(`synthesis?speaker=${speakerName}`, JSON.stringify(audioQuery.data), {
			responseType: "arraybuffer",
			headers: {
				"accept": "audio/wav",
				"Content-Type": "application/json",
			},
		});

		// fs.writeFileSync(filePath, new Buffer.from(synthesis.data), "binary");
		// return filePath;
		return createAudioResource(Readable.from(synthesis.data));
	}
	return resource;
};