const Student = require("../models/student.model.js");

// create a new Student
exports.create = (request, result) => {
  // Validate request
  if (!request.body) {
    result.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Student
  const student = new Student({
    email: request.body.email,
    name: request.body.name,
  });

  // Save Student in the database
  Student.create(student, (err, data) => {
    if (err)
      result.status(500).send({
        message:
          err.message || "Some error occurred while creating the Student."
      });
    else result.send(data);
  });
};

// return all Students
exports.findAll = (request, result) => {
  Student.getAll((err, data) => {
    if (err)
      result.status(500).send({
        message:
          err.message || "Some error occurred while retrieving students."
      });
    else result.send(data);
  });
};

// delete a Student by studentId
exports.delete = (request, result) => {
  Student.remove(request.params.studentId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        result.status(404).send({
          message: `Not found Student with id ${request.params.studentId}.`
        });
      } else {
        result.status(500).send({
          message: "Could not delete Student with id " + request.params.studentId
        });
      }
    } else result.send({ message: `Student was deleted successfully!` });
  });
};

// delete all Students
exports.deleteAll = (request, result) => {
  Student.removeAll((err, data) => {
    if (err)
      result.status(500).send({
        message:
          err.message || "Some error occurred while removing all students."
      });
    else result.send({ message: `All Students were deleted successfully!` });
  });
};
