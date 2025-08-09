const query = require("../db/query");
const {capitalizeFirstLetter} = require("../utils/customSanitizer");
const { query: queryValidation, body, validationResult } = require('express-validator');

const validateStudents = [
  body("first_name")
  .trim().notEmpty().withMessage("First name is required")
  .customSanitizer(capitalizeFirstLetter)
  .isAlpha().withMessage("First name must only contain letters."),
   body("last_name")
  .trim().notEmpty().withMessage("Last name is required")
  .customSanitizer(capitalizeFirstLetter)
  .isAlpha().withMessage("Last name must only contain letters."),
  body("grade_level")
  .trim().notEmpty().withMessage("Student must have grade level")
  .isIn(["11", "12"]).withMessage("Invalid grade level - Grade level must only be 11 or 12"),
  body("grade_average")
  .trim().notEmpty().withMessage("Student must have grade average")
  .isInt({min: 0, max: 100}).withMessage("grade average must be between 0 and 100"),
  body("strand")
  .trim().notEmpty().withMessage("Student must have a strand")
  .toUpperCase().isIn(["STEM", "ABM", "TVL", "GAS", "HUMSS"]).withMessage("Invalid strand")
]

const getStudents = [
  queryValidation("search")
  .optional({ values: "falsy" }).trim()
  .isAlpha('en-US', { ignore: ' ' }).withMessage("Search names must only contain letters."),
  queryValidation("grade_level")
  .optional({ values: "falsy" }).trim().isIn(["11", "12"]).withMessage("Invalid grade level. Grade level must only be 11 or 12"),
  queryValidation("strand")
  .trim().optional({ values: "falsy" }).toUpperCase().isIn(["STEM", "ABM", "TVL", "GAS", "HUMSS"]).withMessage("Invalid strand"),
  queryValidation("grade_average_range").optional({ values: "falsy" }).trim().isIn([
    "90-100",
    "85-89",
    "80-84",
    "75-79",
    "0-74"
  ])
  .withMessage("Invalid grade range selected.")
  ,
  async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("error.ejs", {
      title: "SHS - Grade Inventory",
      errors: errors.errors,
      errorStatus: 400,
    })
  }
  const students = await query.getStudents(req.query);
  res.locals.query = req.query;
  
  res.render("index", {title: "SHS - Grade Inventory", students: students});
}]

const createNewStudentPost = [
  validateStudents,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      const errorsPathAndMessage = errors.errors.reduce((acc, error) => {
        acc[error.path] = error.msg;
        return acc;
      }, {})
      return res.status(400).render("newStudentForm", {errors: errorsPathAndMessage});
    }
    const {first_name, last_name, grade_level, grade_average, strand} = req.body;
    const queryText = "INSERT INTO students (first_name, last_name, grade_level, grade_average, strand_id) VALUES ($1, $2, $3, $4, $5)";
    const strandId = await query.getStrandId(strand);
    const values = [first_name, last_name, grade_level, grade_average, strandId];
    await query.insertStudent(queryText, values);
    res.redirect("/")
}]

const createNewStudentGet = async (req, res) => {
  res.render("newStudentForm");
}

const deleteStudent = async (req, res) => {
  const {studentId} = req.params;
  try {
    await query.deleteStudent(studentId);
    res.redirect("/");
  } catch (error) {
    return res.render("error")
  } 
}

const updateStudentPost = [
  validateStudents,
  async (req, res) => {
    const {studentId} = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("error", {title: "SHS - Grade Inventory", errors: errors.errors, errorStatus: 400})
    }
    await query.updateStudent(studentId, req.body);
    res.redirect("/");
  }

]

module.exports = {getStudents, createNewStudentGet, createNewStudentPost, deleteStudent, updateStudentPost}