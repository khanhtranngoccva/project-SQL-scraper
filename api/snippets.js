const dbConnection = require("../database");

module.exports = {
    async getNewest(maxSnippets=6) {
        const [[result]] = await dbConnection.query("CALL get_newest(?)", [maxSnippets]);
        console.log(result);
    },
    async checkLike(userID, snippetID) {
        await dbConnection.query("CALL check_like(?, ?)", [userID, snippetID]);
    },
    async addLike(userID, snippetID) {
        await dbConnection.query("CALL add_like(?, ?)", [userID, snippetID]);
    },
    async removeLike(userID, snippetID) {
        await dbConnection.query("CALL remove_like(?, ?)", [userID, snippetID]);
    },

}