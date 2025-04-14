/**
 * Validates a provider's response
 * @param {Response} response - The HTTP response to validate
 * @param {string} [errorMessage] - Custom error message
 * @returns {Promise<boolean>} Whether the response is valid
 */
export async function assertOkResponse(response, errorMessage = 'Invalid response') {
  if (!response.ok) {
    throw new Error(`${errorMessage}: ${response.status} ${response.statusText}`)
  }
  return true
}

/**
 * Validates JSON response
 * @param {Response} response - The HTTP response to validate
 * @param {string} [errorMessage] - Custom error message
 * @returns {Promise<Object>} Parsed JSON response
 */
export async function assertJsonResponse(response, errorMessage = 'Invalid JSON response') {
  await assertOkResponse(response, errorMessage)
  try {
    return await response.json()
  } catch (error) {
    throw new Error(`${errorMessage}: ${error.message}`)
  }
}

/**
 * Validates response within timeout
 * @param {Promise<Response>} responsePromise - The response promise
 * @param {number} timeout - Timeout in milliseconds
 * @param {string} [errorMessage] - Custom error message
 * @returns {Promise<Response>} The response if received within timeout
 */
export async function assertResponseTimeout(responsePromise, timeout, errorMessage = 'Response timeout') {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), timeout)
  })
  return Promise.race([responsePromise, timeoutPromise])
} 