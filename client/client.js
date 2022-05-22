const fetch = require('cross-fetch');
const { ApolloClient, InMemoryCache, createHttpLink } = require('@apollo/client');
const { TEST_QUERY, REVERSE_MUTATION, CURRENT_GAMES_QUERY, OLD_GAMES_QUERY, CREATE_COMMENT_MUTATION, SCOREBOARD_BY_GAME_NAME_QUERY,
    SCOREBOARD_BY_GAME_ID_QUERY, GET_COMMENTS_BY_GAME_NAME_QUERY
} = require('./gql');

const cache = new InMemoryCache();

function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const link = createHttpLink({
    uri: 'http://localhost:4000/',
    fetch
});

const client = new ApolloClient({  // Provide required constructor fields
    cache: cache,
    link: link
});

async function getAllCurrentGames() {
    const res = await client.query({
        query: CURRENT_GAMES_QUERY,
    });
    let games = res['data']['currentGames'];
    if (games.length === 0) {
        console.log('There are no current games');
    }
    games.forEach((game) => {
        let name = game['name'];
        let id = game['id'];
        let start = parseInt(game['start']);
        console.log(`Game name: ${name}, game id: ${id}, start time: ${new Date(start)}`);
    })
}

async function getAllFinishedGames() {
    const res = await client.query({
        query: OLD_GAMES_QUERY,
    });
    let games = res['data']['oldGames'];
    if (games.length === 0) {
        console.log('There are no finished games');
    }
    games.forEach((game) => {
        let name = game['name'];
        let id = game['id'];
        let start = parseInt(game['start']);
        let end = parseInt(game['end']);
        console.log(`Game name: ${name}, game id: ${id}, start time: ${new Date(start)}, finish time: ${new Date(end)}`);
    })
}

function outputScoreboard(scoreboard) {
    console.log(`Scoreboard for moment ${new Date(Date.now())}`)
    if (scoreboard === undefined) {
        console.log('Scoreboard is undefined');
        return;
    }
    let players = scoreboard['players'];
    let sorted = Array.from(players).sort((first, second) => {
        return second['score'] - first['score'];
    });
    sorted.forEach((player) => {
        console.log(`PlayerId: ${player['playerId']}, score: ${player['score']}`);
    });
}

async function pollingScoreboardById(prompt) {
    let id = parseInt(prompt('Enter game id: '));
    let updateTime = parseInt(prompt('Enter polling update time in seconds: '));
    let pollingTimes = parseInt(prompt('Enter polling times: '));
    for (let i = 0; i < pollingTimes; i++) {
        const res = await client.query({
            query: SCOREBOARD_BY_GAME_ID_QUERY,
            variables: {
                id: id
            }
        });
        let scoreboard = res['data']['scoreboardByGameId'];
        outputScoreboard(scoreboard);
        console.log(`${i + 1}/${pollingTimes}`);
        if (i + 1 !== pollingTimes) {
            await wait(updateTime * 1000);
        }
    }
}

async function pollingScoreboardByName(prompt) {
    let name = prompt('Enter game name: ');
    let updateTime = parseInt(prompt('Enter polling update time in seconds: '));
    let pollingTimes = parseInt(prompt('Enter polling times: '));
    for (let i = 0; i < pollingTimes; i++) {
        const res = await client.query({
            query: SCOREBOARD_BY_GAME_NAME_QUERY,
            variables: {
                gameName: name
            }
        });
        let scoreboard = res['data']['scoreboardByGameName'];
        outputScoreboard(scoreboard);
        console.log(`${i + 1}/${pollingTimes}`);
        if (i + 1 !== pollingTimes) {
            await wait(updateTime * 1000);
        }
    }
}

async function addCommentForGame(prompt) {
    let name = prompt('Enter game name: ');
    let comment = prompt('Enter comment: ');
    if (comment.length > 255) {
        comment = comment.substring(0, 255);
    }
    const res = await client.mutate({
        mutation: CREATE_COMMENT_MUTATION,
        variables: {
            gameName: name,
            comment: comment
        }
    });
    let result = res['data']['createComment'];
    if (result === null) {
        console.log("There's no game with such name");
        return;
    }
    if (result) {
        console.log(`Successfully created comment for game ${name}`);
    } else {
        console.log("Something went wrong while creating comment");
    }
}

async function getCommentsByGameName(prompt) {
    let name = prompt('Enter game name: ');
    const res = await client.query({
        query: GET_COMMENTS_BY_GAME_NAME_QUERY,
        variables: {
            gameName: name
        }
    });
    let comments = res['data']['getCommentsByGameName'];
    comments.forEach((comment) => {
        console.log("----------------");
        console.log(comment);
    });
}

async function start() {
    console.log(`
Welcome!
1: get all current games
2: get all finished games
3: check scoreboard for specific game by id
4: check scoreboard for specific game by name
5: add comment for specific game
6: get comments for game by name
If you want exit, type 'exit'
    `);
    const prompt = require('prompt-sync')({sigint: true});
    let exit = false;
    while (!exit) {
        let option = prompt('Choose option: ');
        switch (option) {
            case '1':
                await getAllCurrentGames();
                break;
            case '2':
                await getAllFinishedGames();
                break;
            case '3':
                await pollingScoreboardById(prompt);
                break;
            case '4':
                await pollingScoreboardByName(prompt);
                break;
            case '5':
                await addCommentForGame(prompt);
                break;
            case '6':
                await getCommentsByGameName(prompt);
                break;
            case 'exit':
                exit = true;
                break;
        }
    }

}

start();


