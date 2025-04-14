# 🚀 AMON Checker

<div align="center">
  <img src="/logo.png" alt="Checker Network Logo" width="200">
  
  ### Reliable Intelligence Data for Akash Network (A Checker Subnet)
  
  ![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)
  ![Built for Checker Network](https://img.shields.io/badge/Built%20for-Checker%20Network-orange)
</div>

</div>
<div align="center" style="padding-top: 40px; padding-bottom: 40px; margin: 40px 0;">
  <img src="akash-white-t.png" alt="Akash Network" height="40" style="margin-right: 50px;">
  <img src="checker.png" alt="Checker Network" height="60" style="margin-right: 50px; margin-left: 50px;">
  <img src="Filecoin.png" alt="Filecoin" height="60" style="margin-left: 50px;">
</div>
## 📋 Overview

The Akash Provider Checker continuously monitors the Akash Network's provider fleet, collecting critical metrics and submitting verifiable measurements to the Checker Network. This subnet is a vital component of the Checker Network ecosystem, ensuring **reliable**, **fairly collected** intelligence data from DePINs and Web3 networks.

### ✨ Key Features

- **Real-time Provider Monitoring** - Track health metrics across the entire Akash provider fleet
- **Verifiable Measurements** - Cryptographically secure data submission to Filecoin settlement layer
- **Resource Availability Tracking** - Monitor CPU, memory, and storage capacity
- **Transparent Provider Performance** - Access reliable metrics for informed deployment decisions

## 🏗️ Architecture

### Core Components

| Component | Description |
|-----------|-------------|
| **🔍 Provider Discovery** | Automatically maintains an up-to-date list of active Akash providers |
| **🔔 Health Verification** | Performs comprehensive health checks including latency, uptime, and response validation |
| **📊 Resource Monitor** | Tracks provider resource metrics (CPU, memory, storage) and capacity |
| **🔐 Measurement Engine** | Generates and submits cryptographically verifiable measurements |

### Measurement Flow

1. 🔄 Provider list is periodically refreshed from the Akash Network
2. 🔍 Health checks and resource monitoring are performed on each provider
3. ✅ Measurements are validated and formatted according to subnet specifications
4. 📤 Verified measurements are submitted to the Checker Network

<div align="center">
  <img src="/flow.png" alt="Checker Network Logo" width="200">
  

</div>


## 🔧 Technical Specifications

- **Provider Health Metrics**: Response time, availability, resource capacity
- **Resource Monitoring**: CPU utilization, memory usage, storage availability
- **Measurement Frequency**: Configurable intervals for health checks and updates
- **Auto-scaling**: Dynamic provider list management with configurable thresholds

<div align="center">
  <img src="/output.png" alt="Checker Network Logo" width="200">
  
     Display intelligence data locally

</div>

## 🚀 Usage
## ⚙️ Configuration for the AMON Checker

Environment variables for subnet customization:

| Variable | Description | Default |
|----------|-------------|---------|
| `AKASH_API_URL` | Akash Network API endpoint | `https://console-api.akash.network` |
| `CHECKER_API_URL` | Checker Network API endpoint | `https://api.checker.network` |
| `MEASUREMENT_DELAY` | Inter-measurement delay in ms | `60000` |
| `UPDATE_NODES_DELAY` | Provider list refresh interval in ms | `300000` |
| `MIN_PROVIDERS_REQUIRED` | Minimum provider count threshold | `3` |

## 📁 AMON Project Structure

```
├── main.js              # Entry point and measurement loop
└── lib/
    ├── akash-client     # Better provider management with checks
    ├── nodes.js         # Provider discovery and management
    ├── measure.js       # Health and resource measurements
    ├── submit-measurement.js  # Measurement submission
    ├── constants.js     # Configuration constants
    ├── http-assertions.js     # Response validation
    └── random.js        # Utility functions for randomized picking
```

### Setting up the Database

```bash
# Create the database
docker exec -it spark-db psql -U $env:UserName -c "CREATE DATABASE simple_subnet_api"

# Create the measurements table
docker exec -it spark-db psql -U $env:UserName -d simple_subnet_api -c "CREATE TABLE daily_measurements ( subnet VARCHAR(50) NOT NULL, day DATE NOT NULL, total BIGINT DEFAULT 0, successful BIGINT DEFAULT 0, PRIMARY KEY (subnet, day) );"

# Verify table creation
docker exec -it spark-db psql -U $env:UserName -d simple_subnet_api -c "\dt"

# Check table contents
docker exec -it spark-db psql -U $env:UserName -d simple_subnet_api -c "SELECT * FROM daily_measurements;"
```

### Setting up the API and Running the Subnet

```bash
# Set up the simple subnet API
cd simple-subnet-api
npm i
node bin/migrate.js
node bin./simple-subnet-api.js

# Run the Amon checker subnet
cd amon
zinnia run main.js
```

## -Maues