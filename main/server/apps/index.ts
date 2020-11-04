import bufferReplace from "buffer-replace";
import PlainText from "./plain-text";

const dasher = new PlainText({
  name: "Dasher",
  location: "./training.txt",
  processFile: (buff) => {
    const cleanedBuffer: Buffer = bufferReplace(
      buff,
      Buffer.from("C2A72323", "hex"),
      "\n"
    );

    return cleanedBuffer.toString();
  },
});

export default { dasher };
