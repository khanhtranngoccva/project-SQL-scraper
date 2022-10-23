const dbConnection = require("../database");

const snippetsController = require("../api/snippets");

const loremIpsum = require("lorem-ipsum").loremIpsum;

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function generateComments() {
    const snippetQuery = await dbConnection.query("SELECT id FROM snippet");
    const userQuery = await dbConnection.query("SELECT id FROM user");
    const snippets = snippetQuery[0].map(snippet => snippet.id);
    const users = userQuery[0].map(user => user.id);
    for (let i = 0; i < 50; i++) {
        await dbConnection.query("INSERT INTO comment (commented_by, comment_target, comment_text) VALUES (?, ?, ?)", [
            pickRandom(users),
            pickRandom(snippets),
            loremIpsum(),
        ]);
    }
    await dbConnection.end();
}


async function generateLikes() {
    const snippetQuery = await dbConnection.query("SELECT id FROM snippet");
    const userQuery = await dbConnection.query("SELECT id FROM user");
    const snippets = snippetQuery[0].map(snippet => snippet.id);
    const users = userQuery[0].map(user => user.id);
    for (let i = 0; i < 50; i++) {
        const curSnippet = pickRandom(snippets);
        const curUser = pickRandom(users);
        await snippetsController.addLike(curUser, curSnippet);
    }
    await dbConnection.end();
}

generateLikes();