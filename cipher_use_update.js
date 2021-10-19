const {
  scrypt,
  randomFill,
  createCipheriv,
  createDecipheriv,
} = require("crypto");
const fs = require("fs");
const path = require("path");

scrypt("password", "salt", 16, (err, key) => {
  const buffer = new Uint8Array(16);
  // initialize iv
  randomFill(buffer, (err, iv) => {
    if (err) throw err;
    // cipher
    const cipher = createCipheriv("aes-128-cbc", key, iv);
    let encrypted = cipher.update(
      fs.readFileSync(path.resolve(".storage/temp.md")).toString(),
      "utf8",
      "hex"
    );
    encrypted += cipher.final("hex");
    console.log(encrypted);

    // decipher
    const decipher = createDecipheriv("aes-128-cbc", key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    console.log(decrypted);
  });
});
