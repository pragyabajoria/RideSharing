var dbfunctions = require('./dbfunctions');
var pass = require('./../config/passport.js');
// var express = require('express');
// var router = express.Router();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  port   : 3306,
  database : 'mhcrideshare',
  debug    : false
  
});

global.memberID;
var admin=false;

connection.connect(); 

dbfunctions.locateUser = function(callback, userId, userName, userEmail){      
  connection.query("SELECT * FROM members WHERE gmailid = ? ",userId, function (err, rows) {         

    if (err) {return callback(err);}
    
    if (rows.length < 1) {
      var name = userName.toString().split(" ");
      var data = {
       firstname : name[0],
       lastname : name[1],
       email : userEmail,
       gmailid : userId,
       status: 'inactive'
      };

      connection.query("INSERT INTO members set ? ", data, function (err2, rows2) {
        
        if (err2) {return callback(err2);} 

          connection.query("SELECT * FROM members WHERE gmailid = ? ",userId, function (err3, rows3) {            

            if (err3) { return callback(err3);}
            
            if (rows3.length > 0) {
              global.memberID = rows3[0].id;
            }
          }); 
      }); 
    } else {
      global.memberID = rows[0].id;
    }
 }); 
};

dbfunctions.selectRides = function(callback, destination) {    
    connection.query('SELECT r.id, m.firstname, m.lastname, l1.name AS origin, l2.name AS destination,' + 
      ' r.seats, r.datetime, r.flexibility FROM rides AS r, members AS m, locations as l1, ' +
      'locations as l2 WHERE m.id=r.driverid AND l1.id=r.origin AND l2.id=r.destination AND' + 
      ' r.datetime>= CURDATE() AND l2.name COLLATE UTF8_GENERAL_CI LIKE ?', "%"+destination+"%", function(err, rows) {
    if (err) return callback(err);
    //console.log(memberID);
    //connection.end(); 
    //console.log('The results are: ', rows);
    return callback(null, rows);    

  }); 
};

dbfunctions.getLocations = function(callback) {    
  connection.query('SELECT * FROM locations', function(err, rows) {
    if (err) return callback(err);
    //connection.end(); 
    //console.log('The results are: ', rows);
    return callback(null, rows);    

  });
};

//need to fix 
dbfunctions.addNewRide = function(callback, data) {    
    connection.query('INSERT INTO rides set ? ', data, function(err, rows) {
    if (err) return callback(err);
    //connection.end(); 
    //console.log('The results are: ', rows);
    return callback(null);    

});
};

dbfunctions.searchRides = function(callback, search) {    
  connection.query('SELECT r.id, m.firstname, m.lastname, l1.name AS origin, l2.name AS destination,' + 
      ' r.seats, r.datetime, r.flexibility FROM rides AS r, members AS m, locations as l1, ' +
      'locations as l2 WHERE m.id=r.driverid AND l1.id=r.origin AND l2.id=r.destination AND' + 
      ' r.datetime>= CURDATE() AND l2.city COLLATE UTF8_GENERAL_CI LIKE ?', "%"+search+"%", function (err, rows) {
    if (err) return callback(err);
    //connection.end(); 
    //console.log('The results are: ', rows);
    return callback(null, rows);    

  });

};

// dbfunctions.getUserId = function(callback) {
//    return callback(null, memberID); 
// };

//admin access/edit/delete
dbfunctions.getMembersList = function(callback) {
  
};
dbfunctions.updateMember = function(callback, id) {
  
};
dbfunctions.deleteMember = function(callback, id) {
  
};


module.exports = dbfunctions;