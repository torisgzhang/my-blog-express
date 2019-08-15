var express = require('express');
var router = express.Router();
const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

router.post('/login', function(req, res, next) {
  const { username, password } = req.body;
  const resultLogin = login(username, password);
  return resultLogin.then(userInfo => {
    if(userInfo.username) {
      //操作cookie
      req.session.username = userInfo.username;
      req.session.realname = userInfo.realname;
      res.json(new SuccessModel(userInfo));
      return;
    }
    res.json(new ErrorModel('登录失败，请输入正确的用户名或密码'));
  });
});

module.exports = router;