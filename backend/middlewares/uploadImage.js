const multer = require("multer")
const sharp = require("sharp")
const path = require("path")

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.filename + "-" + uniqueSuffix + ".jpeg");
    }
})

const multerFilter = (req, file, cb){

}

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldSize: 2000000 }
})