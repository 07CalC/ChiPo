const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = (permRequired = 0) => {
    return async (req, res, next) => {
        if (req.cookies && req.cookies.token) {
            const token = req.cookies.token;
            jwt.verify(token, process.env.SECRET_KEY, async function (err, decode) {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                console.log(decode);
                const userId = decode.userId;

                //todo
                //check user exists
                data = (await User.get(userId));
                const result = (await User.get(userId))[0];
                if (result.length == 0) {
                  return res.status(404).json({message: "User's Data does not exist", userId});
                }
                delete result[0].hashedpassword;
                data = result[0];
          
                
                if (!data) {
                    err = "Expired session, please sign in again";
                } else {
                    req.params.userId = userId;
                    switch (permRequired) {
                        case 2:
                            if (!data.admin) err = 'Api key does not have permission to access this api endpoint.';
                        case 1:
                            if (!data.creator) err = 'Api key does not have permission to access this api endpoint.';
                        case 0:
                            if(!err) return next();
                    }
                }
                console.log(err);
                if (err) {
                    res.status(401).send({ message: err });
                }
            });
        } else {
            res.status(500).send({ message: 'User not logged in' });
        }
    }
};

module.exports = authMiddleware;
