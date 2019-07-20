const readline = require('readline');
const queryCurrentCursorPosition = '\u001b[6n';

var currentCursorPosition = {};
/** Query cursor posiotn on terminal using ansi escape 
 * @async
 * @returns {Promise<Object>} return position
 * @example
 * await queryCurPos();
 * // {x: '1', y: '20'}
*/
exports.queryCurPos = async function () {
    return new Promise((resolve, reject) => {
        readline.emitKeypressEvents(process.stdin);

        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.setRawMode(true); // disable echo-back
        process.stdout.write(queryCurrentCursorPosition);
        process.stdin.on('keypress', function keyIn(ch, key) {
            const regPattern = /^\u001b\[(\d+);(\d+)R$/g;
            var r = regPattern.exec(key.sequence);
            process.stdin.pause();
            process.stdin.setRawMode(false);
            process.stdin.removeListener("keypress", keyIn);
            if (r != null) {
                process.stdin.pause();
                process.stdin.setRawMode(false);
                process.stdin.removeListener("keypress", keyIn);
                currentCursorPosition = { x: r[2], y: r[1] };
                resolve(currentCursorPosition);
            }
            resolve(null);
        });
    });
}

/** Get keyboard event from terminal
 * @async
 * @returns {Promise<Object>} key event
 * @example
 * await keyPressed(); // Push enter key.
 * // { sequence: '\r',
 * // name: 'return',
 * // ctrl: false,
 * // meta: false,
 * // shift: false }
*/
exports.keyPressed = async function () {
    return new Promise((resolve, reject) => {
        readline.emitKeypressEvents(process.stdin);

        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.setRawMode(true);
        process.stdin.on('keypress', function keyIn(ch, key) {
            process.stdin.pause();
            process.stdin.setRawMode(false);
            process.stdin.removeListener("keypress", keyIn);
            resolve(key);
        });
    });
}