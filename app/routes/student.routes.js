const express = require("express");

const router = express.Router();

const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controller/student.controller");

// CREATE: Add a new student
router.post("/create", createStudent);

// READ: Get all students
router.get("/getAll", getAllStudents);

// READ: Get a student by ID
router.get("/getById/:id", getStudentById);
// UPDATE: Update a student
router.put("/update/:id", updateStudent);

// DELETE: Delete a student
router.delete("/delete/:id", deleteStudent);

module.exports = router;
