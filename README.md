## Lendsqr API

### Introduction

This is an API that allows users to carry out basic wallet transactions.
You can view the live API [here](https://ozoreorero-lendsqr-be-test.herokuapp.com/).

This api was developed using

- NodeJs (LTS version 18.3.0)
- KnesJS ORM
- MySQL
- TypeScript

## Getting Started

### Prerequisites

The tools listed below are needed to run this application to run effectively:

- Node (LTS Version)
- Npm v8.3.1 or above

You can check the Node.js and npm versions by running the following commands.

### Check node.js version

`node -v`

### Check npm version

`npm -v`

## Installation

- Install project dependencies by running `npm install`.

- To compile kindly use `npm postinstall`

- Start the server with `npm start`

- Access endpoints on your desired localhost set port

## Run migration

Firstly, you should install knex globally by running `npm install -g knex`

To migrate development database

```shell
knex migrate:latest --knexfile ./src/database/knexfile.ts
```

To migrate test database

```shell
knex migrate:latest --env test --knexfile ./src/database/knexfile.ts
```

## Run the tests

```shell
npm run test
```

All tests are written in the `src/test` directory.

# E-R Diagram

![alt text](https://github.com/MrOrero/lendsqr-api/blob/main/er-diagram.PNG?raw=true)

# REST API

The REST API to the _lendsqr app_ is described below.
The base URL is

    http://localhost/

The base URL for the live version is

    https://ozoreorero-lendsqr-be-test.herokuapp.com/

| Method | Description    | Endpoints           | Role |
| :----- | :------------- | :------------------ | :--- |
| POST   | Signup user    | /auth/signup        | \-   |
| POST   | Login user     | /auth/login         | \-   |
| POST   | Create Wallet  | /wallet/create      | \*   |
| GET    | Wallet details | /wallet/details     | \*   |
| POST   | Deposit Fund   | /wallet/deposit     | \*   |
| POST   | Withdraw Fund  | /wallet/withdraw    | \*   |
| POST   | Transfer Fund  | /wallet/transfer    | \*   |
| GET    | Transfer Fund  | /wallet/transaction | \*   |

## Authentication

The api uses a bearer authentication format, when a user logs in, a token is
sent to the user. To access authenticated wallet routes, set your authorization
header to Bearer [token you get when you log in]. Read postman documentation for
more details

## Postman documentation

https://documenter.getpostman.com/view/19573425/2s8479xw3D

## Postman collection

https://www.getpostman.com/collections/04392b6ed29ac571618e

#### Deployed Link

You can [click here](https://ozoreorero-lendsqr-be-test.herokuapp.com/) to test the api
