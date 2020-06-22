class User {
    constructor(userId, userName, passWord, isAdmin) {
        this.userId = userId;
        this.userName = userName;
        this.passWord = passWord;
        this.isAdmin = isAdmin;
    }
}

module.exports = User;