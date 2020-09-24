const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const saltRounds = 10;
const express = require("express");
const router = express.Router();
const passport = require("passport");

// Importar model de usuario
const User = require("../models/User.model");
const Subject = require("../models/Subjects.model");
const Question = require("../models/Question.model");

const userList = require("../json/users.json");
const questionList = require("../json/questions.json");
const subjectList = require("../json/subjects.json");

router.get("/addUserList", async (req, res) => {
  try {
    const result = await User.create(userList);
    res.render("auth/profile");
  } catch (err) {
    console.log(err);
  }
});

router.get("/addsubjects", async (req, res) => {
  try {
    const result = await Subject.create(subjectList);
    res.render("auth/profile");
  } catch (err) {
    console.log(err);
  }
});

router.get("/addquestions", async (req, res) => {
  try {
    const result = await Question.create(questionList);
    res.render("auth/profile");
  } catch (err) {
    console.log(err);
  }
});

router.get("/minimsg", async (req, res) => {
  // let subject = await Subject.find({ _id: req.user._id }, { friends: 1, _id: 0 });
  let subject = await Subject.find({ _id: req.user._id });
  // console.log(subject);
  // try {
  //   const result = await User.find(userList);
  //   res.render("auth/profile", req.user);
  // } catch (err) {
  //   console.log(err);
  // }
});

/* GET home page */
router.get("/", (req, res) => res.render("index", { title: "Quester 🚀" }));

// =========== AUTH SYSTEM  ===========
// Servir o formulario de cadastro de usuario
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

