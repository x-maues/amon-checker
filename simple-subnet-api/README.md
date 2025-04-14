# simple-subnet-api

Offer a uniform API designed for publishing and querying measurement data for
multiple subnets.

## Deployment

All commits pushed to the `main` branch are automatically deployed to Fly.io by
a GitHub Actions workflow.

To deploy the changes manually, run the following command from the root
directory:

```bash
fly deploy -c fly.toml
```

## Testing

To run the tests for this repository you will first need to setup a PostgreSQL
database.

You can do this by running a PostgreSQL docker container with the following
command:

```bash
docker run -d --name spark-db \
-e POSTGRES_HOST_AUTH_METHOD=trust \
-e POSTGRES_USER=$USER \
-e POSTGRES_DB=$USER \
-p 5432:5432 \
postgres
```

Afterwards, you need to create the database `simple_subnet_api` by running the
following command:

```bash
psql postgres://$USER@localhost/$USER -c 'CREATE DATABASE simple_subnet_api'
```

Finally, you can run the tests:

```
npm test
```
