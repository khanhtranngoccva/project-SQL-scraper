const snippetController = require("./api/snippets");
const serverController = require("./api/server");

async function main() {
    const snippets = await snippetController.addSnippet({userID: 3}, {
        title: "Sample HTML page",
        html_content: "<h1>Sample Page</h1>"
    });
    console.log(snippets);
    await serverController.stopServer();
}

main();