const query = require("../db/query");
const {capitalizeFirstLetter} = require("../utils/customSanitizer");
const { query: queryValidation, body, validationResult } = require('express-validator');

const getStudents = [
  queryValidation("search")
  .optional({ values: "falsy" }).trim()
  .isAlpha('en-US', { ignore: ' ' }).withMessage("Search names must only contain letters."),
  queryValidation("grade_level")
  .optional({ values: "falsy" }).trim().isIn(["11", "12"]).withMessage("Invalid grade level. Grade level must only be 11 or 12"),
  queryValidation("strand")
  .trim().optional({ values: "falsy" }).toUpperCase().isIn(["STEM", "ABM", "TVL", "GAS", "HUMMS"]).withMessage("Invalid strand"),
  async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
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
  .toUpperCase().isIn(["STEM", "ABM", "TVL", "GAS", "HUMMS"]).withMessage("Invalid strand")
  ,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      const errorsPathAndMessage = errors.errors.reduce((acc, error) => {
        acc[error.path] = error.msg;
        return acc;
      }, {})
      console.log(errorsPathAndMessage);
      return res.status(400).render("newStudentForm", {errors: errorsPathAndMessage});
    }
    res.redirect("/")
}]

const createNewStudentGet = async (req, res) => {
  res.render("newStudentForm");
}



module.exports = {getStudents, createNewStudentGet, createNewStudentPost}