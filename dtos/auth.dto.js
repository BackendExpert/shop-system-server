exports.CreateAuthDTO = (email) => ({
    email: String(email).toLowerCase().trim()
});

exports.VerifyOTPDTO = (email, otp) => ({
    email: String(email).toLowerCase().trim(),
    otp: String(otp).trim()
});

// -------------------------------------------------------------

exports.CreateAccountResDTO = (message = "Account created successfully, and OTP send to your Email") => ({
    success: true,
    token,
    message,
    timestamp: Date.now()
});

exports.CreateLoginResDTO = (message = "OTP sent to your email") => ({
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