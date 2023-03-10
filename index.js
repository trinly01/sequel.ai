const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { sequelAIze } = require('./sequelAIze');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/query', async (req, res) => {
  let { prompt } = req.body;

  try {
    res.json(await sequelAIze(prompt));
  } catch (error) {
    res.status(500).json(error);
    console.error(error)
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});