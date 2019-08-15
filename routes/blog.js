var express = require('express');
var router = express.Router();
const {
  getList,
  getDetail,
  addBlog,
  updateBlog,
  delBlog
}  = require('../controller/blog.js');
const loginCheck = require('../middleware/loginCheck');
const { SuccessModel, ErrorModel } = require('../model/resModel');

router.get('/list', function(req, res, next) {
  let author = req.query.author || '';
  const keyword = req.query.keyword || '';
  if(req.query.isadmin) {
    if(req.session.username == null) {
      res.json(
        new ErrorModel('未登录')
      );
      return;
    }
    author = req.session.username;
  }
  const resilt = getList(author, keyword);
  return resilt.then(listData => {
    res.json(new SuccessModel(listData));
  });
});

router.get('/detail', function(req, res, next) {
  const id = req.query.id || '';
  const detailResult = getDetail(id);
  return detailResult.then(detailData => {
    res.json(new SuccessModel(detailData));
  });
});

router.post('/add', loginCheck, function(req, res, next) {
  req.body.author = req.session.username;
  const addResult = addBlog(req.body);
  return addResult.then(val => {
    if(val) {
      res.json(new SuccessModel(val));
    } else {
      res.json(new ErrorModel("新建文章失败"));
    }
  });
});

router.post('/update', loginCheck, function(req, res, next) {
  req.body.author = req.session.username;
  const id = req.query.id || '';
  const resultUpdate = updateBlog(id, req.body);
  return resultUpdate.then(val => {
    if(val) {
      res.json(new SuccessModel(val));
    } else {
      res.json(new ErrorModel("修改文章失败"));
    }
  });
});

router.post('/del', loginCheck, function(req, res, next) {
  const id = req.query.id || '';
  const delData = delBlog(id, req.session.username);
  return delData.then(val => {
    if(val) {
      res.json(new SuccessModel(val));
    } else {
      res.json(new ErrorModel("删除文章失败"));
    }
  });
});

module.exports = router;