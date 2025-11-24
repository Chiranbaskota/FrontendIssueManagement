import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PostService } from '../../services/post.service';
import { PostType } from '../../models/post.model';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Create New Post</h1>
        <a routerLink="/dashboard" class="btn btn-secondary">Back to Dashboard</a>
      </div>

      <div class="form-card">
        @if (errorMessage()) {
          <div class="error-alert" role="alert" aria-live="polite">
            {{ errorMessage() }}
          </div>
        }

        <form [formGroup]="postForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="title">Title</label>
            <input
              type="text"
              id="title"
              formControlName="title"
              class="form-control"
              placeholder="Enter post title"
              [attr.aria-invalid]="postForm.get('title')?.invalid && postForm.get('title')?.touched"
              aria-required="true"
            />
            @if (postForm.get('title')?.invalid && postForm.get('title')?.touched) {
              <span class="error-text" role="alert">Title is required</span>
            }
          </div>

          <div class="form-group">
            <label for="type">Type</label>
            <select
              id="type"
              formControlName="type"
              class="form-control"
              [attr.aria-invalid]="postForm.get('type')?.invalid && postForm.get('type')?.touched"
              aria-required="true"
            >
              <option value="">Select type</option>
              <option value="ISSUE">Issue</option>
              <option value="COMPLAINT">Complaint</option>
              <option value="ANNOUNCEMENT">Announcement</option>
              <option value="LOST">Lost</option>
              <option value="HELP">Help</option>
            </select>
            @if (postForm.get('type')?.invalid && postForm.get('type')?.touched) {
              <span class="error-text" role="alert">Type is required</span>
            }
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              formControlName="description"
              class="form-control"
              rows="6"
              placeholder="Enter post description"
              [attr.aria-invalid]="postForm.get('description')?.invalid && postForm.get('description')?.touched"
              aria-required="true"
            ></textarea>
            @if (postForm.get('description')?.invalid && postForm.get('description')?.touched) {
              <span class="error-text" role="alert">Description is required</span>
            }
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="postForm.invalid || loading()"
            >
              {{ loading() ? 'Creating...' : 'Create Post' }}
            </button>
            <a routerLink="/dashboard" class="btn btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
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

    .form-card {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .error-alert {
      background-color: #fee;
      border: 1px solid #fcc;
      border-radius: 4px;
      color: #c33;
      padding: 0.75rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
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
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-control[aria-invalid="true"] {
      border-color: #c33;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 120px;
    }

    .error-text {
      color: #c33;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: block;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
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
      text-align: center;
    }

    .btn-primary {
      background-color: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #5568d3;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
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
        gap: 1rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class CreatePostComponent {
  postForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');

      this.postService.createPost(this.postForm.value).subscribe({
        next: () => {
          this.router.navigate(['/posts/my-posts']);
        },
        error: (error) => {
          this.loading.set(false);
          this.errorMessage.set(
            error.error?.message || 'Failed to create post. Please try again.'
          );
        }
      });
    }
  }
}
