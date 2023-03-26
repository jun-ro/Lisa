const tf = require("@tensorflow/tfjs-node");
const use = require("@tensorflow-models/universal-sentence-encoder");
const csv = require("csv-parser");
const fs = require("fs");

class Chizuru {
  constructor() {
    this.chatHistory = [];
    this.model = null;
    this.dataset = null;
  }

  async init() {
    this.model = await use.load();
    this.dataset = await this.loadDataset();
  }

  async loadDataset() {
    const dataset = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream("./data/csv/chizuru.csv")
        .pipe(csv())
        .on("data", (data) => {
          dataset.push({ name: data.name, line: data.line });
        })
        .on("end", () => {
          resolve(dataset);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }

  async predict(message) {
    // Use last 2 messages in chat history as context
    const context = this.chatHistory.slice(-2).join(" ");
    const combinedMessage = `${context} ${message}`;

    const embeddings = await this.model.embed([
      combinedMessage,
      ...this.dataset.map((x) => x.line),
    ]);
    const inputEmbedding = embeddings.slice([0, 0], [1, -1]);
    const datasetEmbeddings = embeddings.slice([1, 0], [-1, -1]);
    const similarities = tf.matMul(
      inputEmbedding,
      datasetEmbeddings.transpose()
    );
    const index = similarities.argMax(1).dataSync()[0];

    // Update chat history
    this.chatHistory.push(message);

    return index;
  }

  async generate(prompt) {
    const responseIndex = await this.predict(prompt);
    const response = this.dataset[responseIndex].line;
    this.chatHistory.push(prompt);

    return response;
  }
}


module.exports = Chizuru;