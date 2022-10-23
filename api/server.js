const dbConnection = require("../database");

module.exports = {
    async stopServer() {
        await dbConnection.end();
        process.exit(0);
    }
};