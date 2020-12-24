const bcrypt = require('bcrypt');
const webToken = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = (req, res, next) => {
    if(!(/^([^\s@]{2,})+@([^\s@]{2,})+(\.{1})+([a-z]|[0-9]{0,})+[^\s@]+$/.test(req.body.email))){
        return res.status(400).json({error: "Format de l'email invalide !"});
    }
    if(!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(req.body.password))){
        return res.status(400).json({error: 'Format du mot de passe invalide !'});
    }
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
        .catch(error => res.status(400).json({error}));
        })
    .catch(error => res.status(500).json({error}));
};
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if(!user){
            return res.status(401).json({error: 'Utilisateur non trouvé !'});
        }
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
};