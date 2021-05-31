
const jwtHelper = require("../helpers/jwt.helper");

const key = 
{   
    public:
    '-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKnyIsVzV3/7A5hO3+brWZNu0xqecq/A\nypS5UV8NDFGaCdYstbYxrVUv5lWH3uBDB/6vuHKWVKi2oJyrqh2XDjMCAwEAAQ==\n-----END PUBLIC KEY-----' 
}
const accessTokenSecret = key.public;

let isAuth = async(req,res,next)=>{
    const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
    if(tokenFromClient){
        try{
            const decoded = await jwtHelper.verifyToken(tokenFromClient,key.public);
            req.decoded = decoded;
            if(decoded['role'] == 'user'){
                next();
            } else throw error;
        } catch(error){
            return res.status(401).json({
                messsage:"Unauthorized",
            });
        }
    } else{
        return res.status(403).send({message: 'No token provided.'})
    }
}

let isShop = async(req,res,next)=>{
    const tokenFromClient = req.body.token || req.query.token || req.headers["x-access-token"];
    if(tokenFromClient){
        try{
            const decoded = await jwtHelper.verifyToken(tokenFromClient,key.public);
            req.decoded = decoded;
            if(decoded['role'] == 'shop'){
                next();
            } else throw error;
        } catch(error){
            console.log(error);
            return res.status(401).json({
                messsage:"Unauthorized",
            });
        }
    } else{
        return res.status(403).send({message: 'No token provided.'})
    }
}

module.exports = {
    isAuth: isAuth,
    isShop: isShop
}