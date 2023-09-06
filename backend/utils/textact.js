const AWS = require("./AWS");

const textract = new AWS.Textract();

const extractText = async (image) => {
  const params = {
    Document: {
      Bytes: image,
    },
  };
  try {
    const result = await textract.detectDocumentText(params).promise();

    const extractedText = result.Blocks.reduce((text, block) => {
      if (block.BlockType === "LINE") {
        text += block.Text + "\n";
      }
      return text;
    }, "");

    return extractedText;
  } catch (error) {
    console.error("Error extracting text:", error);
    throw error;
  }
};

module.exports = extractText;
