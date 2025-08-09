const express = require("express");
const path = require("node:path");

const studentsController = require("./controllers/student");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const staticFiles = path.join(__dirname, "static");
app.use(express.static(staticFiles));
app.use(express.urlencoded({ extended: false }));


app.get("/", studentsController.getStudents);
app.post("/new", studentsController.createNewStudentPost);
app.get("/new", studentsController.createNewStudentGet);
app.get("/delete/:studentId", studentsController.deleteStudent);
app.post("/update/:studentId", studentsController.updateStudentPost);


app.listen(process.env.APP_PORT);