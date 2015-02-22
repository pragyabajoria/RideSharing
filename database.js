var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'mhcrideshare'
});

connection.connect();

connection.query('SELECT * from rides', function(err, rows, fields) {
  if (!err)
    console.log('Results: \n', rows);
  else
    console.log('Error.');
});

connection.end();