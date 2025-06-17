const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');

//armazenando o nome dos usuários que fazem login

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

app.post("/login", (requisicao, resposta) => {
    const { email } = requisicao.body;

    if (email) {
        requisicao.session.user = email;
        const lastLogin = new Date().toISOString();
        resposta.cookie('lastLogin', lastLogin, { maxAge: 1000 * 60 * 60 * 24 * 30 });
        resposta.redirect("/listaUsuarios");
    } else {
        resposta.redirect("/login");
    }
});

app.get("/login", (requisicao, resposta) => {
    resposta.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/listaUsuarios", (requisicao, resposta) => {
    if (requisicao.session.user) {
        const user = requisicao.session.user;
        const lastLogin = requisicao.cookies.lastLogin;
        resposta.send(`Olá, ${user}. Último acesso: ${lastLogin}`);
    } else {
        resposta.redirect("/login");
    }
});

app.get("/logout", (requisicao, resposta) => {
    requisicao.session.destroy((err) => {
        if (err) {
            return resposta.send('Erro ao fazer logout');
        }
        resposta.redirect("/login");
    });
});