const path = require('path');
const readdir = require('fs/promises').readdir;
const stat = require('fs/promises').stat;

async function displayFilesInfo() {
  try {
    const files = await readdir(path.join(__dirname, 'secret-folder'), {
      withFileTypes: true,
    });
    files.forEach((file) => {
      if (!file.isDirectory()) {
        stat(path.join(__dirname, 'secret-folder', file.name)).then(
          (fileStat) => {
            console.log(
              `${file.name.split('.')[0]} - ${file.name.split('.')[1]} - ${
                fileStat.size
              }b`,
            );
          },
        );
      }
    });
  } catch (err) {
    console.error(err);
  }
}

displayFilesInfo();
