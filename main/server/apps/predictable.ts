import { addEndMarkerToPhrase } from "../lib/add-end-marker-to-phrase";
import { PredictableHistory } from "./types";

export const processPredictableFile = (buff: Buffer): string => {
  const parsedBuffer: PredictableHistory = JSON.parse(buff.toString());

  return parsedBuffer.RecordedMessages.map((message) =>
    addEndMarkerToPhrase(message.Transcription.Text.trim())
  ).join("\n");
};
