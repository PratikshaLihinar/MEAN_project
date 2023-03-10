import { OnDestroy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsSevice } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy{
  enteredTitle="";
  enteredContent="";
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: any;
  private mode = 'create';
  private postID: string;
 private authStatusSub: Subscription;
  constructor(public postsService: PostsSevice, 
    public route: ActivatedRoute,
    public authService: AuthService){}
  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus =>{
        this.isLoading=false;
      }
    );
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'content': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {validators: [Validators.required]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) =>{
      if (paramMap.has('postID')){
        this.mode = 'edit';
        this.postID = paramMap.get('postID');
        this.isLoading= true;
        this.post = this.postsService.getOnePost(this.postID);
        //  this.postsService.getOnePost(this.postID).subscribe(postData => {
        //   this.post = {id: postData._id, title: postData.title, content: postData.content, imagePath: null};
        //  });
        this.form.setValue({
          'title':this.post.title, 
          'content': this.post.content,
          'image': this.post.imagePath
        });
        this.isLoading =false;
      }else{
        this.mode = 'create';
        this.postID = null;
      }
    });
  }
  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});// stored file object
    this.form.get('image').updateValueAndValidity();
    // console.log(file);
    // console.log(this.form);
    const reader = new FileReader();
    reader.onload =() =>{
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
  onSavePost(){
    if(this.form.invalid){
      return;
    }
    this.isLoading= true;
    if(this.mode === 'create'){
      //create new post
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);

    }else{
      //update post
      this.postsService.updatePost(this.postID, this.form.value.title, this.form.value.content, this.form.value.image);

    }
    this.form.reset();
  }
  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
