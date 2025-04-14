import { assertOkResponse, assertResponseTimeout } from './http-assertions.js'
import { CHECKER_API_BASE, HEALTH_CHECK_TIMEOUT } from './constants.js'
import { colorize } from './colors.js'

/**
 * Submits a measurement to the checker network
 * @param {Object} measurement - The measurement to submit
 * @param {typeof globalThis.fetch} fetch - The fetch function to use
 * @returns {Promise<void>}
 */

let LOCAL_SERVER = 'http://127.0.0.1:8080'
export const submit = async (measurement, fetch = globalThis.fetch) => {
  try {
    // Format the measurement to match the expected format by simple-subnet-api
    const formattedMeasurement = {
      retrievalSucceeded: measurement.connection?.success || false
    }

    const response = await assertResponseTimeout(
      fetch(`${LOCAL_SERVER}/amon/measurement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedMeasurement)
      }),
      HEALTH_CHECK_TIMEOUT,
      'Failed to submit measurement'
    )
    
    await assertOkResponse(response, 'Failed to submit measurement')
    // console.log(colorize.success('Successfully submitted measurement for provider'))
  } catch (error) {
    console.error('Error submitting measurement:', error.message)
    throw error
  }
}