import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Post } from "./post.model";
import { map } from "rxjs/operators"
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl+"/posts"; 

@Injectable({providedIn: 'root'})
export class PostsSevice{
   
    private posts: Post[]=[];       //create empty array restrict type by implementing interface
    private postUpdated = new Subject<{ posts:Post[], postCount :number}>();    //new instance
constructor(private http: HttpClient, private router: Router){}
    // getPost(){
    //     return [...this.posts];     //spread operator help to copy all data and creat new instance     
    //                                 //at the same time
    // }

    //improve code get data througth http client get method 
    getPost(postPerPage: number, currentPage: number){
        const queryParams =`?pageSize=${postPerPage}&page=${currentPage}`;
        this.http.get<{message: string, posts: any, maxPosts: number}>(BACKEND_URL + queryParams)     
        .pipe(map((postData)=>{
            return{post: postData.posts.map((post) =>{
                return{
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath
                };

            }),
            maxPosts: postData.maxPosts
        };
        }))
        .subscribe((transformPostData)=>{
            this.posts = transformPostData.post;
            this.postUpdated.next({posts:[...this.posts], postCount: transformPostData.maxPosts});

        });
    }
    getPostUpdateListener(){
        return this.postUpdated.asObservable();
    }
    getOnePost(id: string){
        return {...this.posts.find(p =>p.id === id)};
        // return this.http.get<{_id: string, title: string, content: string}>(BACKEND_URL + id);
    }
    addPost(title: string, content: string, image: File){
        // const post: Post ={id: null, title: title, content: content};
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);
        this.http.post<{message: string, post: Post}>(BACKEND_URL,postData)
        .subscribe((responseData)=>{
            console.log(responseData.message);
            // const post: Post ={
            //     id: responseData.post.id, 
            //     title: title, 
            //     content: content,
            //     imagePath: responseData.post.imagePath
            // };
            // // const id = responseData.post.id;
            // // post.id = id;
            // this.posts.push(post);
            // this.postUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
        });
        
    }
    updatePost(id: string,title: string, content: string, image: any){
        // const post: Post = {id: id, title: title, content: content, imagePath: null};
        let postData: Post | FormData;
        if(typeof(image) === 'object'){
            postData = new FormData();
            postData.append("id", id);
            postData.append("title", title);
            postData.append("content",content);
            postData.append("image", image, title);
        }else{
             postData ={
                id: id,
                title:title,
                content: content,
                imagePath: image
            } ;
        }
        this.http.put(BACKEND_URL+"/" + id, postData)
        .subscribe(response => {
            console.log(response);
            // const updatePosts = [...this.posts];
            // const oldPostIndex = updatePosts.findIndex(p => p.id === id);//check id is in the array matches or not
            // const post: Post ={
            //     id: id,
            //     title:title,
            //     content: content,
            //     imagePath: ""
            // }
            // updatePosts[oldPostIndex] = post;//put updated values
            // this.posts = updatePosts; //posts array assign it updated posts array
            // this.postUpdated.next([...this.posts]); //inform it - sending copy of updated array
            this.router.navigate(["/"]);
        });
    }
    deletePost(postID: string){   //return becase of subscribe it into post list conmonent
        return this.http.delete(BACKEND_URL+ "/" + postID);//after make golabal constant URL replace it with BACKEND_URL
    //  return this.http.delete("http://localhost:3000/api/posts/" + postID); //always add / before add postID 
        // .subscribe(()=>{
        //     // console.log("Deleted!");
        //     //updated frontend after deleting post
        //     const updatedPosts = this.posts.filter(post => post.id!== postID);
        //     this.posts= updatedPosts;
        //     this.postUpdated.next([...this.posts]);
            
        // });

    }
}