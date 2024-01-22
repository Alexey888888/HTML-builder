const fs = require('fs');
const path = require('path');

const mkdir = fs.mkdir;

const readdir = require('fs/promises').readdir;
const readfile = require('fs/promises').readFile;

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
}

createIndexHtml();
