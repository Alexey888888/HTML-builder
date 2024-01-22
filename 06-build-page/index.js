const fs = require('fs');
const path = require('path');

const mkdir = fs.mkdir;

const readdir = require('fs/promises').readdir;
const readfile = require('fs/promises').readFile;

const mkDir = require('fs/promises').mkdir;
const copyFile = require('fs/promises').copyFile;
const stat = require('fs/promises').stat;

function createProjectDistFolder() {
  try {
    mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
      if (err) console.error(err);
    });
  } catch (err) {
    console.error(err);
  }
}

createProjectDistFolder();

async function createComponentNameArr() {
  const componentsNameArr = [];
  try {
    const componentList = await readdir(path.join(__dirname, 'components'), {
      withFileTypes: true,
    });
    componentList.forEach((component) => {
      if (
        !component.isDirectory() &&
        path.extname(path.join(__dirname, 'components', component.name)) ===
          '.html'
      ) {
        componentsNameArr.push(
          path.basename(
            path.join(__dirname, 'components', component.name),
            path.extname(component.name),
          ),
        );
      }
    });
    return componentsNameArr;
  } catch (err) {
    console.log(err);
  }
}

async function createIndexHtml() {
  const names = await createComponentNameArr();
  const componentsObj = {};
  for (const name of names) {
    componentsObj[name] = await readfile(
      path.join(__dirname, 'components', `${name}.html`),
      'utf-8',
    );
  }
  createComponentNameArr().then(
    () => {
      const writeStream = fs.createWriteStream(
        path.join(__dirname, 'project-dist', 'index.html'),
        'utf-8',
      );
      const readStream = fs.createReadStream(
        path.join(__dirname, 'template.html'),
        'utf-8',
      );
      readStream.on('data', (data) => {
        for (const component in componentsObj) {
          const componentName = '{{' + component + '}}';
          const componentInner = componentsObj[component];
          data = data.replace(componentName, componentInner);
        }

        writeStream.write(data);
      });
    },
    (err) => {
      console.error(err);
    },
  );
  //-------------
  copy();
  buildBundle();
  //-------------
}

createIndexHtml();

async function copy(source, destination) {
  try {
    const sourceFolder = source || path.join(__dirname, 'assets');
    const destinationFolder =
      destination || path.join(__dirname, 'project-dist', 'assets');

    await mkDir(destinationFolder, { recursive: true });

    const filesFolder = await readdir(sourceFolder);

    for (const file of filesFolder) {
      const sourceFile = path.join(sourceFolder, file);
      const destinationFile = path.join(destinationFolder, file);

      const fileStat = await stat(sourceFile);

      if (fileStat.isDirectory()) {
        await copy(sourceFile, destinationFile);
      } else {
        await copyFile(sourceFile, destinationFile);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function buildBundle() {
  const writeStream = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'style.css'),
    'utf8',
  );
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
