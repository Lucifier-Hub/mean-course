import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  constructor(
    public postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  postAdded = new EventEmitter<Post>();
  mode = 'create';
  postId: string;
  post: Post;
  isLoading = false;
  postForm: FormGroup;
  imagePreview: string;

  ngOnInit() {
    this.postForm = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, Validators.required),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.postId = paramMap.get('id');
        this.isLoading = true;
        this.postsService.getPostFromId(this.postId).subscribe((post) => {
          this.post = {
            id: post._id,
            title: post.title,
            content: post.content,
          };
          this.isLoading = false;
          this.postForm.setValue({
            title: post.title,
            content: post.content,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.get('image').setValue(file);
    this.postForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);

    console.log(this.imagePreview);

    console.log(file);
    console.log(event);
  }

  onSavePost() {
    if (this.postForm.invalid) {
      return;
    }
    if (this.mode === 'edit') {
      this.postsService.updatePost(
        this.postId,
        this.postForm.value.title,
        this.postForm.value.content
      );
    } else {
      this.postsService.addPost(
        this.postForm.value.title,
        this.postForm.value.content
      );
    }
    this.postForm.reset();
  }
}
