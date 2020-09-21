const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("../models/User.model");

// Exporta uma funcao que recebe a instancia do Express como argumento e roda as configuracoes do passport nessa instancia
module.exports = (app) => {
  // Inicializa o passport e o configura para usar sessoes
  app.use(passport.initialize());
  app.use(passport.session());

  // Gravar uma sessao de usuario
  passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });

  // Buscar um usuario a partir da sessao
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id })
      .then((user) => cb(null, user))
      .catch((err) => cb(err));
  });

  // Configurando passport para usar a estrategia local
  passport.use(
    new LocalStrategy(
      // Nomes dos campos de usuario e senha (no req.body)
      {
        usernameField: "email", // by default
        passwordField: "password", // by default
      },
      // funcao callback que tenta fazer o login e retorna a mensagem de erro ou o objeto do usuario encontrado
      (username, password, done) => {
        // Pesquisar usuario que esta logando no banco
        User.findOne({ email: username })
          .then((user) => {
            // Se o usuario nao existir, retorne erro
            if (!user) {
              return done(null, false, {
                message: "Incorrect username or password",
              });
            }

            // Se a senha da tentativa de login nao bater com a armazenada no banco, retorne erro
            if (!bcrypt.compareSync(password, user.passwordHash)) {
              return done(null, false, {
                message: "Incorrect username or password",
              });
            }

            // Caso contrario, retorne o objeto de usuario
            done(null, user);
          })
          .catch((err) => {
            console.error(err);
            return done(err);
          });
      }
    )
  );
};
