const snippetController = require("./api/snippets");
const serverController = require("./api/server");

async function main() {
    await snippetController.removeLike(3, 3);
    await serverController.stopServer();
}

main();