//index(listagem), show(listagem unica), store(criar), update(alterar), destroy(delete)
const User = require("../models/User");

module.exports = {
    //informa q a função é assincrona
    async store(req, res) {
        //busca o campo email dentro de req.body
        const { email } = req.body;

        //await aguarda até q uma instrução seja executada
        let user = await User.findOne({ email });

        if(!user){
            user = await User.create({ email });
        }

        return res.json(user);

    }
}