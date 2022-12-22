const express = require("express");
const multer = require("multer");
const PostController = require("../controllers/posts");
const router = express.Router();
const MIME_TYPE_MAP ={
    'image/png': 'png',
    'image.jpeg': 'jpeg',
    'image.jpg': 'jpg'
};
const storage= multer.diskStorage({ 
    destination: (req, file, cb) =>{
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = Error("Invalid mime type");
        if(isValid){
            error = null;
        }
        cb(error, "images");
    },
    filename: (req, file, cb) =>{
        const name = file.originalname.toLocaleLowerCase().split(" ").join('_');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name+'_'+Date.now() + '.'+ext);
    }
});
const upload = multer({ storage: storage });



router.post("", upload.single("image"), PostController.createPost);

router.put("/:id", upload.single("image"),PostController.updatePost);

router.get("", PostController.getPosts);

router.get("/:id", PostController.getPost);

router.delete("/:id",PostController.deletePost);

module.exports = router;
