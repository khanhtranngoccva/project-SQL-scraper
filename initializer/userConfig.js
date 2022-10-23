const dbConnection = require("../database");

async function resetConfiguration() {
    await dbConnection.query("DELETE FROM user_config");
    const [IDs] = await dbConnection.query("SELECT id FROM user");
    await dbConnection.query("INSERT INTO user_config (belongs_to) VALUES ?", [IDs.map(idObject => [idObject.id])]);
    await dbConnection.end();
}

resetConfiguration();

