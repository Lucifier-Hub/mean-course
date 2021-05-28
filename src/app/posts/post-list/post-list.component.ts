import { Component, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postsSub: Subscription;
  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.getPost();
    this.postsSub = this.postsService
      .getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  deletePost(id: string) {
    this.postsService.deletePosts(id);
  }
}
