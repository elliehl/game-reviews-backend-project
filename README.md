## How to access the databases locally
If you would like to connect to the databases in this project, you will need to create two files, `.env.test` and 
`.env.development`. Within these files you need to write `PGDATABASE=` and then the name of the database, which is `nc_games` for the development file, and `nc_games_test` for the test file.