import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/post.model';
import { Comment } from '../../models/comment.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container">
      @if (loading()) {
        <div class="loading">Loading post details...</div>
      } @else if (post()) {
        <div class="header">
          <h1>{{ post()!.title }}</h1>
          <a routerLink="/dashboard" class="btn btn-secondary">Back</a>
        </div>

        <div class="post-detail-card">
          <div class="post-header">
            <span class="badge" [class]="'badge-' + post()!.status.toLowerCase()">
              {{ formatStatus(post()!.status) }}
            </span>
            <span class="post-type">{{ post()!.type }}</span>
          </div>

          <div class="post-meta">
            @if (post()!.username) {
              <span>Posted by: <strong>{{ post()!.username }}</strong></span>
            }
            @if (post()!.createdAt) {
              <span>Created: {{ formatDate(post()!.createdAt) }}</span>
            }
            @if (post()!.updatedAt) {
              <span>Updated: {{ formatDate(post()!.updatedAt) }}</span>
            }
          </div>

          <div class="post-description">
            <h3>Description</h3>
            <p>{{ post()!.description }}</p>
          </div>

          @if (post()!.updateNote) {
            <div class="update-note">
              <h3>Update Note</h3>
              <p>{{ post()!.updateNote }}</p>
            </div>
          }
        </div>

        <div class="comments-section">
          <h2>Comments ({{ comments().length }})</h2>

          @if (canComment()) {
            <div class="comment-form-card">
              <h3>Add Comment</h3>
              <form [formGroup]="commentForm" (ngSubmit)="onSubmitComment()">
                <div class="form-group">
                  <label for="content">Your Comment</label>
                  <textarea
                    id="content"
                    formControlName="content"
                    class="form-control"
                    rows="3"
                    placeholder="Write your comment..."
                    [attr.aria-invalid]="commentForm.get('content')?.invalid && commentForm.get('content')?.touched"
                    aria-required="true"
                  ></textarea>
                  @if (commentForm.get('content')?.invalid && commentForm.get('content')?.touched) {
                    <span class="error-text" role="alert">Comment is required</span>
                  }
                </div>
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="commentForm.invalid || submittingComment()"
                >
                  {{ submittingComment() ? 'Posting...' : 'Post Comment' }}
                </button>
              </form>
            </div>
          }

          @if (loadingComments()) {
            <div class="loading-comments">Loading comments...</div>
          } @else if (comments().length === 0) {
            <div class="no-comments">No comments yet. Be the first to comment!</div>
          } @else {
            <div class="comments-list">
              @for (comment of comments(); track comment.id) {
                <div class="comment-card">
                  <div class="comment-header">
                    <strong>{{ comment.username || 'Anonymous' }}</strong>
                    @if (comment.createdAt) {
                      <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
                    }
                  </div>
                  <p class="comment-content">{{ comment.content }}</p>
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div class="error-state">
          <p>Post not found.</p>
          <a routerLink="/dashboard" class="btn btn-primary">Go to Dashboard</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1rem;
    }

    .header h1 {
      margin: 0;
      color: #333;
      flex: 1;
    }

    .loading, .error-state {
      text-align: center;
      padding: 3rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .post-detail-card {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .post-header {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-draft {
      background-color: #e0e0e0;
      color: #666;
    }

    .badge-pending_approval {
      background-color: #fff3cd;
      color: #856404;
    }

    .badge-approved {
      background-color: #d4edda;
      color: #155724;
    }

    .badge-rejected {
      background-color: #f8d7da;
      color: #721c24;
    }

    .badge-closed {
      background-color: #d6d8db;
      color: #383d41;
    }

    .post-type {
      font-weight: 600;
      color: #667eea;
    }

    .post-meta {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      color: #666;
      flex-wrap: wrap;
    }

    .post-description, .update-note {
      margin-bottom: 1.5rem;
    }

    .post-description h3, .update-note h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.125rem;
    }

    .post-description p, .update-note p {
      margin: 0;
      color: #666;
      line-height: 1.6;
      white-space: pre-wrap;
    }

    .update-note {
      background-color: #fff3cd;
      padding: 1rem;
      border-radius: 4px;
      border-left: 4px solid #ffc107;
    }

    .comments-section {
      margin-top: 2rem;
    }

    .comments-section h2 {
      margin: 0 0 1.5rem 0;
      color: #333;
    }

    .comment-form-card {
      background-color: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
    }

    .comment-form-card h3 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1.125rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.2s;
      box-sizing: border-box;
      resize: vertical;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-control[aria-invalid="true"] {
      border-color: #c33;
    }

    .error-text {
      color: #c33;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: block;
    }

    .loading-comments, .no-comments {
      text-align: center;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      color: #666;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .comment-card {
      background-color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .comment-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      gap: 1rem;
    }

    .comment-date {
      color: #999;
    }

    .comment-content {
      margin: 0;
      color: #666;
      line-height: 1.5;
      white-space: pre-wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary {
      background-color: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #5568d3;
    }

    .btn-secondary {
      background-color: #e0e0e0;
      color: #333;
    }

    .btn-secondary:hover {
      background-color: #d0d0d0;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class PostDetailComponent implements OnInit {
  post = signal<Post | null>(null);
  comments = signal<Comment[]>([]);
  loading = signal(true);
  loadingComments = signal(true);
  submittingComment = signal(false);
  commentForm: FormGroup;

  currentUser = this.authService.currentUser;
  isAdmin = this.authService.isAdmin;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private commentService: CommentService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    if (postId) {
      this.loadPost(postId);
      this.loadComments(postId);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  loadPost(postId: number): void {
    this.loading.set(true);
    this.postService.getPostById(postId).subscribe({
      next: (post) => {
        this.post.set(post);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.post.set(null);
      }
    });
  }

  loadComments(postId: number): void {
    this.loadingComments.set(true);
    this.commentService.getComments(postId).subscribe({
      next: (comments) => {
        this.comments.set(comments);
        this.loadingComments.set(false);
      },
      error: () => {
        this.loadingComments.set(false);
      }
    });
  }

  canComment(): boolean {
    const p = this.post();
    if (!p) return false;

    if (this.isAdmin()) return true;

    const currentUserId = this.currentUser()?.id;
    return p.status === 'APPROVED' || p.userId === currentUserId;
  }

  onSubmitComment(): void {
    if (this.commentForm.valid && this.post()) {
      this.submittingComment.set(true);
      this.commentService.addComment(this.post()!.id, this.commentForm.value).subscribe({
        next: () => {
          this.commentForm.reset();
          this.loadComments(this.post()!.id);
          this.submittingComment.set(false);
        },
        error: () => {
          this.submittingComment.set(false);
          alert('Failed to post comment');
        }
      });
    }
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ');
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  }
}
