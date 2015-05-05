var dbfunctions = require('./dbfunctions');
var pass = require('./../config/passport.js');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  port   : 3306,
  database : 'mhcrideshare',
  debug    : false
  
});

global.memberID = -1;
global.admin = false;

connection.connect(); 

dbfunctions.locateUser = function(callback, userId, userName, userEmail) {   
  connection.query("SELECT * FROM members WHERE gmailid = ? ", userId, function (err, rows) {         

    if (err) {
      return callback(err);
    }

    if (rows.length < 1) {
      
      var name = userName.toString().split(" ");

      var data = {
       firstname : name[0],
       lastname : name[1],
       email : userEmail,
       gmailid : userId,
       status: 'inactive',
      };

      connection.query("INSERT INTO members set ? ", data, function (err2, rows2) {        
        if (err2) {
          return callback(err2);
        } 
        connection.query("SELECT * FROM members WHERE gmailid = ? ", userId, function (err3, rows3) {          
            if (err3) { return callback(err3);}            
            if (rows3.length > 0) {
              global.memberID = rows3[0].id;
              if(rows3[0].email=='mhcrideshare@gmail.com' || rows3[0].email=='1.paradoxes.7@gmail.com'){
                global.admin=true;
              } else {
                global.admin=false;
              }
            }
          }); 
      }); 
    } else {
      
      global.memberID = rows[0].id;
      
      if(rows[0].email == 'mhcrideshare@gmail.com' || rows[0].email == '1.paradoxes.7@gmail.com') {
        global.admin = true;
      } else {
        global.admin = false;
      }
    }
 }); 
};

dbfunctions.selectRides = function(callback, destination) {    
    connection.query('SELECT r.id, r.driverid, m.firstname, m.lastname, m.email, m.status, l1.name AS origin, l2.name AS destination,' + 
      ' r.seats, r.datetime, r.flexibility, r.requested, r.offered FROM rides AS r, members AS m, locations as l1, ' +
      'locations as l2 WHERE m.id=r.driverid AND l1.id=r.origin AND l2.id=r.destination AND' + 
      ' r.datetime>= CURDATE() AND l2.name COLLATE UTF8_GENERAL_CI LIKE ?', "%"+destination+"%", function(err, rows) {
    if (err) return callback(err);
    return callback(null, rows);    

  }); 
};

dbfunctions.selectAllRides = function(callback) {    
    connection.query('SELECT r.id, r.driverid, m.firstname, m.lastname, m.email,  m.status, l1.name AS origin, l2.name AS destination,' + 
      ' r.seats, r.datetime, r.flexibility, r.requested, r.offered FROM rides AS r, members AS m, locations as l1, ' +
      'locations as l2 WHERE m.id=r.driverid AND l1.id=r.origin AND l2.id=r.destination AND' + 
      ' r.datetime>= CURDATE()', function(err, rows) {
    if (err) return callback(err);
    return callback(null, rows);    

  }); 
};

dbfunctions.selectMyOfferedRides = function(callback) {    
    connection.query('SELECT r.id, r.driverid, m.firstname, m.lastname, m.email,  m.status, l1.name AS origin, l2.name AS destination,' + 
      ' r.seats, r.datetime, r.flexibility, r.requested, r.offered FROM rides AS r, members AS m, locations as l1, ' +
      'locations as l2 WHERE m.id=r.driverid AND l1.id=r.origin AND l2.id=r.destination AND' + 
      ' r.datetime>= CURDATE() AND r.driverid = ?', global.memberID, function(err, rows) {
    if (err) return callback(err);
    return callback(null, rows);    

  }); 
};

dbfunctions.selectMyRequestededRides = function(callback) {    
    connection.query('SELECT r.id, r.driverid, m.firstname, m.lastname, m.email,  m.status, l1.name AS origin, l2.name AS destination,' + 
      ' r.seats, r.datetime, r.flexibility, r.requested, r.offered FROM rides AS r, members AS m, locations as l1, ' +
      'locations as l2, riderequests as rr WHERE m.id=r.driverid AND l1.id=r.origin AND l2.id=r.destination AND' + 
      ' r.datetime>= CURDATE() AND rr.rideid = r.id AND rr.memberID = ? ', global.memberID, function(err, rows) {
    if (err) return callback(err);
    return callback(null, rows);    

  }); 
};

