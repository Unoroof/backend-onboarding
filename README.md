Refer: https://nobejs.vercel.app

To run locally:

- Make sure you have install and run PostgreSQL server
- Create database with the name same as in config file
- Run `npm install` or `yarn install`
- Run `sequelize db:migrate`
- Run `nodemon` or `npm start`

  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_NAME,
  "host": process.env.DB_HOST,
  "dialect": process.env.DB_DIALECT,
  "port": process.env.DB_PORT

Serializer logic inspired from: https://medium.com/riipen-engineering/serializing-data-with-sequelize-6c3a9633797a

docker stop $(docker ps -q)
docker build -t nobejs:latest .
docker run -d -p 3000:3000 nobejs:latest

psql -h host.docker.internal -p 5433 -U postgres

docker exec -it 86ba3da2b288 sh

# ------
