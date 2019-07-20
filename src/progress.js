const path = require('path');
const util = require('util');
const child_process = require('child_process');
const ansiEscapes = require('ansi-escapes');
const style = require('ansi-styles');
var child_rotation_bar = null;

async function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

process.on('exit', function () {
    child_rotation_bar = null;
});



/**
 * Display option
 * @typedef {Object}    display option
 * @property {Number} width width of bar
 * @property {String} color color name of character
 * @property {String} color color name of bar
 * @property {String} format format(util.format) string
 * @property {Number} max max of total amount
 * @property {String} display_format progress display format
 */

/**
 * Display rotation bar on terminal
 * @param {Number} progress number of progress
 * @param {DisplayOption} options display option
 */
exports.progressRotaionBarOnTerm = function (progressNumber, options) {
    let defaultOptions = {
        width: 20,
        color: 'white',
        bar_color: 'white',
        format: '%d%%',
        max: 100,
        display_format: 'simple'
    };
    Object.assign(defaultOptions, options || defaultOptions);
    if (child_rotation_bar === null) {
        child_rotation_bar = child_process.fork(path.join(__dirname, 'child_rotation_bar'));
    }
    child_rotation_bar.send({ progress: progressNumber.toString() });
}

/** Create bar chart string
 * @param {Number} progressNumber length of bar chart [0..100]
 * @param {Object} options max width of bar chart(default:50)
 * @example
 * blockBarString(100)
 * // ██████████████████████████████████████████████████
 * blockBarString(100, {width:10})
 * // ██████████
 */
exports.blockBarString = function (progressNumber, options) {
    let defaultOption = { width: 50 };
    Object.assign(defaultOption, options || defaultOption);
    progressNumber = progressNumber * defaultOption.width / 10;
    const charBar = ['', '\u258f', '\u258e', '\u258d', '\u258c', '\u258b', '\u258a', '\u2589', '\u2588', '\u2588'];
    let blockNum = Math.floor(progressNumber / 10);
    let counter = 0;
    let buffer = '';
    for (counter = 0; counter < blockNum; counter++) {
        buffer += charBar[8];
    }
    blockNum = progressNumber % 10;
    buffer += charBar[blockNum];
    return buffer;
}

exports.progressListOnTerm = function (state, options) {
    let open, close, bullet;
    let done = true;
    let itemOption = {};
    let defaultOption = {
        ok: { color: 'green', mark: '\u2611' },
        ng: { color: 'red', mark: '\u2612' },
        skip: { color: 'blackBright', mark: '\u2615' },
        std: { color: 'white', mark: '\u2610' }
    };
    if (!Array.isArray(state)) {
        return;
    }
    Object.assign(defaultOption, options || defaultOption);
    process.stdout.write(ansiEscapes.cursorHide);
    for (let i = 0; i < state.length; i++) {
        switch (state[i].state) {
            case 'ok':
                bullet = defaultOption.ok.mark;
                open = style[defaultOption.ok.color].open;
                close = style[defaultOption.ok.color].close;
                break;
            case 'ng':
                bullet = defaultOption.ng.mark;
                open = style[defaultOption.ng.color].open;
                close = style[defaultOption.ng.color].close;
                break;
            case 'skip':
                bullet = defaultOption.skip.mark;
                open = style[defaultOption.skip.color].open;
                close = style[defaultOption.skip.color].close;
                break;
            case '-':
                bullet = defaultOption.std.mark;
                open = style[defaultOption.std.color].open;
                close = style[defaultOption.std.color].close;
                done = false;
                break;
        }
        process.stdout.write(open);
        if (state[i].option !== undefined) {
            if (state[i].option.indentLevel !== undefined) {
                let indentNum = ((state[i].option.indentNum === undefined) ? 2 : state[i].option.indentNum) * state[i].option.indentLevel;
                process.stdout.write(ansiEscapes.cursorMove(1, indentNum));
            }
        }
        process.stdout.write(bullet);
        process.stdout.write(ansiEscapes.cursorMove(1, 0));
        output = state[i].title + '\n';
        process.stdout.write(output);
        process.stdout.write(close);
    }
    process.stdout.write(ansiEscapes.cursorMove(0, -state.length));

    if (done) {
        process.stdout.write(ansiEscapes.cursorShow);
        process.stdout.write(ansiEscapes.cursorMove(0, state.length));
    }
}

exports.progressListWithStatus = function (str, status) {
    var output = status ? '\u2610 ' : '\u2611 ';
    process.stdout.write(output);
    process.stdout.write(str + '\n');
}
