const query = require("../db/query");

const getStudents = async (req, res) => {
  const students = await query.getStudents(req.query);
  console.log(students, "students");
  res.render("index", {title: "SHS - Grade Inventory", students: students});
}

module.exports = {getStudents}