const pool = require("./pool");

const getStudents = async (filters=null) => {
  const conditions = [];
  const queryParameterValues = [];
  
  if (filters) {
    console.log(filters)
    if (Object.keys(filters).length > 0) {
      if (filters.search) {
        queryParameterValues.push(`%${filters.search}%`);
        conditions.push(`(students.first_name ILIKE $${queryParameterValues.length} OR students.last_name ILIKE $${queryParameterValues.length})`);
      }
      if (filters.grade_level) {
        queryParameterValues.push(parseInt(filters.grade_level));
        conditions.push(`(students.grade_level = $${queryParameterValues.length})`);
      }
      if (filters.strand) {
        queryParameterValues.push(filters.strand)
        conditions.push(`(strands.strand = $${queryParameterValues.length})`);
      }
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const query = `
    SELECT students.id, students.first_name, students.last_name, students.grade_level, students.grade_average, strands.strand
    FROM students as students
    JOIN strands as strands
    ON students.strand_id = strands.id
    ${whereClause}
  `

  console.log(query);
  
  const {rows} = await pool.query(query, queryParameterValues);
  return rows;
}

const getStrandId = async (strand) => {
  const {rows} = await pool.query("SELECT id FROM strands WHERE strand = $1", [strand]);
  return rows[0].id;
}

const insertStudent = async (queryText, values) => {
  
  await pool.query(queryText, values)

}

const deleteStudent = async (studentId) => {
  await pool.query("DELETE FROM students WHERE id = $1 ", [studentId]);

}


module.exports = {getStudents, getStrandId, insertStudent, deleteStudent};