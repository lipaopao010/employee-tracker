const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = require('../config/mysql');




// 1. VIEW ALL EMPLOYEES -- DONE
function viewEmployee() {
  //the combined table of the employee info
  var query = connection.query("SELECT employee.first_name,employee.last_name,title,salary, department.name as department,CONCAT(manager.first_name, ' ', manager.last_name) as manager_name FROM employee_trackerDB.employee INNER JOIN employee_trackerDB.role on employee.role_id = role.id LEFT JOIN employee_trackerDB.employee as manager on employee.manager_id = manager.id INNER JOIN employee_trackerDB.department on role.department_id = department.id",
  function(err, results){
      if (err) throw err;
      console.table(results);
  })
}

//2. BONUS --VIW EMPLOYEE BY DEPARTMENT--DONE
async function viewEmployeeByDepartment() {
    let departments = await connection.queryPromise("SELECT * FROM department")
   
    departments = departments.map(department =>{
        return department.name  
    })

    
    inquirer
    .prompt([
        {
            name: "viewEmployeeDepartment",
            type: "list",
            message: "Which department do you want to view?",
            choices: departments
        }    
    ]).then (function(answer){
        var query = connection.query(
            "SELECT employee.first_name,employee.last_name,department.name FROM employee_trackerDB.employee INNER JOIN employee_trackerDB.role on employee.role_id = role.id INNER JOIN employee_trackerDB.department on role.department_id = department.id WHERE ?",
            {
              name : answer.viewEmployeeDepartment
            },
            function(err, res) {
              if (err) throw err;
              console.table(res);  
            }
        );
    })  
}


// 3. BONUS -- VIEW EMPLOYEE BY MANAGER--DONE
async function viewEmployeeByManager() {
    let managerLists = await connection.queryPromise("SELECT * FROM employee_trackerDB.employee WHERE manager_id is null ")
    
    
    managerLists = managerLists.map(managerList=>{
        return {
            name: managerList.first_name +" " + managerList.last_name,
            value: managerList.id
        }
    })

    inquirer
    .prompt([
        {
            name: "viewEmployeeByManager",
            type: "list",
            message: "Please select the manager.",
            choices: managerLists
        }    
    ]).then (function(answer){
        var query = connection.query(
            "SELECT first_name,last_name FROM employee_trackerDB.employee where ?",
            {
              manager_id : answer.viewEmployeeByManager
            },
            function(err, res) {
              if (err) throw err;
              console.table(res);
              console.log("Here is the employee(s) of the selected manager!");  
            }
        );
    })  
}



//6. ADD EMPLOYEE ----DONE
async function addEmployee() {
    let roles = await connection.queryPromise("SELECT * FROM role")
    let managers = await connection.queryPromise("SELECT * FROM employee ")
    roles = roles.map(role =>{
        return {
            name: role.title,
            value: role.id
        }
    })
    managers = managers.map(manager=>{
        return {
            name: manager.first_name +" " + manager.last_name,
            value: manager.id
        }
    })

  // prompt for info about the new employee
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "role",
        type: "list",
        message: "What is the employee's role?",
        choices: roles,
      },
      {
        name: "employee_manager",
        type: "list",
        message: "What is the employee's manager?",
        choices: managers,
      }
    ])
    .then(function (answer) {
      // when finished prompting, insert new employee into the database
      console.log("Inserting new employee...\n");
      var query = connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role,
          manager_id: answer.employee_manager,
        },
        function (err, res) {
          if (err) throw err;
          console.log("New employee was created successfully!");
        }
      );
    });
}

//9. REMOVE EMPLOYEE----DONE

async function RemoveEmployee() {
    
    let employees =  await connection.queryPromise("SELECT * FROM employee ")
        
    employees = employees.map(employee=>{
        return {
                name: employee.first_name +" " + employee.last_name,
                value: employee.id
        }
    })

    inquirer.prompt([
      {
        name: "remove_Employee",
        type: "list",
        message: "Which employee do you want to remove?",
        choices:employees
      }
    ]).then(function (answer) {
        // when finished prompting, delete employee into the database
        console.log("Deleting the employee...\n");
        var query = connection.query(
            "DELETE FROM employee WHERE ?",
            {
              id: answer.remove_Employee
            },
            function(err, res) {
              if (err) throw err;
              console.log("Employee deleted successfully!");
            }
        );
      });
  }

// 10. BASIC-UPDATE EMPLOYEE ROLE--DONE

 async function UpdateEmployeeRole(){
    let roles =  await connection.queryPromise("SELECT * FROM role")
    let employees =  await connection.queryPromise("SELECT * FROM employee ")
        
        roles = roles.map(role =>{
            return {
                name: role.title,
                value: role.id
            }
        })
        employees = employees.map(employee=>{
            return {
                name: employee.first_name +" " + employee.last_name,
                value: employee.id
            }
        })
    inquirer
    .prompt([
      {
        name: "employee_name",
        type: "list",
        message: "Which employee's role you want to update?",
        choices:employees
      },
      {
        name: "employee_new_role",
        type: "list",
        message: "Which role do you want to update to?",
        choices:roles
      }
    ])
    .then(function (answer) {
      // when finished prompting, updating new employee role into the database
      console.log("Updating new role for the employee...\n");
      var query = connection.query(
        "UPDATE employee SET ? WHERE ?",
        [
            {
              role_id: answer.employee_new_role
            },
            {
              id: answer.employee_name
            }
          ],
        function (err, res) {
          if (err) throw err;
          console.log("New role of the employee was updated successfully!");
        }
      );
    });

}

// 11. BASIC-UPDATE EMPLOYEE MANAGER

async function UpdateEmployeeManager(){
    let employees =  await connection.queryPromise("SELECT * FROM employee ")
        
        
    employees = employees.map(employee=>{
         return {
            name: employee.first_name +" " + employee.last_name,
            value: employee.id
        }
    })
    inquirer
    .prompt([
      {
        name: "employee_name",
        type: "list",
        message: "Which employee's manager you want to update?",
        choices:employees
      },
      {
        name: "employee_new_manager",
        type: "list",
        message: "What's the new manager for that employee?",
        choices:employees
      }
    ])
    .then(function (answer) {
      // when finished prompting, update new employee manager into the database
      console.log("Updating new manager for the employee...\n");
      var query = connection.query(
        "UPDATE employee SET ? WHERE ?",
        [
            {
              manager_id: answer.employee_new_manager
            },
            {
              id: answer.employee_name
            }
          ],
        function (err, res) {
          if (err) throw err;
          console.log("New manager of the employee was updated successfully!");
        }
      );
    });

};


module.exports={
    viewEmployee,
    viewEmployeeByDepartment,
    viewEmployeeByManager,
    addEmployee,
    RemoveEmployee,
    UpdateEmployeeRole,
    UpdateEmployeeManager
}