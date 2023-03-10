# Natural Language to SQL Conversion App Documentation

This application is designed to convert natural language queries into SQL queries, and then execute those SQL queries on a specific database. This document will explain how to use the sequelAIze.js library, configure the database connection, and modify the application to work with other database engines.

[facebook.com/Trinwhocode](https://www.facebook.com/Trinwhocode)  
[linkedin.com/in/trinmar](https://www.linkedin.com/in/trinmar)

## Using the sequelAIze.js Library

The sequelAIze.js library exports a single function, `sequelAIze(prompt)`. This function takes a natural language prompt as its only argument, and returns a Promise that resolves to an object with two properties: `query` and `data`.

Here's an example of how to use the `sequelAIze` function:


```javascript
const { sequelAIze } = require('sequel.ai');
const { asyncQuery } = require('./database');


const prompt = 'Show me all the customers from Los Angeles';
sequelAIze(prompt, asyncQuery).then(result => {
  console.log(result);
}).catch(error => {
  console.error(error);
});
``` 

This example will execute the natural language prompt, generate an appropriate SQL query, and execute that query on the SQLite database. The resulting data will be returned in the `data` property of the object, and the SQL query will be returned in the `query` property.

## Environment Variables

This document describes the environment variables that are used in the `sequelAIze` application.

### `.env` File

The `.env` file is used to define the environment variables used in the application. The `.env` file should be located in the root directory of the application.

```dotenv
DB_ENGINE=sqlite
PORT=3000
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY>
``` 

### Variables

### `DB_ENGINE`

This variable is used to specify the database engine that the application will connect to. Currently, the only supported engine is `sqlite3`.

### `PORT`

This variable is used to specify the port that the application will listen on. If this variable is not set, the default port will be `3000`.

### `OPENAI_API_KEY`

This variable is used to specify the API key for OpenAI. You can obtain an API key by creating an account at [https://beta.openai.com/signup/](https://beta.openai.com/signup/). Once you have an account, you can find your API key on the dashboard page. The API key is required for the natural language processing part of the application.

## Configuring the Database Connection

The application is configured to connect to a SQLite database by default. To configure the database connection, you will need to modify the `database.js` file to use the appropriate database driver for your database engine.

Here's an example of how to modify `database.js` to use MySQL instead of SQLite:

javascriptCopy code

```javascript// Import the MySQL module
const mysql = require('mysql');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database'
});

/**
 * Executes an asynchronous SQL query
 * 
 * @param {String} query The SQL query string to execute
 * @param {Array} data An optional array of data values to pass into the query
 * @returns {Promise<Array>} A promise that resolves with the resulting rows if the query is successful, or rejects with an error if it fails
 */
async function asyncQuery(query, data = []) {
  return await new Promise((resolve, reject) => {
    // Get a connection from the pool
    pool.getConnection((error, connection) => {
      if (error) {
        reject(error);
      } else {
        // Execute the query using the connection
        connection.query(query, data, (error, rows) => {
          // Release the connection back to the pool
          connection.release();
          if (error) {
            reject(error);
          } else {
            resolve(rows);
          }
        });
      }
    });
  });
}

// Export the asyncQuery function
module.exports = {
  asyncQuery
}
``` 

This example uses the `mysql` package to create a connection pool and execute SQL queries. You will need to modify the `host`, `user`, `password`, and `database` properties of the configuration object to match your MySQL database.