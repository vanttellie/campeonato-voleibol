import express from "express";
const host = "0.0.0.0";
const port = 3000;
var listaEquipes = [];
var listaJogadores = [];
const app = express();

import path from "path";
import { escape } from "querystring";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import session from 'express-session';
import cookieParser from "cookie-parser";

app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'Minha chave secreta',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 30 }
}));

app.listen(port, host, () => {
    console.log(`Servidor em execução em http://${host}:${port}/`);
});

app.get("/", (requisicao, resposta) => {
    resposta.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/", (requisicao, resposta) => {
    const email = requisicao.body.email;
    const senha = requisicao.body.senha;

    if (email === "usuario@email.com" && senha === "senha123") {
        requisicao.session.logado = true;
        resposta.cookie("ultimoLogin", new Date().toLocaleString());
        resposta.redirect("/menu");
    }

    else {
        let conteudo = `
        <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Campeonato de Voleibol | Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
    <link rel="stylesheet" href="/index.css"/>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar custom-navbar fixed-top">
        <a class="nav-link text-white ms-5" href="/">Início</a>
    </nav>

    <!-- Formulário de Login -->
    <div class="d-flex align-items-center justify-content-center min-vh-100">
        <div class="login-box p-4">
            <h2 class="text-center mb-4">Bem vindo de volta</h2>
            <form method="POST" action="/">
                <div class="mb-3">`;

        if (!email) {
            conteudo = conteudo + `
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" name="email" value="${email}">
                </div>
                <span class="text-danger">Campo obrigatório</span>
            `;
        }

        else {
            conteudo = conteudo + `
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" name="email" value="${email}">
                </div>
            `;
        }

        if (!senha) {
            conteudo = conteudo + `
                <div class="mb-4">
                    <label for="senha" class="form-label">Senha</label>
                    <input type="password" class="form-control" id="senha" name="senha" value="${senha}">
                </div>
                <span class="text-danger">Campo obrigatório</span>
            `;
        }

        else {
            conteudo = conteudo + `
                <div class="mb-4">
                    <label for="senha" class="form-label">Senha</label>
                    <input type="password" class="form-control" id="senha" name="senha" value="${senha}">
                </div>
            `;
        }

        conteudo = conteudo + `
        <div class="text-center">
                    <button type="submit" class="btn login-btn">Login</button>
                </div>
            </form>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
</body>
</html>
        `;
        resposta.send(conteudo);
    }
});

