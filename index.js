import express from "express";
const host = "0.0.0.0";
const port = 3000;
var listaUsuarios = [];
var listaProdutos = [];
const app = express();

import path from "path";
import { escape } from "querystring";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.listen(port, host, () => {
    console.log(`Servidor em execução em http://${host}:${port}/`);
});

app.get("/", (requisicao, resposta) => {
    resposta.sendFile(path.join(__dirname, "public", "index.html"));
});