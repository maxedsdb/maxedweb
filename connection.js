const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'sql6.freemysqlhosting.net',
  user: 'sql6447346',
  password: '3EKGlxnRrM',
  database:'sql6447346'
});
db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
module.exports=db;
