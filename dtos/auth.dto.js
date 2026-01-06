exports.CreateAuthDTO = (email) => ({
    email: String(email).toLowerCase().trim()
});

exports.VerifyOTPDTO = (token, otp) => ({
    token: String(token).trim(),
    otp: String(otp).trim()
});
// -------------------------------------------------------------

exports.CreateAccountResDTO = (token, message = "Account created successfully, and OTP send to your Email") => ({
    success: true,
    token,
    message,
    timestamp: Date.now()
});

exports.CreateLoginResDTO = (token, message = "OTP sent to your email") => ({
    success: true,
    token,
    message,
    timestamp: Date.now()
});

exports.VerifyLoginResDTO = (token, message = "Login successful") => ({
    success: true,
    token,
    message,
    timestamp: Date.now()
});


exports.ErrorResDTO = (message = "Something went wrong", code = "SERVER_ERROR") => ({
    success: false,
    error: {
        code,
        message
    },
    timestamp: Date.now()
});