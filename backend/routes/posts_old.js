const express = require("express");
const multer = require("multer");
const { count } = require("../models/post");

const Post = require('../models/post');        //import model
// const checkAuth = require('../middleware/check-auth');
const checkAuth = require("../middleware/check-auth");  

const router = express.Router();
const MIME_TYPE_MAP ={
    'image/png': 'png',
    'image.jpeg': 'jpeg',
    'image.jpg': 'jpg'
};
//view documentation its solve error - https://github.com/expressjs/multer
// 1.install multer - npm i --save multer
//2. import it - const multer = require("multer"); declare MIME_TYPE_MAP
//3. storage 
//4 upload
//5. call in url & save
const storage= multer.diskStorage({ 
    destination: (req, file, cb) =>{
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = Error("Invalid mime type");
        if(isValid){
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) =>{
        const name = file.originalname.toLocaleLowerCase().split(" ").join('_');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name+'_'+Date.now() + '.'+ext);
    }
});
  const upload = multer({ storage: storage });


router.post("", upload.single("image"),(req, res, next)=>{
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
       
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
       
    });
    // console.log(post);
    post.save().then(createdPost => {
        // console.log(result);
        res.status(201).json({
            message: 'Post added successfully',
            // postID: createdPost._id
            post:{
                ...createdPost,
                id : createdPost._id
                
            }
        });
    })
    .catch(error =>{
        res.status(500).json({
            message: "Creating a post failed!"
        });
    });
   
});
// router.put("/api/posts/:id",(req, res, next)=>{
    router.put("/:id", upload.single("image"),(req, res, next)=>{
        let imagePath = req.body.imagePath;
        if(req.file){
            const url = req.protocol + '://' + req.get("host");
            imagePath= url + "/images/" + req.file.filename;
            // console.log(imagePath);
        }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
        
    });
    // console.log(req.body.imagePath);
    Post.updateOne({_id: req.params.id}, post)
    .then(result => {
        console.log(result);
        res.status(200).json({message: 'Update sucessfully!'});
    })
    .catch(error =>{
        res.status(500).json({
            message:"Couldn't update post!"
        });
    });
});
router.get("",(req,res, next)=>{
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchPosts;
    if(pageSize && currentPage){
        postQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    postQuery
    .then(document =>{
        // console.log(document);
        fetchPosts =document;
        return Post.count();
   
})
.then(count =>{
    res.status(200).json({
        message: 'Post Fetch successfully',
        posts: fetchPosts,
        maxPosts: count
    });
})
.catch(error => {
    res.status(500).json({
        message:"Fetching posts failed!"
    });
});
});

// router.use('/api/posts',(req, res, next)=>{
//     res.send('hello from express!');   //client make a request ant res is a object which send back the response
//     const posts =[
//         {
//             id: 'asdfsag',
//             title: 'First post',
//             content: 'this is my first post'
//         },
//         {
//             id: 'asdfsag',
//             title: 'Second post',
//             content: 'this is my second post'
//         },
//         {
//             id: 'asdfsag',
//             title: 'Third post',
//             content: 'this is my third post'
//         }
//     ];
  
//     res.status(200).json({
//         message: 'Posts fetched successfully!',
//         posts:posts
//     });
// });



router.delete("/:id" , (req, res, next)=>{
    // console.log(req.params.id);
    Post.deleteOne({_id: req.params.id}).then(result=>{
        console.log(result);
        res.status(200).json({message: "post deleted"});

    })
});
module.exports = router;


// const express = require("express");
// const multer = require("multer");

// const Post = require("../models/post");
// const checkAuth = require("../middleware/check-auth");

// const router = express.Router();

// const MIME_TYPE_MAP = {
//   "image/png": "png",
//   "image/jpeg": "jpg",
//   "image/jpg": "jpg"
// };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const isValid = MIME_TYPE_MAP[file.mimetype];
//     let error = new Error("Invalid mime type");
//     if (isValid) {
//       error = null;
//     }
//     cb(error, "backend/images");
//   },
//   filename: (req, file, cb) => {
//     const name = file.originalname
//       .toLowerCase()
//       .split(" ")
//       .join("-");
//     const ext = MIME_TYPE_MAP[file.mimetype];
//     cb(null, name + "-" + Date.now() + "." + ext);
//   }
// });

// router.post(
//   "",
//   checkAuth,
//   multer({ storage: storage }).single("image"),
//   (req, res, next) => {
//     const url = req.protocol + "://" + req.get("host");
//     const post = new Post({
//       title: req.body.title,
//       content: req.body.content,
//       imagePath: url + "/images/" + req.file.filename
//     });
//     post.save().then(createdPost => {
//       res.status(201).json({
//         message: "Post added successfully",
//         post: {
//           ...createdPost,
//           id: createdPost._id
//         }
//       });
//     });
//   }
// );

// router.put(
//   "/:id",
//   checkAuth,
//   multer({ storage: storage }).single("image"),
//   (req, res, next) => {
//     let imagePath = req.body.imagePath;
//     if (req.file) {
//       const url = req.protocol + "://" + req.get("host");
//       imagePath = url + "/images/" + req.file.filename;
//     }
//     const post = new Post({
//       _id: req.body.id,
//       title: req.body.title,
//       content: req.body.content,
//       imagePath: imagePath
//     });
//     console.log(post);
//     Post.updateOne({ _id: req.params.id }, post).then(result => {
//       res.status(200).json({ message: "Update successful!" });
//     });
//   }
// );

// router.get("", (req, res, next) => {
//   const pageSize = +req.query.pagesize;
//   const currentPage = +req.query.page;
//   const postQuery = Post.find();
//   let fetchedPosts;
//   if (pageSize && currentPage) {
//     postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
//   }
//   postQuery
//     .then(documents => {
//       fetchedPosts = documents;
//       return Post.count();
//     })
//     .then(count => {
//       res.status(200).json({
//         message: "Posts fetched successfully!",
//         posts: fetchedPosts,
//         maxPosts: count
//       });
//     });
// });

// router.get("/:id", (req, res, next) => {
//   Post.findById(req.params.id).then(post => {
//     if (post) {
//       res.status(200).json(post);
//     } else {
//       res.status(404).json({ message: "Post not found!" });
//     }
//   });
// });

// router.delete("/:id", checkAuth, (req, res, next) => {
//   Post.deleteOne({ _id: req.params.id }).then(result => {
//     console.log(result);
//     res.status(200).json({ message: "Post deleted!" });
//   });
// });

// module.exports = router;
