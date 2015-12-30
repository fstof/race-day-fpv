var env    = process.env.NODE_ENV || 'development',
    config = {
      development: {
        yowsup: {
          login: "your number here",
          password: "your password here"
        }
      },

      production: {
        yowsup: {
          login: "your number here",
          password: "your password here"
        }
      }

    };

process.env.NODE_ENV   = env;
module.exports = config[env];
