const Sauce = require('../models/sauce');
const fileSystem = require('fs');

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save()
    .then(() => res.status(201).json({message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({error}));
};
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({error}));
};
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fileSystem.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({error}));
        });
    })
    .catch(error => res.status(500).json({error}));
};
exports.likesOrDislikes = (req, res, next) => {
    const likeOrDislike = req.body;
    switch (likeOrDislike.like) {
        case 1:
            Sauce.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: likeOrDislike.userId}})
            .then(() => res.status(200).json({message: 'Sauce liké !'}))
            .catch(error => res.status(500).json({error}));
            break;
        case -1:
            Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: likeOrDislike.userId}})
            .then(() => res.status(200).json({message: 'Sauce non-liké !'}))
            .catch(error => res.status(500).json({error}));
            break;
        case 0:
            Sauce.findOne({_id: req.params.id})
            .then(sauce => {
                sauce.usersLiked.forEach(element => {
                    if(element == likeOrDislike.userId){
                        sauce.update({$pull: {usersLiked: likeOrDislike.userId}, $inc: {likes: -1}})
                        .then(() => res.status(200).json({message: 'Sauce non-liké !'}))
                        .catch(error => res.status(500).json({error}));
                    }
                });
                sauce.usersDisliked.forEach(element => {
                    if(element == likeOrDislike.userId){
                        sauce.update({$pull: {usersDisliked: likeOrDislike.userId}, $inc: {dislikes: -1}})
                        .then(() => res.status(200).json({message: 'Sauce non-liké !'}))
                        .catch(error => res.status(500).json({error}));
                    }
                });
            })
            .catch(error => res.status(500).json({error}));
            break;
    }
}