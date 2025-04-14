// Time intervals in milliseconds
export const TIME = 10_000
export const MEASUREMENT_DELAY = TIME
export const UPDATE_NODES_DELAY = 10 * TIME

// Akash network constants
export const AKASH_API_URL = 'https://console-api.akash.network/v1'
export const PROVIDER_CHECK_TIMEOUT = 30_000 // 30 seconds
export const MIN_PROVIDERS_REQUIRED = 1

// Resource thresholds
export const MIN_CPU_CORES = 0
export const MIN_MEMORY_GB = 0
export const MIN_STORAGE_GB = 0

// Status thresholds
export const MIN_UPTIME_1D = 0 // 95% uptime required
export const MIN_UPTIME_7D = 0 // 90% uptime required



// Measurement thresholds
export const TIMEOUT_THRESHOLD = 5000 // 5 seconds
export const ERROR_THRESHOLD = 3 // Maximum number of consecutive errors
export const DIRECT_API_TIMEOUT = 30_000 // 10 seconds
export const DIRECT_CONNECT_TIMEOUT = 30_000
// Node configuration
export const MIN_NODES_REQUIRED = 3
export const MAX_NODES_TO_CHECK = 10

// API Endpoints
export const AKASH_API_BASE = 'https://console-api.akash.network/v1'
export const CHECKER_API_BASE = 'http://localhost:3000'
// export const CHECKER_API_BASE = 'http://localhost:3000'

// Provider API Endpoints
export const PROVIDER_DASHBOARD_ENDPOINT = '/provider-dashboard'
export const PROVIDER_VERSIONS_ENDPOINT = '/provider-versions'
export const PROVIDER_ATTRIBUTES_SCHEMA_ENDPOINT = '/provider-attributes-schema'
export const PROVIDER_REGIONS_ENDPOINT = '/provider-regions'
export const PROVIDER_GPU_ENDPOINT = '/gpu'
export const PROVIDER_GPU_MODELS_ENDPOINT = '/gpu-models'
export const PROVIDER_GPU_PRICES_ENDPOINT = '/gpu-prices'

// Timing Constants
// export const MEASUREMENT_DELAY = 60_000 // 1 minute between measurements
// export const UPDATE_NODES_DELAY = 300_000 // 5 minutes between provider list updates
export const HEALTH_CHECK_TIMEOUT = 10_000 // 10 seconds timeout for health checks
export const RESOURCE_CHECK_TIMEOUT = 15_000 // 15 seconds timeout for resource checks

// Thresholds
export const MIN_UPTIME_THRESHOLD = 0.95 // 95% minimum uptime
export const MAX_RESPONSE_TIME = 5000 // 5 seconds max response time

// Resource Thresholds
export const MIN_CPU_AVAILABLE = 0.1 // Minimum CPU units available
export const MIN_MEMORY_AVAILABLE = 100 * 1024 * 1024 // 100MB minimum memory
export const MIN_STORAGE_AVAILABLE = 1 * 1024 * 1024 * 1024 // 1GB minimum storage

// Network Constants
export const NETWORK_TYPE = 'provider'
export const NETWORK_VERSION = '1.0.0'

// Measurement Types
export const MEASUREMENT_TYPES = {
  HEALTH: 'health',
  RESOURCES: 'resources',
  DEPLOYMENTS: 'deployments',
  NETWORK: 'network'
}

// Error Codes
export const ERROR_CODES = {
  PROVIDER_OFFLINE: 'PROVIDER_OFFLINE',
  HEALTH_CHECK_FAILED: 'HEALTH_CHECK_FAILED',
  RESOURCE_CHECK_FAILED: 'RESOURCE_CHECK_FAILED',
  API_ERROR: 'API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
}