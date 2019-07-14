var path = require('path');
const progress = require(path.join(__dirname, '../dist/')).progressRotaionBarOnTerm;

async function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

(async ()=>{
    for (var i = 0; i <= 100; i++) {
        progress(i);
        await sleep(100);
    }
})();