const { ApolloServer } = require('apollo-server');
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');
const { db } = require('./mysql.js');

function initDb() {
    db.query(`
        DROP DATABASE IF EXISTS mafia; 
        CREATE DATABASE IF NOT EXISTS mafia;
        USE mafia;
        CREATE TABLE IF NOT EXISTS games (name VARCHAR(255), start TIMESTAMP, end TIMESTAMP, id INTEGER);
        CREATE TABLE IF NOT EXISTS current_players_score (playerId INTEGER, gameId INTEGER, score INTEGER);
        CREATE TABLE IF NOT EXISTS games_comments (gameId INTEGER, text VARCHAR(255));
        
        INSERT INTO games VALUES('Current Game', CURRENT_TIME(), NULL, 0);
        INSERT INTO games VALUES('Finished Game', CURRENT_TIME(), CURRENT_TIME(), 1);
        INSERT INTO current_players_score VALUES(1, 0, 5);
        INSERT INTO current_players_score VALUES(2, 0, 1);
        INSERT INTO current_players_score VALUES(4, 1, 8);
        INSERT INTO current_players_score VALUES(3, 1, 6);
        INSERT INTO games_comments VALUES(0, 'GG!');
        INSERT INTO games_comments VALUES(0, 'Wow!');
        INSERT INTO games_comments VALUES(1, 'Ez');
        INSERT INTO games_comments VALUES(1, 'Didnt feel');
    `);
}

const server = new ApolloServer({ typeDefs, resolvers });

initDb();

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});