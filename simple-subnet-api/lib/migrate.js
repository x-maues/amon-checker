/** @import { Queryable} from './typings.js' */
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import Postgrator from 'postgrator'

/** @typedef {import('./typings.js').PgPool} PgPool */
/** @typedef {import('./typings.js').UnknownRow} UnknownRow */
/** @typedef {import('./typings.js').QueryResultWithUnknownRows} QueryResultWithUnknownRows */

const migrationsDirectory = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'migrations'
)

/**
 * @param {Queryable} client
 */
export const migrateWithPgClient = async (client) => {
  const postgrator = new Postgrator({
    migrationPattern: join(migrationsDirectory, '*'),
    driver: 'pg',
    execQuery: (query) => client.query(query)
  })
  console.log(
    'Migrating `simple_subnet_api` DB schema from version %s to version %s',
    await postgrator.getDatabaseVersion(),
    await postgrator.getMaxVersion()
  )

  await postgrator.migrate()

  console.log(
    'Migrated `simple_subnet_api` DB schema to version',
    await postgrator.getDatabaseVersion()
  )
}
