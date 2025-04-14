// measure.js - Modified to return only { retrievalSucceeded: boolean }

import { AkashClient } from './akash-client.js';
import { colorize } from './colors.js';
import {
  // Reliability thresholds
  MIN_UPTIME_1D,
  MIN_UPTIME_7D,
  // Timeouts for direct checks
  DIRECT_CONNECT_TIMEOUT,
  DIRECT_API_TIMEOUT,
} from './constants.js';

const client = new AkashClient();

const getAttributeValue = (attributes, key, defaultValue = null) => {
    if (!attributes || !Array.isArray(attributes)) {
        return defaultValue;
    }
    const attribute = attributes.find(attr => attr.key === key);
    return attribute ? (typeof attribute.value === 'string' ? attribute.value.trim() : attribute.value) : defaultValue;
};

/**
 * Performs comprehensive measurement on an Akash provider but returns
 * only the { retrievalSucceeded: boolean } structure expected by the
 * unmodified simple-subnet-api. Detailed results are logged locally.
 *
 * @param {Object} provider - The provider object (obtained from getProviders).
 * @param {typeof globalThis.fetch} [fetchFn=globalThis.fetch] - The fetch function to use.
 * @returns {Promise<{retrievalSucceeded: boolean}>} Simplified result for submission.
 */
