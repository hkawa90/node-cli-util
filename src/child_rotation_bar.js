const ansiEscapes = require('ansi-escapes');
const style = require('ansi-styles');


const charBar = ['-', '\\', '|', '/'];
var progress = 0;
var counter = 0;
var intervalObj = null;


function display_progress() {
    process.stdout.write('[' + progress + '%]' + charBar[counter % 4] + '\n');
    process.stdout.write(ansiEscapes.cursorMove(0, -1));
}

process.on("message", function (msg) {
    progress = parseInt(msg.progress, 10);
    display_progress();

    if (progress === 100) {
        clearInterval(intervalObj);
        process.exit(0);
    }
});

intervalObj = setInterval(() => {
    counter++;
    display_progress();
  }, 300);