const { exec, escape } = require('../db/mysql');
const { genPassword } = require('../utils/cryp');

const login = (username, password) => {
  password = genPassword(password);
  password = escape(password);
  let sql = `SELECT * from tg_users WHERE username=${escape(username)} AND password=${password}`;
  console.log(sql)
  return exec(sql).then(loginResult => {
    return loginResult[0] || {};
  });
}

module.exports = {
  login
}