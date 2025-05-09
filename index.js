const express = require("express");
const App = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
var database = require('./src/database/database')

// Configurações
App.set("view engine", "ejs");

App.use(express.urlencoded({ extended: true }));
App.use(express.json());

App.get("/", (req, res) => {
    res.render("index")
});

App.get("/pesquisas", (req, res) => {
    database.select().from('pesquisas')
        .then(data => {
            res.render("pesquisas", {pesquisa: data})
        }).catch(err => {console.log(err)})
       
    
})

App.post("/salvar", (req, res) => {
    const form = req.body;

   
    function temConteudoMalicioso(obj) {
        const padrao = /[<>{}*$]/;
        return Object.values(obj).some(valor => typeof valor === "string" && padrao.test(valor));
    }

    // Verificação
    if (temConteudoMalicioso(form)) {
        console.log("⚠️ Tentativa de injeção detectada");
        return res.status(400).send("Entrada inválida detectada.");
    }

    const dados = {
        nome: form.nome,
        nome_empresa: form.nome_empresa,
        idade: form.idade,
        telefone: form.telefone,
        endereco: form.endereco,
        cnpj: form.cnpj === 'sim' ? 1 : 0,
        numero_cnpj: form.numero_cnpj,
        funcionario: form.funcionario === 'sim' ? 1 : 0,
        parceiros: form.parceiros,
        compras: form.compras,
        contador: form.contador === 'sim' ? 1 : 0,
        inss: form.inss === 'sim' ? 1 : 0,
        obs: form.observacoes
    };

    database.insert(dados).into('pesquisas')
        .then(() => {
            console.log("✅ Dados adicionados com sucesso");
            res.redirect("/");
        })
        .catch(err => {
            console.error("Erro ao inserir no banco:", err);
            res.status(500).send("Erro interno no servidor.");
        });
});

App.listen(8080, () => {
    console.log("conexão feita com sucesso")
})