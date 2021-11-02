const {Blob, Buffer}  = require('buffer')
const { setTimeout } = require('timers/promises');

const blob = new Blob(['hello there']);

const mc1 = new MessageChannel();
const mc2 = new MessageChannel();

mc1.port1.onmessage = async ({ data }) => {
  console.log(await data.arrayBuffer());
  mc1.port1.close();
};


mc2.port1.onmessage = async ({ data }) => {
  await setTimeout(1000);
  console.log(await data.arrayBuffer());
  mc2.port1.close();
};

mc1.port2.postMessage(blob);
mc2.port2.postMessage(blob);

// 发布后 Blob 仍然可用。
blob.text().then(console.log);
