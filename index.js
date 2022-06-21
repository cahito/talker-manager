const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const generateToken = require('./middlewares/generateToken');
const emailChecker = require('./middlewares/emailChecker');
const passwordChecker = require('./middlewares/passwordChecker');
const tokenChecker = require('./middlewares/tokenChecker');
const talkerChecker = require('./middlewares/talkerChecker');

const tokenArray = [];

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_OK_CREATED = 201;
const HTTP_NO_CONTENT = 204;
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

  response.status(HTTP_OK_STATUS).json(talker);
});

app.post('/login', emailChecker, passwordChecker, async (request, response) => {
  const token = generateToken();

  response.status(HTTP_OK_STATUS).json({ token });
});

app.post('/talker', tokenChecker, talkerChecker, async (request, response) => {
  const data = await fs.readFile('./talker.json')
  const talkers = JSON.parse(data);
  const newTalker = request.body;
  newTalker.id = talkers.length + 1;
  talkers.push(newTalker)
  await fs.writeFile('./talker.json', JSON.stringify(talkers));

  response.status(HTTP_OK_CREATED).json(newTalker);
});

app.put('/talker/:id', tokenChecker, talkerChecker, async (request, response) => {
  const data = await fs.readFile('./talker.json')
  const talkers = JSON.parse(data);
  const changeTalker = request.body;
  const index = talkers.find((talker, idx) => talker["name"].includes(changeTalker.name));
  changeTalker.id = index.id;
  talkers.splice(index.id -1, 1, changeTalker);
  await fs.writeFile('./talker.json', JSON.stringify(talkers));

  response.status(HTTP_OK_STATUS).json(changeTalker);
});

app.delete('/talker/:id', tokenChecker, async (request, response) => {
  const { id } = request.params;
  const data = await fs.readFile('./talker.json')
  const talkers = JSON.parse(data);
  const newTalkers = talkers.filter((talker) => talker.id !== Number(id));
  await fs.writeFile('./talker.json', JSON.stringify(newTalkers));

  response.status(HTTP_NO_CONTENT).json();
});

app.listen(PORT, () => {
  console.log('Online');
});
