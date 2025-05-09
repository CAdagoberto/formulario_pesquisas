var knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '123',
        database: 'pesquisa'
    }
});

module.exports = knex;