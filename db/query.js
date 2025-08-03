const pool = require("./pool");

const getStudents = async (filters=null) => {
  const query = `
    SELECT students.id, students.first_name, students.last_name, students.grade_level, students.grade_average, strands.strand
    FROM students as students
    JOIN strands as strands
    ON students.strand_id = strands.id
  `

  const {rows} = await pool.query(query);
  return rows;
}

module.exports = {getStudents};