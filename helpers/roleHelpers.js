const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = require('../config/mysql');


//BASIC -- VIEW ALL THE ROLES---DONE
function viewRoles() {
    let query = connection.query("SELECT title,salary,department.name FROM employee_trackerDB.role INNER JOIN employee_trackerDB.department on department_id = department.id",
    function(err, results){
        if (err) throw err;
        console.table(results);
    })
}
  
   
// BASIC--ADD ROLES ---DONE
async function AddRoles() {
    let departments = await connection.queryPromise("SELECT * FROM department")
    departments = departments.map(department=>{
        return{
            name:department.name,
            value:department.id
        }
    })

    inquirer
    .prompt([
      {
        name: "new_role",
        type: "input",
        message: "What is the name of the role you want to add?",
      },
      {
        name: "new_role_salary",
        type: "input",
        message: "What is the salary of this role ?",
      },
      {
        name: "new_role_department",
        type: "list",
        message: "What is the department of the role you want to add?",
        choices: departments
      }
    ])
    .then(function (answer) {
        console.log("Inserting new role...\n");
        var query = connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.new_role,
            salary: answer.new_role_salary,
            department_id: answer.new_role_department
          },
          function (err, res) {
            if (err) throw err;
            console.log("New role was created successfully!");
          }
        );
      });
}

//bonus--delete roles

async function RemoveRole() {
    
    let roles =  await connection.queryPromise("SELECT * FROM role")
      
    roles = roles.map(role =>{
        return {
            name: role.title,
            value: role.id
        }
    })

    inquirer.prompt([
      {
        name: "remove_role",
        type: "list",
        message: "Which role do you want to remove?",
        choices:roles
      }
    ]).then(function (answer) {
        
        console.log("Deleting the role...\n");
        var query = connection.query(
            "DELETE FROM role WHERE ?",
            {
              id: answer.remove_role
            },
            function(err, res) {
              if (err) throw err;
             
            }
        );
      });
  }

module.exports={
    viewRoles,
    AddRoles,
    RemoveRole
}