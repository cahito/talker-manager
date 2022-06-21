const tokenChecker = (request, response, next) => {
  const { authorization } = request.headers;
  console.log('auth dentro do Checker: ', authorization);
  if (!authorization) {
    return response.status(401).json({ message: 'Token não encontrado' });
  }
  
  if (authorization.length !== 16) {
    return response.status(401).json({ message: 'Token inválido' });
  }

  next();
};

module.exports = tokenChecker;
