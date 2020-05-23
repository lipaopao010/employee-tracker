const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = require('../config/mysql');

// 4. BASIC-- VIEW ALL THE DEPARTMENTS -- DONE
async function viewDepartments(){

    console.log('hellooo');
    let departments = await connection.queryPromise("SELECT * FROM department").catch((err) => console.log(err))
   
    departments = departments.map(department =>{
        return department.name  
    })
    console.log(departments);
}

// 7. BASIC--ADD DEPARTMENT --DONE

function AddDepartment() {
    inquirer
    .prompt([
      {
        name: "new_department",
        type: "input",
        message: "What is the department name you want to add?",
      }
    ])
    .then(function (answer) {
        console.log("Inserting new department...\n");
        var query = connection.query(
          "INSERT INTO department SET ?",
          {
            name:answer.new_department
          },
          function (err, res) {
            if (err) throw err;
            console.log("New department was created successfully!");
          }
        );
    });
}


//bonus--delete departments

async function RemoveDepartment() {
    let departments = await connection.queryPromise("SELECT * FROM department")
   
    departments = departments.map(department =>{
        return department.name  
    })

    inquirer
    .prompt([
      {
        name: "remove_department",
        type: "list",
        message: "What is the department name you want to delete?",
        choices: departments
      }
    ])
    .then(function (answer) {
        console.log("delete the department...\n");
        var query = connection.query(
          "DELETE FROM department WHERE ?",
          {
            name:answer.remove_department
          },
          function (err, res) {
            if (err) throw err;
            console.log("The chosen department was delete successfully!");
          }
        );
    });
}

module.exports={
    viewDepartments,
    AddDepartment,
    RemoveDepartment
}