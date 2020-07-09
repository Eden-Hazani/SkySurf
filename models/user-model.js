class User {
    constructor(userId, userName, passWord, firstName, lastName, isAdmin) {
        this.userId = userId;
        this.userName = userName;
        this.passWord = passWord;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isAdmin = isAdmin;
    }
}

module.exports = User;