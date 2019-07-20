const format = require('../dist/index').format;

console.log('formatter function:');
console.log('{percentage}[%5.2f] => ' + format.formatter("{percentage}[%5.2f]", {percentage: 30.5}));

console.log('wordWrap function:');
let line = 'This is a paragraph with several words in it.';
let wrapLine = format.wordWrap(line, 10).split('\n');
console.log( line + '=>' );
for (let c = 0; c < wrapLine.length; c++) {
    console.log(wrapLine[c]);
}

for (var i = 0; i < 16; i++) {
    for (var j = 0; j < 32; j++) {
        process.stdout.write('\u001b[48;2;' + (i << 4) + ';' + (j<<3) + ';255m ');
    }
    process.stdout.write("\u001b[0m\n");
  }
  