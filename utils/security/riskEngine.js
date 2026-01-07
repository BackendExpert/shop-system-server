const calculateRiskScore = ({ user, req, deviceId }) => {
    // for get the risk 
    let risk = 0;

    // fetch ip
    const ip =
        req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // last login ip not equal for crrunt ip this risk + 40
    if (user.lastLoginIp && user.lastLoginIp !== ip) risk += 40;

    // new device login
    if (!user.trustedDevices?.includes(deviceId)) risk += 30;

    // not in noraml login times
    const hour = new Date().getHours();
    if (hour < 5 || hour > 23) risk += 20;

    // user try to login more than 2 attempts
    if (user.login_attempt >= 2) risk += 20;

    return risk; // 0–100
};

const riskDecision = (risk) => {
    if (risk < 30) return "LOW";
    if (risk < 60) return "MEDIUM";
    if (risk < 85) return "HIGH";
    return "CRITICAL";
};

module.exports = { calculateRiskScore, riskDecision };