app.get("/menu", (requisicao, resposta) => {
    if (!requisicao.session.logado) {
        return resposta.redirect("/");
    }

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

    <p class="text-center text-dark mt-3">Último acesso: ${ultimoLogin}</p>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
</body>
</html>
    `);
});

app.get("/cads_equipe", (requisicao, resposta) => {
    resposta.sendFile(path.join(__dirname, "public", "cads_equipe.html"));
});

app.post("/cads_equipe", (requisicao, resposta) => {
    const equipe = requisicao.body.equipe;
    const tecnico = requisicao.body.tecnico;
    const telefone = requisicao.body.telefone;

    if (equipe?.trim() && tecnico?.trim() && telefone?.trim() !== "") {
        listaEquipes.push({
            equipe: equipe,
            tecnico: tecnico,
            telefone: telefone
        });
        resposta.redirect("/lista_equipes");
    }

    else {
        let conteudo = `
        <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Campeonato de Voleibol | Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
    <link rel="stylesheet" href="/cads_equipe.css"/>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar custom-navbar fixed-top">
        <a class="nav-link text-white ms-5" href="/menu">Início</a>
    </nav>

    <!-- Formulário de Cadastro -->
    <div class="d-flex align-items-center justify-content-center min-vh-100">
        <div class="form-box p-4">
        <h2 class="text-center mb-4">Cadastrar Equipe</h2>
        <form method="POST" action="/cads_equipe">
        `;

        if (!equipe) {
            conteudo = conteudo + `
                <div class="mb-3">
            <label for="equipe" class="form-label">Nome da Equipe</label>
            <input type="text" class="form-control" id="equipe" name="equipe" value="${equipe}">
            </div>
            <span class="text-danger">Campo obrigatório</span>
            `;
        }
        else {
            conteudo = conteudo + `
                <div class="mb-3">
            <label for="equipe" class="form-label">Nome da Equipe</label>
            <input type="text" class="form-control" id="equipe" name="equipe" value="${equipe}">
            </div>
            `;
        }

        if (!tecnico) {
            conteudo = conteudo + `
                <div class="mb-3">
            <label for="tecnico" class="form-label">Nome do Técnico Responsável</label>
            <input type="text" class="form-control" id="tecnico" name="tecnico" value="${tecnico}">
            </div>
            <span class="text-danger">Campo obrigatório</span>
            `;
        }
        else {
            conteudo = conteudo + `
                <div class="mb-3">
            <label for="tecnico" class="form-label">Nome do Técnico Responsável</label>
            <input type="text" class="form-control" id="tecnico" name="tecnico" value="${tecnico}">
            </div>
            `;
        }

        if (!telefone) {
            conteudo = conteudo + `
                <div class="mb-4">
            <label for="telefone" class="form-label">Telefone do Técnico</label>
            <input type="tel" class="form-control" id="telefone" name="telefone" value="${telefone}">
            </div>
            <span class="text-danger">Campo obrigatório</span>
            `;
        }
        else {
            conteudo = conteudo + `
                <div class="mb-4">
            <label for="telefone" class="form-label">Telefone do Técnico</label>
            <input type="tel" class="form-control" id="telefone" name="telefone" value="${telefone}">
            </div>
            `;
        }

        conteudo = conteudo + `
        <div class="text-center">
            <button type="submit" class="btn submit-btn">Cadastrar Equipe</button>
            </div>
        </form>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
</body>
</html>
        `;
        resposta.send(conteudo);
        resposta.redirect('/lista_equipes');
    }
});

app.get("/cads_jogador", (requisicao, resposta) => {
    let nomeEquipe = "";
    let opcoesEquipes = listaEquipes.map(eq => {
        const selecionado = nomeEquipe === eq.equipe ? 'selected' : '';
        return `<option value="${eq.equipe}" ${selecionado}>${eq.equipe}</option>`;
    }).join("");

    let conteudo = `
    <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Campeonato de Voleibol | Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
    <link rel="stylesheet" href="/cads_jogador.css"/>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar custom-navbar fixed-top">
        <a class="nav-link text-white ms-5" href="/menu">Início</a>
    </nav>

    <!-- Formulário de Cadastro -->
    <div class="d-flex align-items-center justify-content-center min-vh-100">
        <div class="form-box p-4">
        <h2 class="text-center mb-4">Cadastrar Jogador</h2>
        <form method="POST" action="/cads_jogador">
            <div class="mb-2">
            <label class="form-label">Nome do Jogador</label>
            <input type="text" class="form-control" id="jogador" name="jogador"/>
            </div>
            <div class="mb-2">
            <label class="form-label">Número da Camisa</label>
            <input type="number" class="form-control" id="num_camisa" name="num_camisa"/>
            </div>
            <div class="mb-2">
            <label class="form-label">Data de Nascimento</label>
            <input type="date" class="form-control" id="data" name="data"/>
            </div>
            <div class="mb-2">
            <label class="form-label">Altura (cm)</label>
            <input type="number" class="form-control" id="altura" name="altura"/>
            </div>
            <div class="mb-2">
            <label class="form-label">Gênero</label>
            <select class="form-select" id="genero" name="genero">
                <option value="" disabled selected>Selecione</option>
                <option>Masculino</option>
                <option>Feminino</option>
                <option>Outro</option>
            </select>
            </div>
            <div class="mb-2">
            <label class="form-label">Posição</label>
            <input type="text" class="form-control" id="posicao" name="posicao"/>
            </div>
            <div class="mb-4">
            <label class="form-label">Equipe</label>
            <select class="form-select" id="nomeEquipe" name="nomeEquipe">
                <option value="" disabled ${!nomeEquipe ? 'selected' : ''}>Selecione a equipe</option>
                ${opcoesEquipes}
            </select>
            </div>
            <div class="text-center">
            <button type="submit" class="btn submit-btn">Cadastrar Jogador</button>
            </div>
        </form>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
</body>
</html>
`;
    resposta.send(conteudo);
});

app.post("/cads_jogador", (requisicao, resposta) => {
    const jogador = requisicao.body.jogador;
    const num_camisa = requisicao.body.num_camisa;
    const data = requisicao.body.data;
    const altura = requisicao.body.altura;
    const genero = requisicao.body.genero;
    const posicao = requisicao.body.posicao;
    const nomeEquipe = requisicao.body.nomeEquipe;

    if (jogador?.trim() !== "" && String(num_camisa)?.trim() !== "" && data?.trim() !== "" && altura?.trim() !== "" && genero?.trim() !== "" && posicao?.trim() !== "" && nomeEquipe?.trim() !== "") {
        listaJogadores.push({
            jogador: jogador,
            num_camisa: num_camisa,
            data: data,
            altura: altura,
            genero: genero,
            posicao: posicao,
            equipe: nomeEquipe
        });
        resposta.redirect("/lista_jogadores");
    }

    else {
        let conteudo = `
        <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Campeonato de Voleibol | Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
    <link rel="stylesheet" href="/cads_jogador.css"/>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar custom-navbar fixed-top">
        <a class="nav-link text-white ms-5" href="/menu">Início</a>
    </nav>

    <!-- Formulário de Cadastro -->
    <div class="d-flex align-items-center justify-content-center min-vh-100">
        <div class="form-box p-4">
        <h2 class="text-center mb-4">Cadastrar Jogador</h2>
        <form method="POST" action="/cads_jogador">
        `;

        if (!jogador) {
            conteudo = conteudo + `
                <div class="mb-2">
            <label class="form-label">Nome do Jogador</label>
            <input type="text" class="form-control" id="jogador" name="jogador" value="${jogador}"/>
            </div>
            <span class="text-danger">Campo obrigatório</span>
            `;
        }
        else {
            conteudo = conteudo + `
                <div class="mb-2">
            <label class="form-label">Nome do Jogador</label>
            <input type="text" class="form-control" id="jogador" name="jogador" value="${jogador}"/>
            </div>
            `;
        }

        if (!num_camisa) {
            conteudo = conteudo + `
                <div class="mb-2">
            <label class="form-label">Número da Camisa</label>
            <input type="number" class="form-control" id="num_camisa" name="num_camisa" value="${num_camisa}"/>
            </div>
            <span class="text-danger">Campo obrigatório</span>
            `;
        }
        else {
            conteudo = conteudo + `
                <div class="mb-2">
            <label class="form-label">Número da Camisa</label>
            <input type="number" class="form-control" id="num_camisa" name="num_camisa" value="${num_camisa}"/>
            </div>
            `;
        }

        if (!data) {
            conteudo = conteudo + `
                <div class="mb-2">
            <label class="form-label">Data de Nascimento</label>
            <input type="date" class="form-control" id="data" name="data" value="${data}"/>
            </div>
            <span class="text-danger">Campo obrigatório</span>
            `;
        }
        else {
            conteudo = conteudo + `
                <div class="mb-2">
            <label class="form-label">Data de Nascimento</label>
            <input type="date" class="form-control" id="data" name="data" value="${data}"/>
            </div>
            `;
        }

        if (!altura) {
            conteudo = conteudo + `
                <div class="mb-2">
            <label class="form-label">Altura (cm)</label>
            <input type="number" class="form-control" id="altura" name="altura" value="${altura}"/>
            </div>
            <span class="text-danger">Campo obrigatório</span>
            `;
        }
        else {
            conteudo = conteudo + `
                <div class="mb-2">
            <label class="form-label">Altura (cm)</label>
            <input type="number" class="form-control" id="altura" name="altura" value="${altura}"/>
            </div>
            `;
        }

        if (!genero) {
            conteudo = conteudo + `
                <div class="mb-2">
            <label class="form-label">Gênero</label>
            <select class="form-select" id="genero" name="genero">
                <option value="" disabled ${!genero ? 'selected' : ''}>Selecione</option>
                <option value="Masculino" ${genero === 'Masculino' ? 'selected' : ''}>Masculino</option>
                <option value="Feminino" ${genero === 'Feminino' ? 'selected' : ''}>Feminino</option>
                <option value="Outro" ${genero === 'Outro' ? 'selected' : ''}>Outro</option>
            </select>
            </div>
            <span class="text-danger">Campo obrigatório</span>
            `;
        }
        else {
            conteudo = conteudo + `
                <div class="mb-2">
            <label class="form-label">Gênero</label>
            <select class="form-select" id="genero" name="genero">
                <option value="" disabled ${!genero ? 'selected' : ''}>Selecione</option>
                <option value="Masculino" ${genero === 'Masculino' ? 'selected' : ''}>Masculino</option>
                <option value="Feminino" ${genero === 'Feminino' ? 'selected' : ''}>Feminino</option>
                <option value="Outro" ${genero === 'Outro' ? 'selected' : ''}>Outro</option>
            </select>
            </div>
            `;
        }

        if (!posicao) {
            conteudo = conteudo + `
                <div class="mb-2">
            <label class="form-label">Posição</label>
            <input type="text" class="form-control" id="posicao" name="posicao" value="${posicao}"/>
            </div>
            <span class="text-danger">Campo obrigatório</span>
            `;
        }
        else {
            conteudo = conteudo + `
                <div class="mb-2">
            <label class="form-label">Posição</label>
            <input type="text" class="form-control" id="posicao" name="posicao" value="${posicao}"/>
            </div>
            `;
        }

        let opcoesEquipes = listaEquipes.map(eq => {
            const selecionado = nomeEquipe === eq.equipe ? 'selected' : '';
            return `<option value="${eq.equipe}" ${selecionado}>${eq.equipe}</option>`;
        }).join("");

        if (!nomeEquipe || nomeEquipe.trim() === "") {
            conteudo = conteudo + `
                <div class="mb-4">
            <label class="form-label">Equipe</label>
            <select class="form-select" id="nomeEquipe" name="nomeEquipe">
                <option value="" disabled ${!nomeEquipe ? 'selected' : ''}>Selecione a equipe</option>
                ${opcoesEquipes}
            </select>
            </div>
            <span class="text-danger">Campo obrigatório</span>
            `;
        }
        else {
            conteudo = conteudo + `
                <div class="mb-4">
            <label class="form-label">Equipe</label>
            <select class="form-select" id="nomeEquipe" name="nomeEquipe">
                <option value="" disabled ${!nomeEquipe ? 'selected' : ''}>Selecione a equipe</option>
                ${opcoesEquipes}
            </select>
            </div>
            `;
        }

        conteudo = conteudo + `
        <div class="text-center">
            <button type="submit" class="btn submit-btn">Cadastrar Jogador</button>
            </div>
        </form>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js" integrity="sha384-j1CDi7MgGQ12Z7Qab0qlWQ/Qqz24Gc6BM0thvEMVjHnfYGF0rmFCozFSxQBxwHKO" crossorigin="anonymous"></script>
</body>
</html>
        `;
        resposta.send(conteudo);
    }
});

app.get("/lista_equipes", (requisicao, resposta) => {
    let conteudo = `
        <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Campeonato de Voleibol</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
    <link rel="stylesheet" href="/lista_equipes.css"/>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
</head>
<body>
    <!-- Navbar -->
  <nav class="navbar custom-navbar fixed-top">
    <div class="container-fluid">
      <a class="nav-link text-white" href="/menu" style="margin-left: 90px; font-weight: bold; font-size: 1.25rem;">Início</a>
      <div class="ms-auto me-4 d-flex gap-3">
        <a class="nav-link text-white" href="/cads_equipe.html">Cadastrar Equipe</a>
        <a class="nav-link text-white" href="/cads_jogador.html">Cadastrar Jogador</a>
      </div>
    </div>
  </nav>

  <!-- Tabela de Equipes -->
  <div class="d-flex align-items-center justify-content-center min-vh-100">
    <div class="table-box p-4">
      <h2 class="text-center mb-4">Equipes Cadastradas</h2>
      <div class="table-responsive">
        <table class="table table-striped align-middle text-center">
          <thead class="table-light">
            <tr>
              <th>Nome da Equipe</th>
              <th>Nome do Técnico</th>
              <th>Telefone do Técnico</th>
            </tr>
          </thead>
          <tbody>
          ${listaEquipes.map(equipe => `
                                <tr>
                                    <td>${equipe.equipe}</td>
                                    <td>${equipe.tecnico}</td>
                                    <td>${equipe.telefone}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
                <div class="text-center mt-4 d-flex justify-content-center gap-3">
                    <a href="/cads_equipe.html" class="btn btn-red">Cadastrar Nova Equipe</a>
                    <a href="/menu" class="btn-lightgray">Voltar ao Menu</a>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
        `;

    resposta.send(conteudo);
});

app.post("/lista_equipes", (requisicao, resposta) => {
    const novaEquipe = {
        equipe: requisicao.body.equipe,
        tecnico: requisicao.body.tecnico,
        telefone: requisicao.body.telefone
    };

    listaEquipes.push(novaEquipe);
    resposta.redirect("/lista_equipes");
});

app.get("/api/equipes", (requisicao, resposta) => {
    resposta.json(listaEquipes);
});

app.get("/lista_jogadores", (requisicao, resposta) => {
    const jogadoresPorEquipe = listaJogadores.reduce((acc, jogador) => {
        if (!acc[jogador.nomeEquipe]) acc[jogador.nomeEquipe] = [];
        acc[jogador.nomeEquipe].push(jogador);
        return acc;
    }, {});

    let conteudo = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Campeonato de Voleibol</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="/lista_equipes.css"/>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet" />
</head>
<body>
<nav class="navbar custom-navbar fixed-top">
  <div class="container-fluid">
    <a class="nav-link text-white" href="/menu" style="margin-left: 90px; font-weight: bold; font-size: 1.25rem;">Início</a>
    <div class="ms-auto me-4 d-flex gap-3">
      <a class="nav-link text-white" href="/cads_equipe.html">Cadastrar Equipe</a>
      <a class="nav-link text-white" href="/cads_jogador.html">Cadastrar Jogador</a>
    </div>
  </div>
</nav>

<div class="d-flex align-items-center justify-content-center min-vh-100">
  <div class="table-box p-4">
    <h2 class="text-center mb-4">Jogadores Cadastrados</h2>
    <div class="table-responsive">
`;

    for (const equipe in jogadoresPorEquipe) {
        conteudo += `<h5 class="mt-4">${equipe}</h5>
      <table class="table table-striped align-middle text-center">
        <thead class="table-light">
          <tr>
            <th>Nome</th>
            <th>Nº</th>
            <th>Nascimento</th>
            <th>Altura (cm)</th>
            <th>Gênero</th>
            <th>Posição</th>
          </tr>
        </thead>
        <tbody>
          ${jogadoresPorEquipe[equipe].map(j => `
            <tr>
              <td>${j.jogador}</td>
              <td>${j.num_camisa}</td>
              <td>${j.data}</td>
              <td>${j.altura}</td>
              <td>${j.genero}</td>
              <td>${j.posicao}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>`;
    }

    conteudo += `
    </div>
    <div class="text-center mt-4 d-flex justify-content-center gap-3">
      <a href="/cads_jogador.html" class="btn btn-red">Cadastrar Novo Jogador</a>
      <a href="/menu.html" class="btn btn-lightgray">Voltar ao Menu</a>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;

    resposta.send(conteudo);
});

app.post("/lista_jogadores", (requisicao, resposta) => {
    const jogador = requisicao.body;
    listaJogadores.push(jogador);
    resposta.redirect("/lista_jogadores");
});
