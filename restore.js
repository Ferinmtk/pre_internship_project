require("dotenv").config();
const { exec } = require("child_process");

// Parse DATABASE_URL
const dbUrl = new URL(process.env.DATABASE_URL);
const DB_HOST = dbUrl.hostname;
const DB_USER = dbUrl.username;
const DB_NAME = dbUrl.pathname.substring(1); // Remove leading '/'
const DB_PASSWORD = dbUrl.password;
const BACKUP_FILE = "tera_backup.sql"; // Ensure this file is in the project root

// Restore command
const restoreDB = () => {
  exec(
    `PGPASSWORD=${DB_PASSWORD} psql -h ${DB_HOST} -U ${DB_USER} -d ${DB_NAME} -f ${BACKUP_FILE}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error restoring database: ${error.message}`);
        return;
      }
      console.log("Database restored successfully!");
    }
  );
};

restoreDB();
