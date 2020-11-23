var vorpal = require('vorpal')();
var fetch = require('node-fetch');
var status = require('./status');

var statusAPI = require('./api.json');

vorpal
  .delimiter('joehannes>>')
  .show();

vorpal
  .command('guess <threeDigits>')
  .option('-v, --verbose', 'Also print internal details')
  .option('-f, --force', 'Always win')
  .option('-d, --debug', 'Always lose')
  .validate(function(opts) {
    const { threeDigits } = opts;

    if (/^\d{3}$/.test(Number(threeDigits))) {
      return true;
    }

    return "Please use a three digit number!!";
  })
  .description('A game of chances and smart words ... Guess, win by chance, get an API assertion and an API quote')
  .alias('play')
  .action(function(args, callback) {
    const { verbose, force, debug } = args.options;
    const win = Boolean(Math.round(Math.random() * args.threeDigits) % 2);

    if (verbose) {
      this.log(`By chance you (win/lose), in boolean status: ${win}`);
    }

    if (force && debug) {
      this.log('Mama didn\'t tell me how to do that!');
      this.log('My head is spinning, bailing out ...');
    }

    if (force || (win && !debug)) {
      fetch(statusAPI.win)
        .then(res => res.json())
        .then((data) => {
          this.log(data);
          status.win.call(this);
        })
        .catch((err) => {
          this.log("Oh my, the API didn't work to our liking, ... what could be wrong here??");
        })
        .finally(callback());
    } else {
      if (win && debug && verbose) {
        this.log("Oh my, I would have won, but ...!!! :/");
      }
      fetch(statusAPI.lose)
        .then(res => res.json())
        .then((data) => {
          this.log(data);
          status.lose.call(this);
        })
        .catch((err) => {
          this.log("Oh my, the API didn't work to our liking, ... what could be wrong here??");
        })
        .finally(callback());
    }
  });
