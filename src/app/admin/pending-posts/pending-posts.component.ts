import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-pending-posts',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Pending Approval ({{ pendingPosts().length }})</h1>
        <a routerLink="/dashboard" class="btn btn-secondary">Back to Dashboard</a>
      </div>

      @if (loading()) {
        <div class="loading">Loading pending posts...</div>
      } @else if (pendingPosts().length === 0) {
        <div class="empty-state">
          <p>No posts pending approval.</p>
        </div>
      } @else {
        <div class="posts-list">
          @for (post of pendingPosts(); track post.id) {
            <div class="post-card">
              <div class="post-header">
                <div class="post-title-section">
                  <h3>{{ post.title }}</h3>
                  <div class="post-meta">
                    <span class="type-badge">{{ post.type }}</span>
                    <span class="author">by {{ post.username || 'Unknown' }}</span>
                    <span class="date">{{ formatDate(post.createdAt || '') }}</span>
                  </div>
                </div>
                <span class="badge badge-pending">Pending</span>
              </div>

              <p class="post-description">{{ post.description }}</p>

              <div class="actions-section">
                <a [routerLink]="['/posts', post.id]" class="btn btn-small btn-info">
                  View Full Details
                </a>

                @if (!showUpdateForm[post.id]) {
                  <button
                    class="btn btn-small btn-success"
                    (click)="showUpdateFormFor(post.id, 'approve')"
                    [disabled]="processing()"
                  >
                    Approve
                  </button>
                  <button
                    class="btn btn-small btn-danger"
                    (click)="showUpdateFormFor(post.id, 'reject')"
                    [disabled]="processing()"
                  >
                    Reject
                  </button>
                }

                @if (showUpdateForm[post.id]) {
                  <div class="update-form">
                    <h4>{{ updateAction[post.id] === 'approve' ? 'Approve' : 'Reject' }} Post</h4>
                    <form [formGroup]="updateForms[post.id]" (ngSubmit)="submitAction(post.id)">
                      <div class="form-group">
                        <label [attr.for]="'updateNote-' + post.id">Update Note (Optional)</label>
                        <textarea
                          [attr.id]="'updateNote-' + post.id"
                          formControlName="updateNote"
                          class="form-control"
                          rows="3"
                          placeholder="Add a note for the user..."
                        ></textarea>
                      </div>
                      <div class="form-actions">
                        <button
                          type="submit"
                          class="btn btn-small"
                          [class.btn-success]="updateAction[post.id] === 'approve'"
                          [class.btn-danger]="updateAction[post.id] === 'reject'"
                          [disabled]="processing()"
                        >
                          {{ processing() ? 'Processing...' : 'Confirm ' + (updateAction[post.id] === 'approve' ? 'Approval' : 'Rejection') }}
                        </button>
                        <button
                          type="button"
                          class="btn btn-small btn-secondary"
                          (click)="cancelUpdate(post.id)"
                          [disabled]="processing()"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 3rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      color: #666;
    }

    .posts-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .post-card {
      background-color: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .post-title-section {
      flex: 1;
    }

    .post-title-section h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.25rem;
    }

    .post-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #666;
      flex-wrap: wrap;
    }

    .type-badge {
      padding: 0.25rem 0.5rem;
      background-color: #e3f2fd;
      color: #1976d2;
      border-radius: 4px;
      font-weight: 600;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .badge-pending {
      background-color: #fff3cd;
      color: #856404;
    }

    .post-description {
      color: #666;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    .actions-section {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .update-form {
      width: 100%;
      margin-top: 1rem;
      padding: 1rem;
      background-color: #f9f9f9;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
    }

    .update-form h4 {
      margin: 0 0 1rem 0;
      color: #333;
      font-size: 1rem;
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

    .form-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
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

    .btn-small {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
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

    .btn-secondary:hover:not(:disabled) {
      background-color: #d0d0d0;
    }

    .btn-success {
      background-color: #28a745;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background-color: #218838;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #c82333;
    }

    .btn-info {
      background-color: #17a2b8;
      color: white;
    }

    .btn-info:hover:not(:disabled) {
      background-color: #138496;
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
        gap: 1rem;
      }

      .post-header {
        flex-direction: column;
      }
    }
  `]
})
export class PendingPostsComponent implements OnInit {
  pendingPosts = signal<Post[]>([]);
  loading = signal(true);
  processing = signal(false);

  showUpdateForm: { [key: number]: boolean } = {};
  updateAction: { [key: number]: 'approve' | 'reject' } = {};
  updateForms: { [key: number]: FormGroup } = {};

  constructor(
    private postService: PostService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadPendingPosts();
  }

  loadPendingPosts(): void {
    this.loading.set(true);
    this.postService.getAllPosts().subscribe({
      next: (posts) => {
        const pending = posts.filter(p => p.status === 'PENDING_APPROVAL');
        this.pendingPosts.set(pending);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  showUpdateFormFor(postId: number, action: 'approve' | 'reject'): void {
    this.showUpdateForm[postId] = true;
    this.updateAction[postId] = action;
    this.updateForms[postId] = this.fb.group({
      updateNote: ['']
    });
  }

  cancelUpdate(postId: number): void {
    this.showUpdateForm[postId] = false;
    delete this.updateAction[postId];
    delete this.updateForms[postId];
  }

  submitAction(postId: number): void {
    const action = this.updateAction[postId];
    const updateNote = this.updateForms[postId].value.updateNote;

    this.processing.set(true);

    const request$ = action === 'approve'
      ? this.postService.approvePost(postId, updateNote)
      : this.postService.rejectPost(postId, updateNote);

    request$.subscribe({
      next: () => {
        this.processing.set(false);
        this.cancelUpdate(postId);
        this.loadPendingPosts();
      },
      error: () => {
        this.processing.set(false);
        alert(`Failed to ${action} post`);
      }
    });
  }

  formatDate(date: string): string {
    return date ? new Date(date).toLocaleDateString() : '';
  }
}
