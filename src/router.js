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
  return (req, res) => {
    const next = createNext(handlers);
    req.url = new URL(req.url, `http://${req.headers.host}`);
    next(req, res);
  };
};

module.exports = { createRouter };
