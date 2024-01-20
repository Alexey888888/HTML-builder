const stdout = process.stdout;
const stdin = process.stdin;
const exit = process.exit;

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface(stdin, stdout);
const writableStream = fs.createWriteStream(
  path.join(__dirname, 'text.txt'),
  {
    flags: 'a',
  },
  'utf8',
);

stdout.write('Hi! Input your text:\n');

rl.on('line', (data) => {
  if (data.trim() === 'exit') {
    stdout.write('Bye! Have a nice day!');
    exit();
  }
  writableStream.write(`${data}\n`);
});

rl.on('SIGINT', () => {
  stdout.write('Bye! Have a nice day!');
  exit();
});
