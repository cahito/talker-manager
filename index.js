const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const generateToken = require('./middlewares/generateToken');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_NOTFOUND_STATUS = 404;
const NOTFOUND_MESSAGE = 'Pessoa palestrante não encontrada';
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_request, response) => {
  const data = await fs.readFile('./talker.json');
  const talkers = JSON.parse(data);
  response.status(HTTP_OK_STATUS).json(talkers);
});

app.get('/talker/:id', async (request, response) => {
  const { id } = request.params;
  const data = await fs.readFile('./talker.json');
  const talkers = JSON.parse(data);
  const talker = talkers.find((t) => t.id === Number(id));
  if (!talker) return response.status(HTTP_NOTFOUND_STATUS).json({ message: NOTFOUND_MESSAGE });

  response.status(200).json(talker);
});

app.post('/login', (request, response) => {
  const { email, password } = request.headers;
  const token = generateToken();
  response.status(HTTP_OK_STATUS).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});
