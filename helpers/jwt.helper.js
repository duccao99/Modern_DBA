const jwt = require("jsonwebtoken");

let verifyToken = (token, secretKey)=>{
    return new Promise((res,rej)=>{
        jwt.verify(token, secretKey,{algorithm: 'RS256'} ,(error,decoded)=>{
            if(error){
                return rej(error);
            }
            res(decoded);
        });
    });
}

module.exports = {
    verifyToken: verifyToken,
};