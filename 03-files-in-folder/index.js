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
              `${path.basename(
                path.join(__dirname, 'secret-folder', file.name),
                path.extname(file.name),
              )} - ${path.extname(file.name).slice(1)} - ${fileStat.size}b`,
            );
          },
          (err) => {
            console.error(err);
          },
        );
      }
    });
  } catch (err) {
    console.error(err);
  }
}

displayFilesInfo();
