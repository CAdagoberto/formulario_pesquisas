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

App.post("/salvar", (req, res) => {
    var form = req.body;
    
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
    }
    

    database.insert(dados).into('pesquisas').then(() => {
        console.log("Dados adicionados com sucesso")
    }).catch(err => {
        console.log(err)
    })

   
})

App.listen(8080, () => {
    console.log("conexão feita com sucesso")
})