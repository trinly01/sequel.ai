const { asyncQuery } = require('./database');
const { Configuration, OpenAIApi } = require('openai');

const openaiConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiConfiguration);

async function generateSqlQuery(prompt) {
  return (await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    max_tokens: 1024
  })).data.choices[0].text;
}

async function sequelAIze(prompt) {
  tables = []

  const tableSchema = []

  const listTablesQuery = await generateSqlQuery(`/*
    Database is ${process.env.DB_ENGINE}
    Generate a SQL query to retrieve a list of tables.
    the column name should be named "name"
  */`);

  const tableNames = await asyncQuery(listTablesQuery);
  tables = [...tables, ...tableNames.map(table => table.name)]

  const listColumnsQuery = await generateSqlQuery(`/*
    Database is ${process.env.DB_ENGINE}.

    Generate a SQL query to get a list of column names for table named "TBL_NAME"

    If SQLite, use "PRAGMA table_info(TBL_TRINMAR_BOADO)" else, use the equivalent for other databases.
  */`);

  for (const tableName of tables) {

    const getTableColumnQuery = listColumnsQuery.replace('TBL_NAME', `\`${tableName}\``)

    // get the column names of each table
    const columns = await asyncQuery(getTableColumnQuery);

    tableSchema.push(`
      TABLE: ${tableName}
      Columns: (${columns.map(column => column.name).join(', ')})
    `)
  }


  const response = await generateSqlQuery(`/*
    Database is ${process.env.DB_ENGINE}
    Generate a SQL query to ${prompt}

    enclose the table names with "\`" character.

    Table Structure are the following
    ${tableSchema.join('\n')}
  */`);
  console.log('FINAL RESPONSE', {
    query: response,
    data: await asyncQuery(response)
  });
  return {
    query: response,
    data: await asyncQuery(response)
  };

}

module.exports = {
  sequelAIze
}