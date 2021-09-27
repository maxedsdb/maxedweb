//C:/ProgramData/MySQL/MySQL Server 8.0/Uploads
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const csv = require('fast-csv');
const multer = require('multer');
const os = require('os');
const Json2csvParser = require("json2csv").Parser;
// const Contact = require('./models/contact');
// var csvModel   = require('./models/csv');
var csvjson = require('csvtojson');
const { title, mainModule } = require('process');
const db = require('./connection');
const port = 3000;
const emailArray = [];
const resultsPerPage = 20;
const upload = multer({ dest: __dirname + '/upload' });
var numrow = 0;
var last_Search_to_db;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const { SocketAddress } = require('net');
const e = require('express');
const { callbackify } = require('util');


app.set('view engine', 'ejs')


app.get('/', (req, res) => {
  res.render('form.ejs');
})
// async function isEmailValid(email) {
//   return emailValidator.validate(email)
// }

app.post('/finish', (req, res) => {
  res.download(os.tmpdir() + '/output.csv');
});

app.get('/addDb', (req, res) => {
  res.render('addDb');
})
app.post('/createDB', upload.single("csvDb"), (req, res) => {
  var out = [];
  // csv parsing
  filePath = __dirname + '/upload/' + req.file.filename;
  let query = `LOAD DATA INFILE 'tab.tsv' INTO TABLE mardb FIELDS TERMINATED BY '\t'  LINES TERMINATED BY '\r\n' IGNORE 1 LINES`;
  db.query(query, (error, response) => {
    console.log(error || response);
  });
  //UploadCsvDataToMySQL(__dirname+ '/upload/' + req.file.filename);
  console.log('CSV file data has been uploaded in mysql database ');
  res.render('Uploaded.ejs');
});
app.get('/displayDb', async (req, res) => {

  let uurl ="/displayDb?";
  update_query(req.query).then(function([que,arr]){
    console.log(arr.company);
    if(arr.industry!==""){console.log("in comp");console.log(que);uurl=uurl+"industry="+req.query.industry;}
    if(arr.location!=="")uurl=uurl+"&location="+req.query.location;
    if(arr.companyname!=="")uurl=uurl+"&comapnyname="+req.query.companyname;
    if(arr.name!=="")uurl=uurl+"&name="+req.query.name;
    if(arr.title!=="")uurl=uurl+"&title="+req.query.title;    
    db.query(que, (err,resul)=>{
      last_Search_to_db=que;
    const numOfResults = resul.length;
    console.log(numOfResults);
    const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
    let page = req.query.page ? Number(req.query.page) : 1;
    if (page > numberOfPages && numberOfPages != 0) {
      console.log("ko");
      res.redirect(uurl+"&page=" + encodeURIComponent(numberOfPages));
    }
    else if (page < 1) {
      console.log("mm");
      res.redirect(uurl+ "&page=" + encodeURIComponent('1'));
    }
    //Determine the SQL LIMIT starting number

    const startingLimit = (page - 1) * resultsPerPage;
    //Get the relevant number of POSTS for this starting page
    if (numberOfPages != 0 && startingLimit>=0) {
      console.log("PL");
      sql = que+ " LIMIT " +startingLimit + " , "+ resultsPerPage;
      db.query(sql, (err, resu) => {
        if (err) {
          throw err;
          // console.log("ll");
          // res.render('form.ejs');
        }
        else {
          let iterator = (page - 5) < 1 ? 1 : page - 5;
          let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
          if (endingLink < (page + 4)) {
            iterator -= (page + 4) - numberOfPages;
          }
          if (resu.length != 0) {
            console.log("gg");
            res.render('displayDb', { userData: resu, page, iterator, endingLink, numberOfPages, numrow, addr: uurl+"&page=" });

          }
        }
      });
    }
  });
  });
  app.get("/downlDb",function(req,res) {
    db.query(last_Search_to_db,(err,result)=>{
      console.log(result.length+"LL");
    });
    res.download("download.csv");
  })
  // if (req.query.companyname != null) {
    // check(req.query.companyname).then(function (result) {
    //   console.log(result.length + 'JO');
    //   let company = req.query.companyname;
    //   console.log("hi");

      // const numOfResults = result.length;
      // console.log(numOfResults);
      // const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      // let page = req.query.page ? Number(req.query.page) : 1;
      // if (page > numberOfPages && numberOfPages != 0) {
      //   console.log("ko");
      //   res.redirect("/displayDb?companyname=" + company + "&page=" + encodeURIComponent(numberOfPages));
      // }
      // else if (page < 1) {
      //   console.log("mm");
      //   res.redirect("/displayDb?companyname=" + company + "&page=" + encodeURIComponent('1'));
      // }
      // //Determine the SQL LIMIT starting number

      // const startingLimit = (page - 1) * resultsPerPage;
      // //Get the relevant number of POSTS for this starting page
      // if (numberOfPages != 0) {
      //   console.log("PL");
      //   sql = `SELECT * FROM mardb where industry ='${company}' LIMIT ${startingLimit},${resultsPerPage}`;
      //   db.query(sql, (err, result) => {
      //     if (err) {
      //       throw err;
      //       // console.log("ll");
      //       // res.render('form.ejs');
      //     }
      //     else {
      //       let iterator = (page - 5) < 1 ? 1 : page - 5;
      //       let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
      //       if (endingLink < (page + 4)) {
      //         iterator -= (page + 4) - numberOfPages;
      //       }
      //       if (result.length != 0) {
      //         console.log("gg");
      //         res.render('displayDb', { userData: result, page, iterator, endingLink, numberOfPages, numrow, addr: "/displayDb?companyname=" + company + "&page=" });

      //       }
      //     }
      //   });
      // }
      // }

    // }).catch(function (paramers) {
    //   res.render('form.ejs');
    // });

  // }
  // else {
  //   console.log("NHK");
  //   let sql = 'SELECT * FROM mardb where industry=?';
  //   db.query(sql, [],(err, result) => {
  //     if (err) throw err;
  //     const numOfResults = result.length;
  //     const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
  //     let page = req.query.page ? Number(req.query.page) : 1;
  //     if (page > numberOfPages) {
  //       res.redirect('/displayDb?page=' + encodeURIComponent(numberOfPages));
  //     }
  //     else if (page < 1) {
  //       res.redirect('/displayDb?page=' + encodeURIComponent('1'));
  //     }
  //     //Determine the SQL LIMIT starting number
  //     const startingLimit = (page - 1) * resultsPerPage;

  //     //Get the relevant number of POSTS for this starting page
  //     sql = `SELECT * FROM mardb LIMIT ${startingLimit},${resultsPerPage}`;
  //     db.query(sql, (err, result) => {
  //       if (err) throw err;
  //       let iterator = (page - 5) < 1 ? 1 : page - 5;
  //       let endingLink = (iterator + 9) <= numberOfPages ? (iterator + 9) : page + (numberOfPages - page);
  //       if (endingLink < (page + 4)) {
  //         iterator -= (page + 4) - numberOfPages;
  //       }
  //       res.render('displayDb', { userData: result, page, iterator, endingLink, numberOfPages, numrow, addr: "/displayDb?page=" });
  //     });
  //   });
  // }
});

