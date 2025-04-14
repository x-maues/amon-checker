import { NETWORK_RPC_URL } from './constants.js'

/**
 * Fetches data items to check from the network
 * @returns {Promise<Array>} List of data items to check
 */
export async function getData() {
  try {
    const response = await fetch(`${NETWORK_RPC_URL}/data`)
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

/**
 * Validates data item format
 * @param {Object} item - The data item to validate
 * @returns {boolean} Whether the item is valid
 */
export function validateDataItem(item) {
  if (!item || typeof item !== 'object') {
    throw new Error('Invalid data item format')
  }
  return true
} 