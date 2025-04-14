/** @import { PgPool } from './typings.js' */
import pg from 'pg'
import { poolConfig } from './config.js'

// Configure node-postgres to deserialize BIGINT values as BigInt, not String
pg.types.setTypeParser(20, BigInt) // Type Id 20 = BIGINT | BIGSERIAL

/**
 * @param {Error} err
 * @returns {void}
 */
const onError = (err) => {
  // Prevent crashing the process on idle client errors, the pool will recover
  // itself. If all connections are lost, the process will still crash.
  // https://github.com/brianc/node-postgres/issues/1324#issuecomment-308778405
  console.error('An idle client has experienced an error', err.stack)
}

/**
 * @param {string} connectionString
 * @returns {Promise<PgPool>}
 */
export const createPgPool = async (connectionString) => {
  const pool = new pg.Pool({
    ...poolConfig,
    connectionString
  })
  pool.on('error', onError)
  await pool.query('SELECT 1')
  return pool
}
