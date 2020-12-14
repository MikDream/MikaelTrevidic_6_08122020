const webToken = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = webToken.verify(token, process.env.SECRET_TOKEN_KEY);
        const userId = decodedToken.id;
        if(req.body.userId && req.body.userId !== userId){
            throw 'User Id non valable !';
        }else{
            next();
        }
    }catch(error){
        res.status(401).json({error: error | 'Requête non authentifiée !'});
    }
};