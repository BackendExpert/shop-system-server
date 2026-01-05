const {
    CreateAuthDTO,
    VerifyOTPDTO,
    ErrorResDTO
} = require("../dtos/auth.dto");
const AuthService = require("../services/auth.service");

const AuthController = {
    createAuth: async (req, res) => {
        try {
            const { email } = req.body

            const dto = CreateAuthDTO(email)

            const result = await AuthService.createAuth(
                dto.email,
                req
            )

            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    },

    verifyOTP: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) return res.status(401).json({ message: "Access denied" });

            const  { otp } = req.body

            const dto = VerifyOTPDTO(token, otp)

            const result = await AuthService.verifyOTP(
                dto.token,
                dto.otp,
                req
            )
            
            res.status(200).json(result)

        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    }
};

module.exports = AuthController;