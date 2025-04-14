import { assertJsonResponse, assertResponseTimeout } from './http-assertions.js'
import { AKASH_API_BASE, HEALTH_CHECK_TIMEOUT } from './constants.js'

/**
 * Fetches and processes Akash network providers
 * @param {typeof globalThis.fetch} fetch - The fetch function to use
 * @returns {Promise<Array>} List of processed Akash providers
 */
export const getNodes = async (fetch = globalThis.fetch) => {
  console.log(' nodes.js -- Fetching Akash providers...')
  const response = await assertResponseTimeout(
    fetch(`${AKASH_API_BASE}/providers`),
    HEALTH_CHECK_TIMEOUT,
    'Failed to fetch Akash providers'
  )
  const providers = await assertJsonResponse(response, 'Failed to parse providers response')

  const nodes = providers.map(provider => {
    try {
      const hostUri = provider.hostUri
      const match = hostUri.match(/^(?:https?:\/\/)?([^:\/]+)(?::(\d+))?/)
      
      if (!match) {
        console.warn(`Skipping provider ${provider.owner} - Invalid hostUri format: ${hostUri}`)
        return null
      }
      
      const [, host, port] = match
      const defaultPort = hostUri.startsWith('https') ? 8443 : 80
      
      return {
        id: provider.owner,
        host,
        port: port ? Number(port) : defaultPort,
        protocol: hostUri.startsWith('https') ? 'https' : 'http',
        hostUri: provider.hostUri,
        metadata: {
          createdHeight: provider.createdHeight,
          lastCheckDate: provider.lastCheckDate,
          uptime1d: provider.uptime1d,
          uptime7d: provider.uptime7d,
          uptime30d: provider.uptime30d,
          isOnline: provider.isOnline,
          stats: provider.stats,
          attributes: provider.attributes,
          organization: provider.organization
        }
      }
    } catch (error) {
      console.warn(`Skipping provider ${provider.owner} - Error processing: ${error.message}`)
      return null
    }
  }).filter(Boolean)

  console.log(` nodes.js -- Found ${nodes.length} valid Akash providers`)
  return nodes
} 