import { useState } from "react";

export function useOnlineSTT() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  let ws: WebSocket;
  let stream: MediaStream;
  let audioContext: AudioContext;
  let processor: ScriptProcessorNode;

  const startListening = async () => {
    setTranscript("");

    ws = window.sttAPI.createWebSocket(
      "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview"
    );

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "response.create",
        response: { modalities: ["text"] }
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "response.output_text.delta") {
        setTranscript((t) => t + data.text);
      }
    };

    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    audioContext = new AudioContext({ sampleRate: 24000 });
    const source = audioContext.createMediaStreamSource(stream);

    processor = audioContext.createScriptProcessor(4096, 1, 1);
    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const pcm16 = floatTo16BitPCM(input);

      ws.send(
        JSON.stringify({
          type: "input_audio_buffer.append",
          audio: Buffer.from(pcm16).toString("base64")
        })
      );
    };

    ws.send(JSON.stringify({ type: "input_audio_buffer.start" }));

    setListening(true);
  };

  const stopListening = () => {
    if (processor) processor.disconnect();
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (ws) {
      ws.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
      ws.close();
    }
    setListening(false);
  };

  return { listening, transcript, startListening, stopListening };
}

function floatTo16BitPCM(float32Array: Float32Array) {
  const pcm16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return pcm16;
}
