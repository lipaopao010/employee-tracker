const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");

});

connection.queryPromise = function(statement, data=null){
   return new Promise(function(resolve, reject){

    let queryCallback=function(err, result){
      if(err){
        return reject(err)
      }
      resolve(result)
    }

     if(!data){
       connection.query(statement, data, queryCallback)
     }else{
      connection.query(statement, queryCallback)
     }
    })
     
  
}


module.exports= connection