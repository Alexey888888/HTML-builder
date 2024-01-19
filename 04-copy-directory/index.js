const path = require('path');

const readdir = require('fs/promises').readdir;
const unlink = require('fs/promises').unlink;
const mkdir = require('fs/promises').mkdir;
const copyFile = require('fs/promises').copyFile;

async function copyDir() {
  try {
    const filesFolderCopy = await readdir(path.join(__dirname, 'files-copy'));
    filesFolderCopy.forEach((file) => {
      unlink(path.join(__dirname, 'files-copy', file));
    });
  } catch (err) {
    mkdir(path.join(__dirname, 'files-copy'), { recursive: true });
  }
  try {
    const filesFolder = await readdir(path.join(__dirname, 'files'));
    filesFolder.forEach((file) => {
      copyFile(
        path.join(__dirname, 'files', file),
        path.join(__dirname, 'files-copy', file),
      );
    });
  } catch (err) {
    console.log(err);
  }
}

copyDir();
