import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostsSevice } from '../posts.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[]=[];
  totalPost =0;
  postPerPage= 5;
  currentPage=1;
  isLoading=false;
  pageSizeOptions=[5, 10, 25, 100];
  userIsAuthenticated = false;
  private postsSub!: Subscription;
  private authStatusSub: Subscription;
  constructor(public postsService: PostsSevice, private authService: AuthService){}
  ngOnInit(){
   this.postsService.getPost(this.postPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((postData:{posts: Post[], postCount: number}) => {
      this.isLoading=false;
      this.totalPost= postData.postCount;
      this.posts = postData.posts;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated =>{
      this.userIsAuthenticated = isAuthenticated;
    });
  }
  onChangePage(pageData :PageEvent){
    this.isLoading=true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postsService.getPost(this.postPerPage, this.currentPage);
  }
 
  onDelete(postID: string){
    this.postsService.deletePost(postID).subscribe(()=>{
      this.postsService.getPost(this.postPerPage, this.currentPage);
    });
  }
  ngOnDestroy(){
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
