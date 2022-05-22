const { db } = require("./mysql.js");

const reverse = (s) => {
    return s.split("").reverse().join("");
}

function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function makeQuery(query, callback) {
    await db.promise().query(query)
        .then(([rows, fields]) => {
            callback(rows, fields);
        });
}

async function scoreboardByGameId(id) {
    let result = [];
    await makeQuery(`SELECT playerId, score FROM current_players_score WHERE gameId=${id}`, (rows) => {
        if (rows) {
            rows.forEach(row => result.push(row));
        }
    });
    const scoreboard = {
        players: result
    }
    return scoreboard;
}

async function findGameIdByName(gameName) {
    let gameId = undefined;
    await makeQuery(`SELECT id FROM games WHERE name="${gameName}"`, (rows) => {
        if (rows.length > 0) {
            gameId = rows[0]['id'];
        }
    });
    return gameId;
}

const resolvers = {
    Query: {
        currentGames: async () => {
            let result = [];
            await makeQuery("SELECT name, start, id FROM games WHERE end IS NULL", (rows) => {
                if (rows) {
                    rows.forEach(row => result.push(row));
                }
            });
            return result;
        },
        oldGames: async() => {
            let result = [];
            await makeQuery("SELECT name, start, id FROM games WHERE end IS NOT NULL", (rows) => {
                if (rows) {
                    rows.forEach(row => result.push(row));
                }
            });
            return result;
        },
        scoreboardByGameId: async(_, args) => {
            return await scoreboardByGameId(args.id);
        },
        scoreboardByGameName: async(_, args) => {
            let gameId = await findGameIdByName(args.gameName);
            if (gameId === undefined) {
                return null;
            }
            return await scoreboardByGameId(gameId);
        },
        getCommentsByGameName: async(_, args) => {
            let gameId = await findGameIdByName(args.gameName);
            if (gameId === undefined) {
                return [];
            }
            let result = [];
            await makeQuery(`SELECT text FROM games_comments WHERE gameId=${gameId}`, (rows) => {
                if (rows) {
                    rows.forEach(row => result.push(row['text']));
                }
            });
            return result;
        },
        test: () => 'test',
    },
    Mutation: {
        reverse: async (_, args) => {
            const msg = {
                string: reverse(args.str),
                madeAt: new Date()
            };
            await wait(3000);
            return msg;
        },
        createComment: async(_, args) => {
            let gameId = await findGameIdByName(args.gameName);
            if (gameId === undefined) {
                return null;
            }
            let affectedRows = 0;
            await makeQuery(`INSERT INTO games_comments VALUES(${gameId}, "${args.comment}")`, (result) => {
                affectedRows = result['affectedRows'];
            });
            if (affectedRows > 1) {
                console.error('Comment should insert only 1 row');
                return true;
            }
            return affectedRows === 1;
        }
    }
};

module.exports = { resolvers };
