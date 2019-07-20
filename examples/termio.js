const termio = require('../dist/index').termio;

(async () => {
    console.log('Cursor Pos:', await termio.queryCurPos());
    console.log('Input key (Y/N)');
    do {
        var key = await termio.keyPressed();
        console.log(key);
    } while ((key.name != 'y') && (key.name != 'n'));
})();