var update_query=(fields)=>{
  return new Promise(function(resolve,rejects){
    var que = "SELECT * FROM mardb where 1=1";
    var per=que;
    var arr={industry:"",location:"",companyname:"",name:"",title:""};
    console.log("IN PROmise");
      if(fields.industry!==null && fields.industry!==""){
          var temp = que+" and industry=" +"\""+fields.industry+"\"" ; 
          db.query(temp,(err,result)=>{
            if(err){
              console.log("no valid input for company name");
            }
            if(result.length!=0){
              console.log("LL");
              que=que+" and industry=" +"\""+fields.industry+"\"" ;
              per=per+" and and industry=" +"\""+fields.industry+"\"";
              console.log(que);
               arr.industry=fields.industry;
            }

          });
      }
      if(fields.location!==null && fields.location!==""){
        var temp = que+" and country=" + "\""+fields.location+"\""; 
          db.query(temp,(err,result)=>{
            if(err){
              console.log("no valid input for location");
            }
            if(result.length!==0){

              que=que+" and country=" +"\""+fields.location+"\"";
              
              arr.location=fields.location;
            }

          });
      }
      if(fields.companyname!==null && fields.companyname!==""){
        var temp = que+" and company=" + "\""+fields.companyname+"\""; 
          db.query(temp,(err,result)=>{
            if(err){
              console.log("no valid input for companyname");
            }
            if(result.length!==0){

              que=que+" and company=" +"\""+fields.companyname+"\"";
              per=per+" and company=" +"\""+fields.companyname+"\"";
              arr.companyname=fields.companyname;
            }

          });
      }
      if(fields.name!==null && fields.name!==""){
        var temp = que+" and contactname like " + "\""+fields.name+"%"+"\""; 
          db.query(temp,(err,result)=>{
            if(err){
              console.log("no valid input for name");
            }
            if(result.length!==0){

              que=que+" and contactname like " +"\""+fields.name+"%"+"\"";
              per=per+" and contactname like " +"\""+fields.name+"%"+"\"";
              arr.name=fields.name;
            }

          });
      }
      if(fields.title!==null && fields.title!==""){
        var temp = que+" and title like " + "\""+"%"+fields.title+"%"+"\""; 
          db.query(temp,(err,result)=>{
            if(err){
              console.log("no valid input for title");
            }
            if(result.length!==0){

              que=que+" and title like " +"\""+"%"+fields.title+"%"+"\"";
              per=per+" and title like " +"\""+"%"+fields.title+"%"+"\"";
              arr.name=fields.name;
            }

          });
      }
      last_Search_to_db=per;
      console.log(last_Search_to_db+ "::::::::::");
      setTimeout(() => resolve([que,arr]), 1000);
  });

}

// var check = (search) => {
//   return new Promise(function (resolve, rejects) {
//     let sq = `Select * from mardb where industry = '${search}'`;
//     db.query(sq, (err, result) => {
//       if (err) { console.log("kiiii"); rejects("oops"); }
//       else if (result.length == 0) {
//         console.log(result.length);
//         rejects(result);
//       }
//       else {
//         resolve(result);
//       }
//     });
//   });
// }

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});