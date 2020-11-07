/* eslint-disable @typescript-eslint/no-var-requires */
const stream = require("stream");

const transform = new stream.Transform({
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
    this.push(
      Buffer.concat([
        Buffer.from("C2A72323", "hex"),
        Buffer.from(chunk.toString().split("\n").join("")),
      ])
    );

    callback();
  },
});

module.exports = transform;
