const path = require('path');
const readdir = require('fs/promises').readdir;
const fs = require('fs');

const writeStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
  'utf8',
);

async function buildBundle() {
  const files = await readdir(path.join(__dirname, 'styles'), {
    withFileTypes: true,
  });
  files.forEach((file) => {
    if (
      !file.isDirectory() &&
      path.extname(path.join(__dirname, 'styles', file.name)) === '.css'
    ) {
      const readStream = fs.createReadStream(
        path.join(__dirname, 'styles', file.name),
        'utf-8',
      );
      readStream.on('data', (data) => {
        writeStream.write(data);
      });
    }
  });
}

buildBundle();
