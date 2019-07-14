const ansiEscapes = require('ansi-escapes');
const style = require('ansi-styles');


const charBar = ['-', '\\', '|', '/'];
var progress = 0;
var counter = 0;

async function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

function display_progress() {
    process.stdout.write('[' + progress + '%]' + charBar[counter % 4] + '\n');
    process.stdout.write(ansiEscapes.cursorMove(0, -1));
}

process.on("message", function (msg) {
    progress = parseInt(msg.progress, 10);
    //console.log(progress);
    if (progress === 100) {
        process.exit(0);
    }
});

(async () => {
    for (; ; counter++) {
        display_progress();
        await sleep(300);
        if (counter === 100)
            counter = 0;
    }
})();