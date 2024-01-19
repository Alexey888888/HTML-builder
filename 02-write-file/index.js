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
  if (data.trim() === 'exit') exit();
  writableStream.write(`${data}\n`);
});

process.on('exit', () => {
  stdout.write('Bye! Have a nice day!');
});
