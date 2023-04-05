module.exports = (server) => {
    const userController = require("../controllers/userController");
    server.post("/user/register", userController.register)
    server.post("/user/login" , userController.login)
    }