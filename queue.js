const Queue = require('promise-queue');

let instance;

module.exports.create = function(maxConcurrent) {
    instance = new Queue(maxConcurrent || 4, Infinity);
}

module.exports.get = function() {
    return instance;
};
