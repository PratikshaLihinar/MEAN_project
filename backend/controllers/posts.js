const Post = require("../models/post");

exports.createPost = (req, res, next)=>{
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
 
};

exports.updatePost = (req, res, next)=>{
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
};

exports.getPosts = (req,res, next)=>{
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
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching post failed!"
      });
    });
};

exports.deletePost = (req, res, next)=>{
  // console.log(req.params.id);
  Post.deleteOne({_id: req.params.id}).then(result=>{
      console.log(result);
      res.status(200).json({message: "post deleted"});

  })
};
