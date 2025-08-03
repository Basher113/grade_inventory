const getStudents = (req, res) => {
  res.render("index", {title: "SHS - Grade Inventory", students: "students"});
}

module.exports = {getStudents}