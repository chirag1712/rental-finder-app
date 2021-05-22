module.exports = app => {
    const students = require("../controllers/student.controller.js");
  
    // create a new Student
    app.post("/students", students.create);
  
    // return all Students
    app.get("/students", students.findAll);
  
    // delete a Student by studentId
    app.delete("/students/:student", students.delete);
  
    // delete all Students
    app.delete("/students", students.deleteAll);
  };