export const measure = async (provider, fetchFn = globalThis.fetch) => {
  console.log(colorize.info(`Measuring provider ${provider.id}...`));
  const overallStartTime = Date.now();

  let directCheckResults = { 
    checkStartTime: null,
    connection: { success: false, latencyMs: null, statusCode: null, error: null },
    // statusEndpoint: { attempted: false, success: false, latencyMs: null, statusCode: null, error: null },
    // resourcesEndpoint: { attempted: false, success: false, latencyMs: null, statusCode: null, reportedResources: null, error: null },
    checkEndTime: null,
  };
  let healthCheck = null; // API health check result
  let apiReliability = null;
  let apiResourceMetrics = null;
  let extractedAttributes = null;
  let directCheckDurationMs = null;
  let apiCheckDurationMs = null;
  let measurementError = null; // Store potential error messages

  // --- Default success state ---
  let isMeasurementSuccessful = false; // This will determine the final retrievalSucceeded value

  try {
    // --- Start Direct Checks ---
    directCheckResults.checkStartTime = Date.now();
    const connectStartTime = Date.now();
    try {
        // --- 1. Direct Connection Check (HEAD request) ---
        console.log(`\n${colorize.y('[DIRECT Check]')} Attempting HEAD ${colorize.y(provider.hostUri)}`);
        const connectResponse = await fetchFn(provider.hostUri, { /* ... options ... */
             method: 'HEAD', signal: AbortSignal.timeout(DIRECT_CONNECT_TIMEOUT)
        });
        directCheckResults.connection.latencyMs = Date.now() - connectStartTime;
        directCheckResults.connection.statusCode = connectResponse.status;
        if (connectResponse.status < 500) {
            directCheckResults.connection.success = true;
            console.log(colorize.success(`[Direct Check] HEAD successful (Status: ${connectResponse.status})`));
        } else { /* ... handle error ... */
            directCheckResults.connection.success = false;
            directCheckResults.connection.error = `Server error status: ${connectResponse.status}`;
            console.warn(colorize.y(`[Direct Check] HEAD reported server error (Status: ${connectResponse.status})`));
        }
    } catch (err) { /* ... handle error ... */
        directCheckResults.connection.latencyMs = Date.now() - connectStartTime;
        directCheckResults.connection.success = false;
        directCheckResults.connection.error = err.name === 'TimeoutError' ? 'Timeout' : (err.message || 'Connection failed');
        console.warn(colorize.error(`[Direct Check] HEAD failed: ${directCheckResults.connection.error}`));
    }

    // // --- 2. Direct Status Endpoint Check (GET /status) ---
    // // (Keep internal logic as before to populate directCheckResults.statusEndpoint)
    // const statusUrl = `${provider.hostUri}/`; // Using root as a basic check
    // directCheckResults.statusEndpoint.attempted = true;
    // const statusStartTime = Date.now();
    // try {
    //     console.log(`[Direct Check] Attempting GET ${statusUrl}`);
    //     const statusResponse = await fetchFn(statusUrl, { /* ... options ... */
    //         method: 'GET', signal: AbortSignal.timeout(DIRECT_API_TIMEOUT)
    //     });
    //     directCheckResults.statusEndpoint.latencyMs = Date.now() - statusStartTime;
    //     directCheckResults.statusEndpoint.statusCode = statusResponse.status;
    //     if (statusResponse.ok) { /* ... handle success ... */
    //         directCheckResults.statusEndpoint.success = true;
    //          console.log(`[Direct Check] GET / successful (Status: ${statusResponse.status})`);
    //     } else { /* ... handle error ... */
    //         directCheckResults.statusEndpoint.success = false;
    //         directCheckResults.statusEndpoint.error = `Non-OK status: ${statusResponse.status}`;
    //         console.warn(`[Direct Check] GET / failed (Status: ${statusResponse.status})`);
    //     }
    // } catch (err) { /* ... handle error ... */
    //     directCheckResults.statusEndpoint.latencyMs = Date.now() - statusStartTime;
    //     directCheckResults.statusEndpoint.success = false;
    //     directCheckResults.statusEndpoint.error = err.name === 'TimeoutError' ? 'Timeout' : (err.message || 'Request failed');
    //     console.warn(`[Direct Check] GET / failed: ${directCheckResults.statusEndpoint.error}`);
    // }

    // // --- 3. Direct Resources Endpoint Check (GET /resources) ---
    // // (Keep internal logic as before to populate directCheckResults.resourcesEndpoint)
    //  const resourcesUrl = `${provider.hostUri}/resources`;
    //  directCheckResults.resourcesEndpoint.attempted = true;
    //  const resourcesStartTime = Date.now();
    //  try {
    //     console.log(`[Direct Check] Attempting GET ${resourcesUrl}`);
    //     const resourcesResponse = await fetchFn(resourcesUrl, { /* ... options ... */
    //          method: 'GET', signal: AbortSignal.timeout(DIRECT_API_TIMEOUT), headers: { 'Accept': 'application/json' }
    //     });
    //     directCheckResults.resourcesEndpoint.latencyMs = Date.now() - resourcesStartTime;
    //     directCheckResults.resourcesEndpoint.statusCode = resourcesResponse.status;
    //     if (resourcesResponse.ok) {
    //         try { /* ... handle success and parse JSON ... */
    //             const resourcesData = await resourcesResponse.json();
    //             directCheckResults.resourcesEndpoint.success = true;
    //             directCheckResults.resourcesEndpoint.reportedResources = resourcesData;
    //             console.log(`[Direct Check] GET /resources successful (Status: ${resourcesResponse.status})`);
    //         } catch (parseError) { /* ... handle parse error ... */
    //              directCheckResults.resourcesEndpoint.success = false;
    //              directCheckResults.resourcesEndpoint.error = `JSON parse error: ${parseError.message}`;
    //              console.warn(`[Direct Check] GET /resources failed: Invalid JSON response`);
    //         }
    //     } else { /* ... handle non-OK error ... */
    //          directCheckResults.resourcesEndpoint.success = false;
    //          directCheckResults.resourcesEndpoint.error = `Non-OK status: ${resourcesResponse.status}`;
    //          console.warn(`[Direct Check] GET /resources failed (Status: ${resourcesResponse.status})`);
    //     }
    // } catch (err) { /* ... handle request error ... */
    //     directCheckResults.resourcesEndpoint.latencyMs = Date.now() - resourcesStartTime;
    //     directCheckResults.resourcesEndpoint.success = false;
    //     directCheckResults.resourcesEndpoint.error = err.name === 'TimeoutError' ? 'Timeout' : (err.message || 'Request failed');
    //     console.warn(`[Direct Check] GET /resources failed: ${directCheckResults.resourcesEndpoint.error}`);
    // }

    directCheckResults.checkEndTime = Date.now();
    directCheckDurationMs = directCheckResults.checkEndTime - directCheckResults.checkStartTime;
    // --- End Direct Checks ---


    // --- API-Based Health Check (Using AkashClient) ---
    console.log(`\n${colorize.y('[API Check]')} Checking health via central API for ${colorize.y(provider.id)}...`);
    const apiCheckStartTime = Date.now();
    healthCheck = await client.checkProviderHealth(provider.id); // Assign to outer variable
    apiCheckDurationMs = Date.now() - apiCheckStartTime;


    // --- Data Extraction from Initial Provider Object (API Source) ---
    // (Keep internal logic as before, but maybe store in a temp object)
    const attributes = provider.metadata?.attributes || [];
    const capabilities = provider.metadata?.capabilities || {};
    const stats = provider.metadata?.stats || {};
    const networkSpeedDownStr = getAttributeValue(attributes, 'network_download');
    const networkSpeedUpStr = getAttributeValue(attributes, 'network_upload');
    const cpuFrequency = getAttributeValue(attributes, 'frequency');
    const cpuModel = getAttributeValue(attributes, 'cpu') || getAttributeValue(attributes, 'capabilities/cpu');
    const cpuArch = capabilities.cpu?.architecture || getAttributeValue(attributes, 'arch') || getAttributeValue(attributes, 'capabilities/cpu/arch') || 'unknown';
    const memoryType = getAttributeValue(attributes, 'capabilities/memory') || getAttributeValue(attributes, 'ram');
    const storageTypePrimary = getAttributeValue(attributes, 'storage');
    const storageClass = getAttributeValue(attributes, 'capabilities/storage/class', 'unknown');
    const nvmeStorage = storageClass.toLowerCase() === 'nvme' || (storageTypePrimary && storageTypePrimary.toLowerCase() === 'nvme');
    const persistentStorageCap = capabilities.storage?.persistent || getAttributeValue(attributes, 'capabilities/storage/persistent') === 'true';
    const country = getAttributeValue(attributes, 'country');
    const region = provider.metadata?.region || getAttributeValue(attributes, 'region');

    // Resource Metrics (API Based)
    apiResourceMetrics = { 
        cpu: { active: stats.cpu?.active || 0, available: stats.cpu?.available || 0, architecture: cpuArch },
        memory: { active: stats.memory?.active || 0, available: stats.memory?.available || 0, type: memoryType },
        storage: { ephemeral_active: stats.storage?.ephemeral?.active || 0, ephemeral_available: stats.storage?.ephemeral?.available || 0, persistent_active: stats.storage?.persistent?.active || 0, persistent_available: stats.storage?.persistent?.available || 0, primaryType: storageTypePrimary, hasClass: storageClass !== 'unknown' ? storageClass : null, hasNvme: nvmeStorage, isPersistentCapable: persistentStorageCap }
    };

    // --- Assemble Reliability Metrics (API Based) ---
    apiReliability = {
        uptime1d: provider.metadata?.uptime1d || 0,
        uptime7d: provider.metadata?.uptime7d || 0,
        uptime30d: provider.metadata?.uptime30d || 0,
        isReliable: (provider.metadata?.uptime1d >= MIN_UPTIME_1D) && (provider.metadata?.uptime7d >= MIN_UPTIME_7D)
    };

    // Attributes
    extractedAttributes = { 
        networkSpeedDownMbps: networkSpeedDownStr ? parseInt(networkSpeedDownStr, 10) : null,
        networkSpeedUpMbps: networkSpeedUpStr ? parseInt(networkSpeedUpStr, 10) : null,
        cpuModel: cpuModel,
        cpuFrequency: cpuFrequency,
    };

    
    // Define success based on direct reachability AND reported health from API
 
    isMeasurementSuccessful = directCheckResults.connection.success && (healthCheck?.isHealthy ?? false);

  } catch (error) {
    console.error(colorize.error(`FATAL Error during measurement for ${provider.id}:`), error);
    measurementError = error.message || 'Unknown measurement error'; 
    isMeasurementSuccessful = false; 
  }

  //local logs
  const fullDetailedResults = {
      provider: { /* ... provider details ... */
          id: provider.id, host: provider.host, port: provider.port, protocol: provider.protocol, organization: provider.metadata?.organization, tier: provider.metadata?.tier, country: getAttributeValue(provider.metadata?.attributes, 'country'), region: provider.metadata?.region || getAttributeValue(provider.metadata?.attributes, 'region')
      },
      overallSuccess: isMeasurementSuccessful,
      totalMeasurementTimeMs: Date.now() - overallStartTime,
      directCheckDurationMs: directCheckDurationMs,
      apiCheckDurationMs: apiCheckDurationMs,
      directCheck: directCheckResults,
      apiCheck: {
         health: healthCheck,
         resources: apiResourceMetrics,
         reliability: apiReliability
      },
      extractedAttributes: extractedAttributes,
      measurementError: measurementError, 
      timestamp: Date.now()
  };
  console.debug((`Full measurement details for ${provider.id} (not submitted):`), JSON.stringify(fullDetailedResults, null, 2)); // Pretty print JSON for readability

  
  return {
    retrievalSucceeded: isMeasurementSuccessful
  };
};