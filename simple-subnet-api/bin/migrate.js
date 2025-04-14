import { createPgPool } from '../lib/pool.js'
import { migrateWithPgClient } from '../lib/migrate.js'
import { DATABASE_URL } from '../lib/config.js'

const pgPool = await createPgPool(DATABASE_URL)
await migrateWithPgClient(pgPool)
