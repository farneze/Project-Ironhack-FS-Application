const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const saltRounds = 10;
const express = require("express");
const router = express.Router();
const passport = require("passport");

// Importar model de usuario
const User = require("../models/User.model");

/* GET home page */
router.get("/", (req, res) =>
  res.render("index", { title: "Meu saiti 🚀" })
);

// Servir o formulario de cadastro de usuario
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

// Receber os dados do formulario de cadastro de usuario
router.post("/signup", async (req, res) => {
  console.log(req.body);

  // Extrair informacoes recebidas da requisicao http que veio do navegador
  const { username, email, password } = req.body;

  const errors = {};
  // Validacao de nome de usuario: é obrigatório, tem que ser do tipo string e não pode ter mais de 50 caracteres
  if (!username || typeof username !== "string" || username.length > 50) {
    errors.username = "Username is required and should be 50 characters max.";
    // res.render('auth/signup', { errorMessage: 'Username is required and should be 50 characters max.', username: true });
  }

  // Tem que ser um email valido, é obrigatório
  if (!email || !email.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/)) {
    errors.email = "Email is required and should be a valid email address";
    // res.render('auth/signup', { errorMessage: 'Email is required and should be a valid email address', email: true });
  }

  // Senha é obrigatória, precisa ter no mínimo 8 caracteres, precisa ter letras maiúsculas, minúsculas, números e caracteres especiais
  if (
    !password ||
    !password.match(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
    )
  ) {
    errors.password =
      "Password is required, should be at least 8 characters long, should contain an uppercase letter, lowercase letter, a number and a special character";
    // res.render('auth/signup', {
    //   errorMessage: 'Password is required, should be at least 8 characters long, should contain an uppercase letter, lowercase letter, a number and a special character',
    //   email: true
    // });
  }

  // Se o objeto errors tiver propriedades (chaves), retorne as mensagens de erro
  if (Object.keys(errors).length) {
    res.render("auth/signup", errors);
  }

  try {
    // Gerar o salt
    const salt = await bcrypt.genSalt(saltRounds);
    // Gerar o hash utilizando o salt criado anteriormente e o que o usuario escreveu no campo senha no navegador
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Hashed password => ", hashedPassword);

    // Cria o usuario no banco, passando a senha criptografada
    const result = await User.create({
      username,
      email,
      passwordHash: hashedPassword,
    });

    // Redireciona para o formulario novamente
    res.redirect("/signup");
    console.log(result);
  } catch (err) {
    console.error(err);
    // Mensagem de erro para exibir erros de validacao do Schema do Mongoose
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { errorMessage: err.message });
    } else if (err.code === 11000) {
      res.status(500).render("auth/signup", {
        errorMessage:
          "Username and email need to be unique. Either username or email is already used.",
      });
    }
  }
});

// GET Login - Retorna o HTML do form de login
router.get("/login", (req, res) => res.render("auth/login"));

// POST Login - Recebe os dados que o usuario preencheu no form de login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

// GET Profile - Rota para exibir os dados do usuario atualmente logado - Rota privada - apenas usuarios logados podem acessar
router.get("/profile", (req, res) => {
  console.log("SESSION => ", req.user);

  if (!req.user || !req.user._id) {
    return res.redirect("/login");
  }
  return res.render("auth/profile", req.user);
});

// GET Logout - Rota para destruir a sessao do usuario logado
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/addnewquestion", (req, res) => {
  res.render("addQuestion")
});



module.exports = router;
