// Import the SQLite module
const sqlite3 = require('sqlite3').verbose();

// Connect to the database
let db = new sqlite3.Database('test-data.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

/**

Executes an asynchronous SQL query

@param {String} query The SQL query string to execute

@param {Array} data An optional array of data values to pass into the query

@returns {Promise<Array>} A promise that resolves with the resulting rows if the query is successful, or rejects with an error if it fails
*/
async function asyncQuery(query, data = []) {
  return await new Promise((resolve, reject) => {

    // Execute the query and resolve with the resulting rows if successful, or reject with an error if it fails
    try {
      db.all(query, data, (error, rows) => {
        console.log('Executed query:', query);
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    } catch (error) {
      console.log('Error executing query:', query);
      error.query = query;
      console.error(error);
      reject(error);
    }
  });
}

// Export the asyncQuery function
module.exports = {
  asyncQuery
}