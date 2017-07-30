/*eslint no-console: ["error", { allow: ["warn", "error", "info"] }] */
module.exports = {
  info : (msg) => {
    console.info('\x1b[36m%s\x1b[0m', msg);
  },
  success : (msg) => {
    console.info('\x1b[32m%s\x1b[0m', msg);
  },
  warn: (msg) => {
    console.warn('\x1b[33m%s\x1b[0m', msg);
  },
  error: (msg) => {
    console.error('\x1b[31m%s\x1b[0m', msg);
  }
};
