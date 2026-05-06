const zxcvbn = require("zxcvbn");

const validatePassword = (req, res, next) => {
    const { password } = req.body;
    const result = zxcvbn(password);

    if(result.score < 3){
        return res.status(400).json({ success: false, message: "ENTER STRONG PASSWORD!" });
    }
    next();
}

module.exports = validatePassword;