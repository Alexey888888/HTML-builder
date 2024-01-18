const stdout = process.stdout;
const fs = require('fs');
const path = require('path');

const readableStream = fs.createReadStream(
  path.join(__dirname, 'text.txt'),
  'utf8',
);

readableStream.on('data', (chunk) => stdout.write(chunk));
