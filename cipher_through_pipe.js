const {
  scrypt,
  randomFill,
  createCipheriv,
  createDecipheriv,
} = require("crypto");
const { createReadStream, createWriteStream } = require("fs");
const { stdout } = require("process");
const { pipeline } = require("stream");

scrypt("Here is password.", "salt", 24, (err, key) => {
  if (err) throw err;
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;
    const cipher = createCipheriv("aes-192-cbc", key, iv);
    // cipher.setEncoding("hex");
    const input = createReadStream(".storage/cipher_and_pipe_readstream.js", {
      encoding: "utf8",
    });
    const output = createWriteStream(
      ".storage/cipher_and_pipe_writestream.enc",
    ).setEncoding('hex');

    pipeline(input, cipher, output, (err) => {
      if (err) throw err;
    });

    // Use pipeline to decrypt
    const decipher = createDecipheriv("aes-192-cbc", key, iv);
    // decipher.setEncoding("hex");
    output.on("close", () => {
      const decrypted_input = createReadStream(
        ".storage/cipher_and_pipe_writestream.enc",
      ).setEncoding('hex');
      // const decrypted_output = createWriteStream(
      //   ".storage/decipher_and_pipe_readstream.js"
      // );
      decrypted_input.pipe(decipher).pipe(stdout);
    });
  });
});
