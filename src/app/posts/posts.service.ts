import { Post } from './post.model';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPost() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((data) => {
        this.posts = data;
        this.postUpdated.next([...this.posts]);
      });
  }

  getPostFromId(id: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  deletePosts(id) {
    const url = 'http://localhost:3000/api/posts/' + id;
    this.http.delete(url).subscribe(
      (res) => {
        this.posts = this.posts.filter((post) => post.id !== id);
        this.postUpdated.next([...this.posts]);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {
      id: id,
      title: title,
      content: content,
    };
    const url = 'http://localhost:3000/api/posts/' + id;
    this.http.put(url, post).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/']);
    });
  }

  getPostsUpdateListener() {
    return this.postUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string; id: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((responseData) => {
        console.log(responseData);
        post.id = responseData.id;
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }
}
