const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = require("./config/mysql");

const {
  viewEmployee,
  viewEmployeeByDepartment,
  viewEmployeeByManager,
  addEmployee,
  RemoveEmployee,
  UpdateEmployeeRole,
  UpdateEmployeeManager
} = require("./helpers/employeeHelper");

const {
  viewRoles,
  AddRoles,
  RemoveRole
} = require("./helpers/roleHelpers");

const {
  viewDepartments,
  AddDepartment,
  RemoveDepartment
} = require("./helpers/departmentHelper");


start();
//AddRoles()
//viewRoles()
//AddDepartment()
//viewDepartments()
//UpdateEmployeeRole()
//RemoveEmployee()
//viewEmployeeByDepartment();
//viewEmployeeByManager()
//UpdateEmployeeManager()
//addEmployee()
//viewEmployee()
//RemoveRole()
//RemoveDepartment()



function start() {
  inquirer
    .prompt({
      name: "actions",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "View all employees by department",
        "View all employees by manager",
        "View Departments",
        "View Roles",
        "Add employee",
        "Add department",
        "Add roles",
        "Remove employee",
        "Update employee role",
        "Update employee manager",
        "Remove department",
        "Remove role",
        "EXIT"
      ],
    })
    .then(function (answer) {
      switch (answer.actions) {
        case "View all employees":
          viewEmployee();
          break;

        case "View all employees by department":
          viewEmployeeByDepartment();
          break;

        case "View all employees by manager":
          viewEmployeeByManager();
          break;

        case "View Departments":
          viewDepartments();
          break;

        case "View Roles":
          viewRoles();
          break;

        case "Add employee":
          addEmployee();
          break;

        case "Add department":
          AddDepartment();
          break;

        case "Add roles":
          AddRoles();
          break;

        case "Remove employee":
          RemoveEmployee();
          break;

        case "Update employee role":
          UpdateEmployeeRole();
          break;

        case "Update employee manager":
          UpdateEmployeeManager();
          break;

        case "Remove department":
          RemoveDepartment();
          break;

        case "Remove role":
          RemoveRole();
          break;

        case "EXIT":
          connection.end();
          return true;  
      }

    }).then((toExit) => {

      if(!toExit){
        start()
      }

    });
    
}









