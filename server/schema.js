const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        test: String
        currentGames: [Game]!
        oldGames: [Game]!
        scoreboardByGameId(id: Int!): Scoreboard
        scoreboardByGameName(gameName: String!): Scoreboard
        getCommentsByGameName(gameName: String!): [String]!
    }
    type Game {
        name: String
        start: String
        end: String
        id: String
    }
    type Scoreboard {
        players: [ScoreboardPlayer]
    }
    type ScoreboardPlayer {
        playerId: String
        score: Int
    }
    type Mutation {
        reverse(str: String!): Message 
        createComment(gameName: String!, comment: String!): Boolean
    }
    type Message {
        string: String
        madeAt: String
    }
    type CreateCommentResult {
        created: Boolean
    }
`;

module.exports = { typeDefs };