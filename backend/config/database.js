import { Sequelize } from "sequelize";

const db = new Sequelize("db_notes", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
