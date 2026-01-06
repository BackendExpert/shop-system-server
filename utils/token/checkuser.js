const jwt = require("jsonwebtoken");
const User = require("../../models/user.model")

async function checkuser(email) {
    const user = await User.findOne({ email: email })

    if(!user){
        throw new Error("User Not DB")
    }

    return user
}

module.exports = checkuser;
