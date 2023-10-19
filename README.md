## Assure Project

This is project introduce to node application with http server and express framework under moleculer engine

## Installation

With npm installed (comes with [node](https://nodejs.org/en/)), run the following commands into a terminal in the root directory of this project:

```shell
npm install
npm run build
npm run start
```

The project will run at http://localhost:8080/

## Setup
Since this project required database setup before starting you have to create database schema by run sql file under folder `/database/assuredb_mysql.sql` this sql snippet file come with MySQL. Example user access existing in `/database/readme.txt`.

## Configuration
After setup database you may change configuration setting to access your database by `/config/default.json`. see more detail [will-sql](https://www.npmjs.com/package/will-sql)

In case of setting http connection especially port (default at 8080) can be config by `/config/default.json` or environment setting in command prompt \
ex. \
Window 

    set HTTP_PORT=8888 

Linux 

    export HTTP_PORT=8888 

## Example

This project contains examples API that it can invoke by [curl](https://curl.se/download.html):

* curl http://localhost:8080/api/fetch/hello 
* curl http://localhost:8080/api/fetch/hello?name=test  (query parameter)
* curl -X POST http://localhost:8080/api/fetch/hello -d name=test  (post parameter)
* curl -X POST -H "Content-Type: application/json" "http://localhost:8080/api/fetch/hello" -d "{\"name\":\"testing\"}"
* curl http://localhost:8080/api/fetch/hi/test (RESTful api with path parameter)
* curl -v http://localhost:8080/api/fetch/error (with http status 500)
* curl -X POST http://localhost:8080/api/fetch/time/current (RESTful api return current time milliseconds)

