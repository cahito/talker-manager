const fs = require('fs/promises');

const readFile = async (path) => {
  const data = await fs.readFile(path);
  const dataRead = JSON.parse(data);
  return dataRead;
};

module.exports = { readFile };
