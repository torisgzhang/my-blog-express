const uuid = require('uuid/v1');
const xss = require('xss');
const { exec, escape } = require('../db/mysql');

const getList = (author, keyword) => {
  let sql = `SELECT * from tg_blogs WHERE 1=1 `;
  if(author) {
    sql += `AND author='${author}' `;
  }
  if(keyword) {
    sql += `AND title like '%${keyword}%' `;
  }
  sql += `ORDER BY createtime desc`;
  return exec(sql);
}

const getDetail = (id) => {
  let sql = `SELECT * from tg_blogs WHERE articleid='${id}'`;
  return exec(sql).then(row => {
    return row[0];
  })
}

const addBlog = (postData = {}) => {
  const title = xss(postData.title);
  const content = xss(postData.content);
  let sql = `
    INSERT INTO tg_blogs (articleid, title, content, createtime, author) 
    VALUES('${uuid()}', ${escape(title)}, ${escape(content)}, ${Date.now()}, '${postData.author}')
  `;
  return exec(sql).then(addData => {
    if(addData.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  });
}

const updateBlog = (id, postData = {}) => {
  let sql = `
    UPDATE tg_blogs SET title=${escape(postData.title)}, content=${escape(postData.content)} WHERE articleid='${id}'
  `;
  return exec(sql).then(updateData => {
    if(updateData.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  });
}

const delBlog = (id, author) => {
  let sql = `
    DELETE from tg_blogs WHERE articleid='${id}' AND author='${author}'
  `;
  return exec(sql).then(delData => {
    if(delData.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  });
}

module.exports = {
  getList,
  getDetail,
  addBlog,
  updateBlog,
  delBlog
}