require('dotenv').config();

const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, // Certifique-se de que a porta também está sendo passada corretamente
    connectTimeout: 600000 // Aumenta o timeout para 10 segundos
  }
});

module.exports = knex;
