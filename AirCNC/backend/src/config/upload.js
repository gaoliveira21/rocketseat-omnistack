const multer = require('multer');
const path = require('path');

module.exports = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        //função para gerar o nome do arquivo
        filename: (req, file, cb) => {

            const ext = path.extname(file.originalname); //extensão do arquivo
            const name = path.basename(file.originalname, ext); // nome original sem a extensão

            cb(null, `${name}-${Date.now()}${ext}`);
        },
    }),
};