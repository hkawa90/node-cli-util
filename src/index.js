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
function progressRotaionBarOnTerm(progressNumber, options) {
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
function blockBarString(progressNumber, options) {
    let defaultOption = {width: 50};
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

function progressListOnTerm(state, options) {
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

function progressListWithStatus(str, status) {
    var output = status ? '\u2610 ' : '\u2611 ';
    process.stdout.write(output);
    process.stdout.write(str + '\n');
}

/** Parse format string
 * @example
 * formatParser('[{progress_bar}[%30c]] {percentage}[%3d]% | ETA: {eta}s | {value}/{total}')
 * 
 */
function formatParser(formatString, args, options) {
    let defaultOptions = {
        width: 20,
        color: 'white',
        bar_color: 'white',
        format: '%d%%',
        max: 100,
        display_format: 'simple'
    };
    // console.log('formatParser start');
    Object.assign(defaultOptions, options || defaultOptions);
    let result;
    let index = 0;
    let buffer = '';
    const regPattern = /{(\w+)}(\[(%{1}(\-{0,1}\d*\.?\d)?(l?[csfduxeg])?)\])?/g;
    while ((result = regPattern.exec(formatString)) !== null) {
        // console.log(result);
        field_width = result[4]; // field width(negative value : left alignment)
        conversion_specifier = result[5]; // conversion specifier l?[csfduxeg]
        buffer += formatString.substring(index, result.index);
        formattedString = '';
        if (args[result[1]] !== undefined) {
            switch (conversion_specifier) {
                case 'c':
                    if (field_width === undefined) {
                        formattedString = args[result[1]].substring(0, 1);
                    } else {
                        if (parseInt(field_width, 10) < 0) {
                            formattedString = args[result[1]].substring(0, 1).padEnd(-field_width);
                        } else {
                            formattedString = args[result[1]].substring(0, 1).padStart(field_width);
                        }
                    }
                    break;
                case 's':
                    if (field_width === undefined) {
                        formattedString = args[result[1]];
                    } else {
                        if (parseInt(field_width, 10) < 0) {
                            formattedString = args[result[1]].toString().padEnd(-field_width);
                        } else {
                            formattedString = args[result[1]].toString().padStart(field_width);
                        }
                    }
                    break;
                case 'f':
                    break;
                case 'd':
                case 'u': // unsigned
                    var number = (conversion_specifier === 'u') ? parseInt(args[result[1]], 10) >>> 0 : parseInt(args[result[1]], 10);
                    if (field_width === undefined) {
                        // console.log('field_width === undefined');
                        if (conversion_specifier === 'u')
                            formattedString = number >>> 0;
                        else
                            formattedString = number;
                    } else {
                        var zeroPadding = field_width.substring(0, 1) === '0' ? true : false;
                        // console.log('zeroPadding ', zeroPadding, ' field_width:', field_width, ' field_width[0..1]:', field_width.substring(0, 1));
                        if (parseInt(field_width, 10) < 0) {
                            if (zeroPadding)
                                formattedString = number.toString(10).padEnd(-field_width, '0');
                            else
                                formattedString = number.toString(10).padEnd(-field_width);
                        } else {
                            if (zeroPadding)
                                formattedString = number.toString(10).padStart(field_width, '0');
                            else
                                formattedString = number.toString(10).padStart(field_width);
                        }
                    }
                    break;
                case 'x': // hex
                    break;
                case 'e':
                    break;
                case 'g':
                    break;
            }
            if (formattedString === '')
                formattedString = args[result[1]]
            buffer += formattedString; // formatted string
        }
        index = result.index + result[0].length;
    }
    if (index !== formatString.length) {
        buffer += formatString.substring(index, formatString.length);
    }
    return buffer;
}

module.exports.progressListWithStatus = progressListWithStatus;
module.exports.progressListOnTerm = progressListOnTerm;
module.exports.progressRotaionBarOnTerm = progressRotaionBarOnTerm;
module.exports.formatParser = formatParser;
module.exports.blockBarString = blockBarString;