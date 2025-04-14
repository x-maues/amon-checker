# Akash Provider Checker Subnet

A high-performance subnet for monitoring and validating Akash Network provider health, resource availability, and performance metrics. This subnet is part of the Checker Network ecosystem, ensuring reliable decentralized compute infrastructure.

## Overview

The Akash Provider Checker continuously monitors the network's provider fleet, collecting critical metrics and submitting verifiable measurements to the Checker Network. It enables transparent provider health tracking and resource availability verification. Checker nodes submit all data is submitted to Filecoin.

## Architecture

### Core Components

- **Provider Discovery**: Automatically maintains an up-to-date list of active Akash providers
- **Health Verification**: Performs comprehensive health checks including latency, uptime, and response validation
- **Resource Monitor**: Tracks provider resource metrics (CPU, memory, storage) and capacity
- **Measurement Engine**: Generates and submits cryptographically verifiable measurements

### Measurement Flow

1. Provider list is periodically refreshed from the Akash Network
2. Health checks and resource monitoring are performed on each provider
3. Measurements are validated and formatted according to subnet specifications
4. Verified measurements are submitted to the Checker Network

## Technical Specifications

- **Provider Health Metrics**: Response time, availability, resource capacity
- **Resource Monitoring**: CPU utilization, memory usage, storage availability
- **Measurement Frequency**: Configurable intervals for health checks and updates
- **Auto-scaling**: Dynamic provider list management with configurable thresholds


## Usage

Setup db:

```bash
docker exec -it spark-db psql -U $env:UserName -c "CREATE DATABASE simple_subnet_api"

docker exec -it spark-db psql -U $env:UserName -d simple_subnet_api -c "CREATE TABLE daily_measurements ( subnet VARCHAR(50) NOT NULL, day DATE NOT NULL, total BIGINT DEFAULT 0, successful BIGINT DEFAULT 0, PRIMARY KEY (subnet, day) );"
CREATE TABLE

 docker exec -it spark-db psql -U $env:UserName -d simple_subnet_api -c "\dt"
               List of relations
 Schema |        Name        | Type  |  Owner
--------+--------------------+-------+----------
 public | daily_measurements | table | owner
 public | schemaversion      | table | owner
(2 rows)

docker exec -it spark-db psql -U $env:UserName -d simple_subnet_api
psql (17.4 (Debian 17.4-1.pgdg120+2))
Type "help" for help.

simple_subnet_api=# SELECT * FROM daily_measurements;
 subnet |    day     | total | successful
--------+------------+-------+------------
 amon   | 2025-04-14 |     3 |          0
(1 row)

simple_subnet_api=#
```
Setup simple subnet api for submitting measurements locally:

```bash
cd simple-subnet-api
npm i

node bin/migrate.js

node bin./simple-subnet-api.js
```

Run the Amon checker subnet with Zinnia:

```bash
cd amon
zinnia run main.js
```

## Configuration

Environment variables for subnet customization:

- `AKASH_API_URL`: Akash Network API endpoint (default: https://console-api.akash.network)
- `CHECKER_API_URL`: Checker Network API endpoint (default: https://api.checker.network)
- `MEASUREMENT_DELAY`: Inter-measurement delay in ms (default: 60000)
- `UPDATE_NODES_DELAY`: Provider list refresh interval in ms (default: 300000)
- `MIN_PROVIDERS_REQUIRED`: Minimum provider count threshold (default: 3)
...

## Project Structure

```
├── main.js           # Entry point and measurement loop
└── lib/
    ├── akash-client     # better provider management with checks
    ├── nodes.js      # Provider discovery and management
    ├── measure.js    # Health and resource measurements
    ├── submit-measurement.js  # Measurement submission
    ├── constants.js  # Configuration constants
    ├── http-assertions.js    # Response validation
    └── random.js     # Utility functions for randomized picking
```

## License

MIT

