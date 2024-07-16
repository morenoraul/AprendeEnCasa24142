const jwt = require('jsonwebtoken')
const jwtconfig = require('./jwtconfig')

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization']
  if(!authHeader) res.status(403).send({auth: false, message: 'No se provee un token'})
  const token = authHeader.split(' ')[1]
  if(!token) res.status(403).send({auth: false, message: 'Token errado'})
  jwt.verify(token, jwtconfig.secretKey, (err, decoded) => {
    if (err) return res.status(500).send({auth: false, message: 'Token no autorizado'})
    next()
  })
}


/*const jwt = require("jsonwebtoken");
const jwtconfig = require("./jwtconfig");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({ auth: false, message: "No se proporcionó token de autorización" });
  }

  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ auth: false, message: "Formato de token inválido" });
  }

  const token = parts[1];

  if (!token) {
    return res.status(401).json({ auth: false, message: "Token no proporcionado" });
  }

  jwt.verify(token, jwtconfig.secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ auth: false, message: "Token no autorizado" });
    }
    
    req.userId = decoded.id; // Opcional: guardar el ID del usuario decodificado en la solicitud
    next();
  });
};*/