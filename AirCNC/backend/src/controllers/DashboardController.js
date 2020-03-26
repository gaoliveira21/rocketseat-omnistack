const Spot = require('../models/Spot');

module.exports = {

    async show(req, res) {

        const { user_id } = req.headers;

        const spots = await Spot.find({ user: user_id }); //busca os campos em que o user é igual ao user_id

        return res.json(spots);

    }

}