
var dbfunctions = require('./dbfunctions');
// var express = require('express');
// var router = express.Router();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  port	 : 3306,
  database : 'mhcrideshare',
  debug    : false
  
});

connection.connect(); 

dbfunctions.selectAllRides = function(callback, destination) {    
  //connection.query("SELECT * FROM rides where id=?",[id], function(err, rows) {
  connection.query('SELECT r.id, m.firstname, m.lastname, l1.name AS origin, l2.name AS destination,' + 
      ' r.seats, r.datetime, r.flexibility FROM rides AS r, members AS m, locations as l1, ' +
      'locations as l2 WHERE m.id=r.driverid AND l1.id=r.origin AND l2.id=r.destination AND' + 
      ' r.datetime>= CURDATE() AND l2.name COLLATE UTF8_GENERAL_CI LIKE ?', "%"+destination+"%", function(err, rows) {
    if (err) return callback(err);
    //connection.end(); 
    //console.log('The results are: ', rows);
    return callback(null, rows);    

  });
  
};

// router.get('/rides', function (req, res) {
//   connection.query('SELECT * FROM rides', function (err, rows) {    
//     if (err) {
//       res.send('database error');
//     }
//     else {
//       //res.render('rides', { title : 'ride', data:rows });
//       res.render('pages/destination', {title: 'Bradley Airport', data:rows});
//     }
//   });
// });


//module.exports = router;

// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'root',
//   port   : 3306,
//   database : 'mhcrideshare',
//   debug    : false
  
// });
// connection.connect();
// connection.query('SELECT * FROM rides', function(err, rows) {
//   if (err) throw err;
//   console.log('The results are: ', rows);
// });

// connection.end(); 
module.exports = dbfunctions;
