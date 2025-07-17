// nav-api.js
const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// 数据库连接配置
const db = mysql.createConnection({
  host: 'mysql.sqlpub.com',
  port: 3310,
  user: 'username',
  password: '******',
  database: '******'
});

// 允许跨域
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// 导航数据接口
app.get('/nav', (req, res) => {
  db.query('SELECT * FROM nav_table', (err, results) => {
    if (err) {
      res.status(500).json({ error: '数据库读取失败' });
    } else {
      // 你可以根据实际表结构调整返回格式
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`导航API服务已启动: http://localhost:${port}`);
});
