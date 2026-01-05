const RESET_TIME = 15 * 60 * 1000;

function shouldResetAttempts(user) {
    if (!user.lastLoginAttemptAt) return true;

    return (Date.now() - user.lastLoginAttemptAt.getTime()) > RESET_TIME;
}

module.exports = { shouldResetAttempts };