const bodyParser = require('myserver-bodyparser');

const matches = function (method, path) {
  return this.method.toLowerCase() === method.toLowerCase()
    && this.url.pathname.toLowerCase() === path.toLowerCase();
};

const createNext = handlers => {
  let index = -1;
  const next = (req, res) => {
    index++;
    const current = handlers[index];
    if (current) {
      current(req, res, () => next(req, res));
    }
  };
  return next;
};

const createRouter = (...handlers) => {
  handlers.unshift(bodyParser);
  return (req, res) => {
    console.log(req.method, req.url);
    req.url = new URL(req.url, `http://${req.headers.host}`);
    req.matches = matches.bind(req);
    const next = createNext(handlers);
    next(req, res);
  };
};

module.exports = { createRouter };
