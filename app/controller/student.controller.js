const pool = require("../config/db");

// CREATE — Add a student
const createStudent = async (req, res) => {
  try {
    const { name, email, age, course } = req.body;
    console.log(req.body);

    if (!name || !email || age === undefined || !course) {
      return res.status(400).json({
        success: false,
        message: "Name, email, age and course are required",
      });
    }

    const parsedAge = Number(age);

    if (!Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      return res.status(400).json({
        success: false,
        message: "Age must be an integer between 1 and 120",
      });
    }

    const sql = `
            INSERT INTO students (name, email, age, course)
            VALUES (?, ?, ?, ?)
        `;

    const [result] = await pool.execute(sql, [
      name.trim(),
      email.trim(),
      parsedAge,
      course.trim(),
    ]);

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: {
        id: result.insertId,
        name: name.trim(),
        email: email.trim(),
        age: parsedAge,
        course: course.trim(),
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A student with this email already exists",
      });
    }

    console.error("Create student error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
//=====================================================================
// Read Get All students
const getAllStudents = async (req, res) => {
  try {
    const sql = `
            SELECT id, name, email, age, course, created_at
            FROM students
            ORDER BY id DESC
        `;

    const [students] = await pool.query(sql);

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Get students error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
//==========================================================
//Read Get a single single by ID

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const sql = `
            SELECT id, name, email, age, course, created_at
            FROM students
            WHERE id = ?
        `;

    const [students] = await pool.execute(sql, [id]);

    if (students.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      student: students[0],
    });
  } catch (error) {
    console.error("Get student error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// ========================================================
// UPDATE — Update a student's details
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age, course } = req.body;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    if (!name || !email || age === undefined || !course) {
      return res.status(400).json({
        success: false,
        message: "Name, email, age and course are required",
      });
    }

    const parsedAge = Number(age);

    if (!Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      return res.status(400).json({
        success: false,
        message: "Age must be an integer between 1 and 120",
      });
    }

    const sql = `
            UPDATE students
            SET name = ?, email = ?, age = ?, course = ?
            WHERE id = ?
        `;

    const [result] = await pool.execute(sql, [
      name.trim(),
      email.trim(),
      parsedAge,
      course.trim(),
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A student with this email already exists",
      });
    }

    console.error("Update student error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// ========================================================
// DELETE — Delete a student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const sql = "DELETE FROM students WHERE id = ?";

    const [result] = await pool.execute(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete student error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// ===============================================================
module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
