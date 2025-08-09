const { Client } = require("pg");
require('dotenv').config();
const SQL = `
CREATE TABLE IF NOT EXISTS strands (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  strand VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  grade_level INT CHECK (grade_level = 11 OR grade_level = 12) NOT NULL,
  grade_average INT CHECK (grade_average > 0 AND grade_average <= 100) NOT NULL,
  strand_id INT,
  CONSTRAINT fk_strand FOREIGN KEY (strand_id) REFERENCES strands (id)
);

-- Populate strands
INSERT INTO strands (strand) VALUES
  ('STEM'),
  ('ABM'),
  ('HUMSS'),
  ('GAS'),
  ('TVL')
ON CONFLICT DO NOTHING;

-- Populate students
INSERT INTO students (first_name, last_name, grade_level, grade_average, strand_id) VALUES
  ('Juan', 'Dela Cruz', 11, 85, 2),
  ('Maria', 'Santos', 12, 92, 3),
  ('Leo', 'Reyes', 11, 88, 1),
  ('Angela', 'Rivera', 12, 95, 2),
  ('Carlo', 'Gomez', 11, 78, 1),
  ('Liza', 'Fernandez', 12, 89, 3),
  ('Mark', 'Salazar', 11, 83, 2),
  ('Ella', 'Domingo', 12, 91, 1),
  ('Jomar', 'Lopez', 11, 80, 3),
  ('Nina', 'Garcia', 12, 87, 2),
  ('Andrei', 'Castro', 11, 84, 1),
  ('Bea', 'Lopez', 12, 91, 2),
  ('Carl', 'Santiago', 11, 77, 4),
  ('Diane', 'Villanueva', 12, 88, 5),
  ('Edward', 'Garcia', 11, 82, 3),
  ('Faith', 'Reyes', 12, 93, 1),
  ('Gabriel', 'Torres', 11, 79, 2),
  ('Hannah', 'Domingo', 12, 85, 3),
  ('Ian', 'Mendoza', 11, 81, 4),
  ('Jasmine', 'Delos Reyes', 12, 90, 5),
  ('Ken', 'Morales', 11, 87, 2),
  ('Lara', 'Alvarez', 12, 86, 1),
  ('Marco', 'Estrada', 11, 89, 5),
  ('Nica', 'Ocampo', 12, 94, 3),
  ('Oscar', 'Valdez', 11, 80, 4),
  ('Pia', 'Rosales', 12, 88, 2),
  ('Quin', 'Ramos', 11, 83, 3),
  ('Rica', 'Tomas', 12, 92, 5),
  ('Sam', 'Flores', 11, 76, 1),
  ('Tina', 'Magsaysay', 12, 90, 2),
  ('Ulysses', 'Navarro', 11, 84, 4),
  ('Vera', 'Cuevas', 12, 95, 3),
  ('Warren', 'Salcedo', 11, 81, 5),
  ('Xian', 'Delacruz', 12, 89, 1),
  ('Yssa', 'Ignacio', 11, 85, 2),
  ('Zack', 'Lapid', 12, 87, 3),
  ('Abby', 'Soriano', 11, 90, 5),
  ('Bryan', 'Santos', 12, 82, 4),
  ('Clarisse', 'Velasco', 11, 86, 1),
  ('Daryl', 'Abad', 12, 91, 2),
  ('Elaine', 'Pagulayan', 11, 80, 5),
  ('Francis', 'Ortega', 12, 84, 3),
  ('Grace', 'Cruz', 11, 88, 4),
  ('Harold', 'Padilla', 12, 93, 2),
  ('Isabel', 'Alcantara', 11, 78, 5),
  ('Jerome', 'Gallardo', 12, 89, 1),
  ('Kate', 'Jimenez', 11, 85, 2),
  ('Lloyd', 'Tan', 12, 90, 3),
  ('Mia', 'Buenaventura', 11, 87, 4),
  ('Noel', 'Guevarra', 12, 92, 5),
  ('Olive', 'Ramos', 11, 83, 1),
  ('Paolo', 'De Leon', 12, 86, 2),
  ('Queenie', 'Vega', 11, 80, 4),
  ('Ralph', 'Torralba', 12, 94, 3),
  ('Sofia', 'Carpio', 11, 88, 5),
  ('Troy', 'Beltran', 12, 91, 1),
  ('Umi', 'Castillo', 11, 82, 2),
  ('Vince', 'Sarmiento', 12, 89, 4),
  ('Wendy', 'Macaraeg', 11, 79, 3),
  ('Xandra', 'Lagman', 12, 85, 5),
  ('Yohan', 'Lucero', 11, 90, 1),
  ('Zia', 'Francisco', 12, 87, 2)
ON CONFLICT DO NOTHING;
`;

async function main() {
  console.log("Seeding database...");
  const client = new Client({
    connectionString: process.env.CONNECTION_STRING,
  });

  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Done!");
}

main().catch(err => {
  console.error(err);
});