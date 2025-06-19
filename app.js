const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const moment = require("moment-timezone");

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'Minha chave secreta',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30
    }
}));

app.post("/", (requisicao, resposta) => {
    const { email } = requisicao.body;

    if (email) {
        requisicao.session.usuario = email;
        const ultimoLogin = moment().tz("America/Sao_Paulo").format("DD/MM/YYYY, HH:mm:ss");
        resposta.cookie('ultimoLogin', ultimoLogin, { maxAge: 1000 * 60 * 60 * 24 * 30 });
        resposta.redirect("/menu");
    } else {
        resposta.redirect("/");
    }
});

app.get("/", (requisicao, resposta) => {
    resposta.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/menu", (requisicao, resposta) => {
  if (!requisicao.session.usuario) return resposta.redirect("/");
  const usuario = requisicao.session.usuario;
  const ultimoLogin = requisicao.cookies.ultimoLogin || "Primeiro acesso";
  resposta.send(`
    <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Campeonato de Voleibol</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
    <link rel="stylesheet" href="/menu.css"/>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
</head>
<body>
    <!-- Navbar -->
  <nav class="navbar custom-navbar fixed-top">
    <div class="container-fluid">
      <a class="nav-link text-white" href="/menu" style="margin-left: 90px; font-weight: bold; font-size: 1.25rem;">Início</a>
      <div class="ms-auto me-4 d-flex gap-3">
        <a class="nav-link text-white" href="cads_equipe.html">Cadastrar Equipe</a>
        <a class="nav-link text-white" href="cads_jogador.html">Cadastrar Jogador</a>
      </div>
    </div>
  </nav>

  <p class="text-center text-white mt-3">Último acesso: ${ultimoLogin}</p>

  <!-- Hero Section -->
  <section class="hero-section d-flex align-items-center justify-content-center text-center text-white">
    <div class="content">
      <h1 class="display-4 fw-bold">Campeonato de Voleibol</h1>
      <p class="lead mb-4">Cadastre sua equipe e seus jogadores e venha você também ser um vencedor</p>
      <div class="d-flex justify-content-center gap-3">
        <a href="cads_equipe.html" class="btn hero-btn">Cadastrar Equipe</a>
        <a href="cads_jogador.html" class="btn hero-btn">Cadastrar Jogador</a>
      </div>
    </div>
  </section>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
</body>
</html>
  `);
});

app.get("/logout", (requisicao, resposta) => {
    requisicao.session.destroy((err) => {
        if (err) {
            return resposta.send('Erro ao fazer logout');
        }
        resposta.redirect("/");
    });
});