const bcrypt = require('bcrypt');
const webToken = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        bcrypt.hash(req.body.email, 8)
        .then(hash2 => {
            const user = new User({
                email: hash2,
                password: hash
            });
            user.save()
            .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
            .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};
exports.login = (req, res, next) => {
    User.find()
    .then(users => {
        var userMail = 0;
        users.forEach(element => {
            if(bcrypt.compareSync(req.body.email, element.email)){
                userMail = element.email;
                return userMail;
            }
        })
        if(!userMail){
            return res.status(401).json({error: 'Utilisateur non trouvé !'});
        }
        User.findOne({email: userMail})
        .then(user => {
            bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if(!valid){
                    return res.status(401).json({error: 'Mot de passe incorrect !'});
                }
                res.status(200).json({
                    userId: user._id,
                    token: webToken.sign(
                        {id: user._id}, process.env.SECRET_TOKEN_KEY, {expiresIn: 86400}
                    )
                });
            })
            .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};