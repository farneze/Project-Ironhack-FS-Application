// Arquivo de configuração dos cookies de sessão

// require session
const session = require("express-session");

// importar mongoose
const mongoose = require("mongoose");

// importar pacote para automaticamente salvar o cookies de sessao no banco
const MongoStore = require("connect-mongo")(session);

// since we are going to USE this middleware in the app.js,
// let's export it and have it receive a parameter
module.exports = (app) => {
  // <== app is just a placeholder here
  // but will become a real "app" in the app.js
  // when this file gets imported/required there

  // use session
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60000 }, // 60 * 1000 ms === 1 min
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        // time to live, quanto tempo o cookie vai ser armazenado no banco
        ttl: 60 * 60 * 24, // 60 segundos * 60 minutos * 24 horas = 1 dia
      }),
    })
  );
};
