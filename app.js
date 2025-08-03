const express = require("express");
const path = require("node:path");

const studentsController = require("./controllers/student");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", studentsController.getStudents);

app.listen(8000);