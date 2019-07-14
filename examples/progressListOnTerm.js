var path = require('path');
var EventEmitter = require('events').EventEmitter;
const progressListOnTerm = require(path.join(__dirname, '../dist/')).progressListOnTerm;


var progressState = [{ title: 'Create .gitignore.', state: '-' },
{ title: 'Initialize package.json.', state: '-' },
{ title: 'Install core webpack modules.', state: '-' },
{ title: 'Customize package.json.', state: '-' },
{ title: 'Install webpack loaders/plugins.', state: '-' },
{ title: 'Create webpack.config.js.', state: '-' }
];

async function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

(async ()=>{
    var reporter = new EventEmitter;
    reporter.on('ok', (title) => {
        for (var i = 0; i < progressState.length; i++)
            if (progressState[i].title === title) {
                progressState[i].state = 'ok';
                progressListOnTerm(progressState);
            }
    });
    reporter.on('ng', (title) => {
        for (var i = 0; i < progressState.length; i++)
            if (progressState[i].title === title) {
                progressState[i].state = 'ng';
                progressListOnTerm(progressState);
            }
    });
    reporter.on('skip', (title) => {
        for (var i = 0; i < progressState.length; i++)
            if (progressState[i].title === title) {
                progressState[i].state = 'skip';
                progressListOnTerm(progressState);
            }
    });
    reporter.emit('ok', 'Create .gitignore.');
    await sleep(1000);
    reporter.emit('skip', 'Initialize package.json.');
    await sleep(1000);
    reporter.emit('ng', 'Install core webpack modules.');
    await sleep(1000);
    reporter.emit('ok', 'Customize package.json.');
    await sleep(1000);
    reporter.emit('ok', 'Install webpack loaders/plugins.');
    await sleep(1000);
    reporter.emit('ok', 'Create webpack.config.js.');
})();
