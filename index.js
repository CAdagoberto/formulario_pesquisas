const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
require('dotenv').config({ path: envFile });

const express = require("express");
const App = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
var database = require('./src/database/database')
const ExcelJS = require('exceljs');

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

App.get("/download-excel", (req, res) => {
    database.select().from('pesquisas')
      .then(results => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Pesquisas');
  
        // Definindo as colunas
        worksheet.columns = [
          { header: 'ID', key: 'id_pesquisas', width: 10 },
          { header: 'Nome', key: 'nome', width: 30 },
          { header: 'Nome da Empresa', key: 'nome_empresa', width: 30 },
          { header: 'Idade', key: 'idade', width: 10 },
          { header: 'Telefone', key: 'telefone', width: 20 },
          { header: 'Endereço', key: 'endereco', width: 30 },
          { header: 'CNPJ', key: 'numero_cnpj', width: 25 },
          { header: 'Funcionário', key: 'funcionario', width: 15 },
          { header: 'Parceiros', key: 'parceiros', width: 30 },
          { header: 'Compras', key: 'compras', width: 15 },
          { header: 'Contador', key: 'contador', width: 15 },
          { header: 'INSS', key: 'inss', width: 15 },
          { header: 'Observações', key: 'obs', width: 40 }
        ];
  
        // Adicionando as linhas
        results.forEach(p => {
          worksheet.addRow({
            id_pesquisas: p.id_pesquisas,
            nome: p.nome,
            nome_empresa: p.nome_empresa || '',
            idade: p.idade,
            telefone: p.telefone,
            endereco: p.endereco,
            numero_cnpj: p.numero_cnpj || '',
            funcionario: p.funcionario ? 'Sim' : 'Não',
            parceiros: p.parceiros,
            compras: p.compras,
            contador: p.contador ? 'Sim' : 'Não',
            inss: p.inss ? 'Sim' : 'Não',
            obs: p.obs || 'Sem observações'
          });
        });
  
        // Definindo os cabeçalhos para download
        res.setHeader('Content-Disposition', 'attachment; filename="pesquisas.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
        // Gerando o arquivo e enviando como resposta
        workbook.xlsx.write(res)
          .then(() => {
            res.end();
          })
          .catch(err => {
            console.error('Erro ao gerar o arquivo Excel:', err);
            res.status(500).send('Erro ao gerar o arquivo Excel.');
          });
      })
      .catch(err => {
        console.error('Erro ao consultar o banco de dados:', err);
        res.status(500).send('Erro ao consultar o banco de dados.');
      });
  });


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
        numero_cnpj: form.numero_cnpj === '' ? "Não possui CNPJ" : form.numero_cnpj,
        funcionario: form.funcionario === 'sim' ? 1 : 0,
        parceiros: form.parceiros,
        compras: form.compras,
        contador: form.contador === 'sim' ? 1 : 0,
        inss: form.inss === 'sim' ? 1 : 0,
        obs: form.observacoes
    };

    database.insert(dados).into('pesquisas')
        .then(() => {
            res.redirect("/");
        })
        .catch(err => {
            console.error("Erro ao inserir no banco:", err);
            res.status(500).send("Erro interno no servidor.");
        });
});

const PORT = process.env.PORT || 8080;
App.listen(PORT, () => {
    console.log("Servidor está rodando");
});