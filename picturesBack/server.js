const express = require('express');
const app = express();
const multer = require('multer');
const mime = require('mime');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        let dir = 'C:\\Users\\pedrob\\Documents\\GitHub\\Pictures\\takePictures\\upload';
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}.${mime.extension(file.mimetype)}`)
    }
})

const upload = multer({storage: storage});

app.post("/uploadFile", upload.single("image"), (req, res) => {
    console.log(req.file);
    res.send("200");
});

app.listen(4500, () => {
    console.log('localhost:4500');
})