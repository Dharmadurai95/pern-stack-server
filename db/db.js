const pg = require('pg')
const { Pool } = pg

const pool = new Pool()

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    }
}