dbfunctions.selectAllRequestedButNotOfferedRides = function(callback) {    
    connection.query('SELECT r.id, m.firstname, m.lastname, m.email,  m.status, l1.name AS origin, l2.name AS destination,' + 
      ' r.seats, r.datetime, r.flexibility, r.requested, r.offered FROM rides AS r, members AS m, locations as l1, ' +
      'locations as l2, riderequests as rr WHERE m.id=rr.memberid AND l1.id=r.origin AND l2.id=r.destination AND' + 
      ' r.datetime>= CURDATE() AND r.driverid IS NULL AND rr.rideid = r.id', function(err, rows) {
    if (err) return callback(err);
    return callback(null, rows);    

  }); 
};

dbfunctions.offerRide = function(callback, id) {    
  connection.query("UPDATE rides SET driverid=? WHERE id = ? ", [global.memberID,id], function (err, rows) {
      if (err) return callback(err);
      return callback(null);    
  });
};



//returns requests for current user
dbfunctions.selectRequestsForMyOfferedRides = function(callback) {    
    connection.query('SELECT r.id, r.driverid, m.firstname, m.lastname, m.email,  m.status, l1.name AS origin, l2.name AS destination,' + 
      ' r.seats, r.datetime, r.flexibility, r.requested, r.offered FROM rides AS r, members AS m, locations as l1, ' +
      'locations as l2, riderequests as rr WHERE m.id=rr.memberid AND l1.id=r.origin AND l2.id=r.destination AND' + 
      ' r.datetime>= CURDATE() AND rr.rideid = r.id AND r.driverid = ? ', global.memberID, function(err, rows) {
    if (err) return callback(err);
    return callback(null, rows);    

  }); 
};

dbfunctions.selectUserRideRequests = function(callback) {    
    connection.query('SELECT * FROM riderequests WHERE memberid = ?', global.memberID, function(err, rows) {
    if (err) return callback(err);
    return callback(null, rows);    

  }); 
};

dbfunctions.selectAllRideRequests = function(callback) {    
    connection.query('SELECT * FROM riderequests', function(err, rows) {
    if (err) return callback(err);
    return callback(null, rows);    

  }); 
};

dbfunctions.cancelRequest = function(callback, id){
  //console.log("CANCEL REQUEST!");
  //return callback(null);  
  connection.query("DELETE FROM riderequests  WHERE rideid = ? AND memberid = ?", [id, global.memberID], function (err, rows) {
    if (err) return callback(err);
    return callback(null);    
  });
}

dbfunctions.selectRide = function(callback, id) {    
  var ride;
  var locations;
  connection.query("SELECT * FROM rides WHERE id = ? ", [id], function(err, rows) {
  if (err) return callback(err);
  ride = rows;
  connection.query('SELECT * FROM locations', function(err2, rows2) {
      if (err2) return callback(err2);
      locations = rows2;
      return callback(null, ride, locations);   
   });    
  }); 
};

dbfunctions.updateRide = function(callback, id, data) {    
    connection.query("UPDATE rides set ? WHERE id = ? ", [data,id], function(err, rows) {        
      if (err) return callback(err);
      return callback(null);   
    });
};

dbfunctions.requestRide = function(callback, id) {   
  var data = {
    rideid : id,
    memberid : global.memberID,
  };
  
  connection.query("INSERT INTO riderequests set ? ", data, function(err, rows) {        
      if (err) return callback(err);
      return callback(null);   
  });
};

dbfunctions.getLocations = function(callback) {    
  connection.query('SELECT * FROM locations', function(err, rows) {
    if (err) return callback(err);
    return callback(null, rows);    
  });
};

