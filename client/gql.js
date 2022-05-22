const { gql } = require('@apollo/client');

const TEST_QUERY = gql`
    query test {
        test
    }
`;

const CURRENT_GAMES_QUERY = gql`
    query currentGames {
        currentGames {
            name
            start
            id
        }
    }
`;

const OLD_GAMES_QUERY = gql`
    query oldGames {
        oldGames {
            name
            start
            end
            id
        }
    }
`;

const SCOREBOARD_BY_GAME_ID_QUERY = gql`
    query scoreboardByGameId($id: Int!) {
        scoreboardByGameId(id: $id) {
            players {
                playerId
                score
            }
        }
    }
`;

const SCOREBOARD_BY_GAME_NAME_QUERY = gql`
    query scoreboardByGameName($gameName: String!) {
        scoreboardByGameName(gameName: $gameName) {
            players {
                playerId
                score
            }
        }
    }
`;

const GET_COMMENTS_BY_GAME_NAME_QUERY = gql`
    query getCommentsByGameName($gameName: String!) {
        getCommentsByGameName(gameName: $gameName)
    }
`;

const REVERSE_MUTATION = gql`
    mutation reverse($str: String!) {
        reverse(str: $str) {
            string
            madeAt
        }
    }
`;

const CREATE_COMMENT_MUTATION = gql`
    mutation createComment($gameName: String!, $comment:String!) {
        createComment(gameName: $gameName, comment: $comment)
    }
`;

module.exports = {
    TEST_QUERY,
    REVERSE_MUTATION,
    CURRENT_GAMES_QUERY,
    OLD_GAMES_QUERY,
    SCOREBOARD_BY_GAME_ID_QUERY,
    SCOREBOARD_BY_GAME_NAME_QUERY,
    CREATE_COMMENT_MUTATION,
    GET_COMMENTS_BY_GAME_NAME_QUERY
}