// Receber os dados do formulario de cadastro de usuario
router.post("/signup", async (req, res) => {
  // Extrair informacoes recebidas da requisicao http que veio do navegador
  const { username, nickname, email, password } = req.body;

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

    // Cria o usuario no banco, passando a senha criptografada
    const result = await User.create({
      username,
      email,
      passwordHash: hashedPassword,
      nickname,
      friends: [],
      userTopics: [],
      userQuestions: [],
    });
    // Redireciona para o formulario novamente
    // https://stackoverflow.com/questions/17612695/expressjs-how-to-redirect-a-post-request-with-parameters/17612942
    res.redirect(307, "/login");
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
  // Current session user info
  // console.log("SESSION => ", req.user);

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
// =========== QUESTIONS SYSTEM  ===========
router.get("/queryquestion", async (req, res) => {
  let subject = req.query.subject;
  let classs = req.query.classs;
  let topic = req.query.topic;
  let show = req.query.show;

  if (req.query.subject == undefined) {
    subject = await Subject.find({}, { subject: 1, _id: 0 });
    subject = subject
      .map((el) => el.subject)
      .sort()
      .filter((el, i, arr) => el != arr[i + 1]);
    subject.unshift("Select subject");
    if (show) {
      res.render("questions/viewQuestions", { show, subject });
    } else {
      res.render("questions/addQuestion", { subject });
    }
  } else if (req.query.classs == undefined) {
    classs = await Subject.find({ subject: subject }, { classs: 1, _id: 0 });
    classs = classs
      .map((el) => el.classs)
      .sort()
      .filter((el, i, arr) => el != arr[i + 1]);
    subject = [subject];
    classs.unshift("Select class");
    if (show) {
      res.render("questions/viewQuestions", { show, subject, classs });
    } else {
      res.render("questions/addQuestion", { subject, classs });
    }
  } else if (req.query.topic == undefined) {
    topic = await Subject.find(
      { subject: subject, classs: classs },
      { topic: 1, _id: 0 }
    );
    topic = topic
      .map((el) => el.topic)
      .sort()
      .filter((el, i, arr) => el != arr[i + 1]);
    subject = [subject];
    classs = [classs];
    topic.unshift("Select topic");
    if (show) {
      res.render("questions/viewQuestions", { show, subject, classs, topic });
    } else {
      res.render("questions/addQuestion", { subject, classs, topic });
    }
  } else {
    subject = [subject];
    classs = [classs];
    topic = [topic];
    if (show) {
      res.render("questions/viewQuestions", {
        subject,
        classs,
        topic,
        myBool: true,
      });
    } else {
      res.render("questions/addQuestion", {
        subject,
        classs,
        topic,
        myBool: true,
      });
    }
  }
});

router.post("/queryquestion", async (req, res) => {
  let { topic, question, correctAnswer, ...wrongAnswer } = req.body;
  wrongAnswer = wrongAnswer.wrongAnswer;
  try {
    const newQuestion = await Question.create({
      topic,
      question,
      correctAnswer,
      wrongAnswer,
    });

    // Redireciona para o formulario novamente
    // res.redirect("/signup");
    res.redirect("/queryquestion");

    // console.log(result);
  } catch (err) {
    console.error(err);
  }
});

router.get("/searchquestions", async (req, res) => {
  let subject = req.query.subject;
  let classs = req.query.classs;
  let topic = req.query.topic;
  let show = req.query.show;
  console.log({ subject, classs, topic, show });
  try {
    console.log("eitcha!");
    const questions = await Question.find({ topic: topic });
    res.render("questions/viewQuestions", {
      subject,
      classs,
      topic,
      show,
      myBool: true,
      questions,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/viewquestion", async (req, res) => {
  res.render("questions/viewQuestions"); //, { subject, classs, topic });
  // console.log(req.body);
});
// =========== SUBJECT SYSTEM  ===========
router.get("/querysubjects", async (req, res) => {
  let subject = req.query.subject;
  let classs = req.query.classs;
  let topic = req.query.topic;

  if (req.query.subject == undefined) {
    subject = await Subject.find({}, { subject: 1, _id: 0 });
    subject = subject
      .map((el) => el.subject)
      .sort()
      .filter((el, i, arr) => el != arr[i + 1]);
    subject.unshift("Select subject");
    res.render("subjects/querySubjects", { subject });
  } else if (req.query.classs == undefined) {
    classs = await Subject.find({ subject: subject }, { classs: 1, _id: 0 });
    classs = classs
      .map((el) => el.classs)
      .sort()
      .filter((el, i, arr) => el != arr[i + 1]);
    subject = [subject];
    classs.unshift("Select class");
    res.render("subjects/querySubjects", { subject, classs });
  } else if (req.query.topic == undefined) {
    topic = await Subject.find(
      { subject: subject, classs: classs },
      { topic: 1, _id: 0 }
    );
    topic = topic
      .map((el) => el.topic)
      .sort()
      .filter((el, i, arr) => el != arr[i + 1]);
    subject = [subject];
    classs = [classs];
    topic.unshift("Select topic");
    res.render("subjects/querySubjects", { subject, classs, topic });
  } else {
    subject = [subject];
    classs = [classs];
    topic = [topic];
    res.render("subjects/querySubjects", {
      subject,
      classs,
      topic,
      myBool: true,
    });
  }
});

router.get("/addeditsubjects", (req, res) => {
  let subject = req.query.subject;
  let classs = req.query.classs;
  let topic = req.query.topic;

  if (subject && classs && topic) {
    res.render("subjects/addEditSubjects", { subject, classs, topic });
  } else {
    res.render("subjects/addEditSubjects");
  }
});

router.post("/addeditsubjects", async (req, res) => {
  const subject = req.body.subject;
  const classs = req.body.classs;
  const topic = req.body.topic;

  if (subject && classs && topic) {
    try {
      if ((await Subject.find({ topic: topic })) != "") {
        const result = await Subject.updateOne(
          {
            topic: topic,
          },
          {
            subject,
            classs,
          }
        );
      } else {
        const result = await Subject.create({ subject, classs, topic });
      }
      res.render("subjects/addEditSubjects");
    } catch (err) {
      console.log(err);
    }
  }
});

router.get("/deletesubjects", async (req, res) => {
  let subject = req.query.subject;
  let classs = req.query.classs;
  let topic = req.query.topic;

  if (subject && classs && topic) {
    try {
      const result = await Subject.deleteOne({ topic: topic });
      res.redirect("/querysubjects");
    } catch (err) {
      console.error(err);
    }
  }
});

// =========== FRIENDS SYSTEM  ===========
router.get("/addfriend", (req, res) => {
  res.render("addFriend");
});

router.get("/developers", (req, res) => {
  res.render("developers.hbs");
});

router.get("/about", (req, res) => {
  res.render("about.hbs");
});

module.exports = router;
