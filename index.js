const args = require('args');
const queue = require('./queue');

args.option('threads', 'Maximum number of threads', 4)
    .option('match', 'Glob pattern used to match packages');

const flags = args.parse(process.argv);

if (flags.threads) {
    queue.create(Number(flags.threads));
}

const app = require('import-jsx')('./main');
app.render(flags.match || '*');
