const {
  scrypt,
  createCipheriv,
  randomFill,
  createDecipheriv,
} = require("crypto");

const algorithm = "aes-128-cbc";
const password = "test password";

// 生成密钥
scrypt(password, "salt", 16, (err, key) => {
  if (err) throw err;
  // 初始化iv
  randomFill(new Uint8Array(16), (err, iv) => {
    if (err) throw err;
    // 创建cipher
    const cipher = createCipheriv(algorithm, key, iv);
    let encrypted = "";
    cipher.setEncoding("hex");
    cipher.on("data", (chunk) => (encrypted += chunk));
    cipher.on("end", () => console.log(encrypted));
    // write
    cipher.write("hello");
    cipher.end();

    // Create decipher
    const decipher = createDecipheriv(algorithm, key, iv);
    let decrypted = "";

    decipher.on("readable", () => {
      while (null !== (chunk = decipher.read())) {
        decrypted += chunk.toString("utf8");
      }
    });

    decipher.on("end", () => {
      console.log(decrypted);
    });

    decipher.write(encrypted, "hex");
    decipher.end();
  });
});
