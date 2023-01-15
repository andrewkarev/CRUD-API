# Node.JS-RS-School task 3 - Simple CRUD API

This is a simple CRUD API using in-memory database underneath.

The API endpoints are:

- **GET** `api/users` returns all users
- **GET** `api/users/{userId}` returns a user with corresponding `userId`
- **POST** `api/users` create a record about new user and store it in database
- **PUT** `api/users/{userId}` update an existing user
- **DELETE** `api/users/{userId}` delete an existing user from the database

## How to install

To run this application you have to do the following steps:

1. Clone this repository

         git clone https://github.com/andrewkarev/CRUD-API

2. Move to the cloned repo

         cd CRUD-API

3. Switch branch to the `develop`

         git checkout develop

4. Install dependencies

         npm install

## Commands

To start the application in the development mode

    npm run start:dev

To start the application in the production mode

    npm run start:prod

To start the application with load balancer and shared in-memory database

    npm run start:multi

To run tests

    npm run test

## How to use

Send your requests to the
`http://localhost:4000/api/users`

**POST** request should include body with JSON object with

- `username` - user's name (string, **required**)
- `age` - user's age (number, **required**)
- `hobbies` - user's hobbies (array of strings or empty array, **required**)
