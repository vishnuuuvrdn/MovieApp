const zxcvbn = require("zxcvbn");

const validatePassword = (req, res) => {
    const { password } = req.body;
    const result = zxcvbn(password);

    if(result.score < 3){
        return res.status(400).json({ success: false, message: "ENTER STRONG PASSWORD!" });
    }

    res.json({ success: true, message: "Password is strong enough!" });
}

module.exports = validatePassword;