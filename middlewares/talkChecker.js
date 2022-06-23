let defaultMessage = '';

const checkTalk = (talk) => {
  if (!talk) {
    defaultMessage = 'O campo "talk" é obrigatório';
    return defaultMessage;
  }
  return defaultMessage;
};

const checkTalkDate = (talk) => {
  // regra de validação de RegEx encontrado no seguinte site:
  // https://stackoverflow.com/questions/5465375/javascript-date-regex-dd-mm-yyyy
  const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])[/](0?[1-9]|1[012])[/]\d{4}$/;
  if (!talk) {
    return defaultMessage;
  }
  if (!talk.watchedAt) {
    defaultMessage = 'O campo "watchedAt" é obrigatório';
    return defaultMessage;
  }
  if (!dateRegex.test(talk.watchedAt)) {
    defaultMessage = 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"';
  } else {
    defaultMessage = '';
  }
  return defaultMessage;
};

const checkTalkRate = (talk) => {
  if (!talk) {
    return defaultMessage;
  }
  if (!talk.rate && talk.rate !== 0) {
    defaultMessage = 'O campo "rate" é obrigatório';
    return defaultMessage;
  }
  return defaultMessage;
};

const checkTalkRateGrade = (talk) => {
  if (!talk) {
    return defaultMessage;
  }
  if (talk.rate < 1 || talk.rate > 5 || !Number.isInteger(talk.rate)) {
    defaultMessage = 'O campo "rate" deve ser um inteiro de 1 à 5';
    return defaultMessage;
  }
  return defaultMessage;
};

const talkChecker = (request, response, next) => {
  const { talk } = request.body;

  checkTalk(talk);
  checkTalkDate(talk);
  checkTalkRateGrade(talk);
  checkTalkRate(talk);

  if (defaultMessage) return response.status(400).json({ message: defaultMessage });
  
  next();
};

module.exports = talkChecker;