//need to fix 
//get new ride id so that it can be added to riderequests table
//or remove request a ride button from dashboard
dbfunctions.addNewRide = function(callback, data, type) {    
  connection.query('INSERT INTO rides set ? ', data, function(err, rows) {
    if (err) return callback(err);

    if(type=='request') {
      var data = {
        rideid : rows.insertId,
        memberid : global.memberID,
      };
            
      connection.query("INSERT INTO riderequests set ? ", data, function(err, rows) {        
        if (err) {
          return callback(err);
        }
        return callback(null);   
      });  
    } else {
      return callback(null);  
    }
  });
};

dbfunctions.deleteRide = function(callback, id) {   
  connection.query("DELETE FROM rides  WHERE id = ? ", [id], function (err, rows) {
      if (err) return callback(err);
      connection.query("DELETE FROM riderequests  WHERE rideid = ? ", [id], function (err, rows) {
        if (err) return callback(err);
        return callback(null);    
      });
  });

};

dbfunctions.searchRides = function(callback, search) {    
  connection.query('SELECT r.id, m.firstname, m.lastname, m.email,  m.status, l1.name AS origin, l2.name AS destination,' + 
      ' r.seats, r.datetime, r.flexibility FROM rides AS r, members AS m, locations as l1, ' +
      'locations as l2 WHERE m.id=r.driverid AND l1.id=r.origin AND l2.id=r.destination AND' + 
      ' r.datetime>= CURDATE() AND l2.city COLLATE UTF8_GENERAL_CI LIKE ? ', "%"+search+"%", function (err, rows) {
    if (err) return callback(err);
    return callback(null, rows);    
  });
};

dbfunctions.getUserStatus = function(callback, id) {
  connection.query('SELECT * FROM members WHERE id = ?', [id], function(err, rows) {
    if (err) return callback(err);
    return callback(null, rows);    

  });
};

//admin related activities
dbfunctions.getUsers = function(callback) {
  connection.query('SELECT * FROM members', function(err, rows) {
    if (err) return callback(err);
    return callback(null, rows);    

  });
};

dbfunctions.deleteLocation = function(callback, id) {    
  connection.query("DELETE FROM locations  WHERE id = ? ", [id], function (err, rows) {
      if (err) return callback(err);
      return callback(null);    
  });
};

dbfunctions.getLocation = function(callback, id) {    
  connection.query("SELECT * FROM locations  WHERE id = ? ", [id], function (err, rows) {
      if (err) return callback(err);
      return callback(null, rows);    
  });
};

dbfunctions.addNewLocation = function(callback, data) {    
    connection.query('INSERT INTO locations set ? ', data, function(err, rows) {
    if (err) return callback(err);
    return callback(null);    

});
};

dbfunctions.updateLocation = function(callback, id, data) {    
    connection.query("UPDATE locations set ? WHERE id = ? ", [data,id], function(err, rows) {        
      if (err) return callback(err);
      return callback(null);   
    });
};

dbfunctions.deleteUser = function(callback, id) {    
  //remove the user's ride offers and ride requests as well
  connection.query("DELETE FROM riderequests  WHERE memberid = ? ", [id], function (err, rows) {
      if (err) return callback(err);

      connection.query("DELETE FROM rides  WHERE driverid = ? ", [id], function (err, rows) {
           if (err) return callback(err);
      
           connection.query("DELETE FROM members  WHERE id = ? ", [id], function (err, rows) {
               if (err) return callback(err);
                return callback(null);    
           });   

     });   
  });
};

dbfunctions.deactivateUser = function(callback, id) {    
  connection.query("UPDATE members SET status='inactive' WHERE id = ? ", [id], function (err, rows) {
      if (err) return callback(err);
      return callback(null);    
  });
};

dbfunctions.activateUser = function(callback, id) {    
  connection.query("UPDATE members SET status='active' WHERE id = ? ", [id], function (err, rows) {
      if (err) return callback(err);
      return callback(null);    
  });
};

module.exports = dbfunctions;