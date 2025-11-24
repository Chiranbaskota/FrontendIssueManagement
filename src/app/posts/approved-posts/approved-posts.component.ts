import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-approved-posts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>Approved Posts</h1>
        <a routerLink="/dashboard" class="btn btn-secondary">Back to Dashboard</a>
      </div>

      @if (loading()) {
        <div class="loading">Loading approved posts...</div>
      } @else if (posts().length === 0) {
        <div class="empty-state">
          <p>No approved posts available yet.</p>
        </div>
      } @else {
        <div class="posts-grid">
          @for (post of posts(); track post.id) {
            <div class="post-card">
              <div class="post-header">
                <h3>{{ post.title }}</h3>
                <span class="badge badge-approved">Approved</span>
              </div>
              <div class="post-meta">
                <span class="post-type">{{ post.type }}</span>
                @if (post.username) {
                  <span class="post-author">by {{ post.username }}</span>
                }
                @if (post.createdAt) {
                  <span class="post-date">{{ formatDate(post.createdAt) }}</span>
                }
              </div>
              <p class="post-description">{{ post.description }}</p>
              <div class="post-actions">
                <a [routerLink]="['/posts', post.id]" class="btn btn-small btn-primary">
                  View Details & Comments
                </a>
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

    .loading {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .empty-state {
      background-color: white;
      padding: 3rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .empty-state p {
      color: #666;
      margin: 0;
    }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .post-card {
      background-color: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .post-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
      gap: 1rem;
    }

    .post-header h3 {
      margin: 0;
      color: #333;
      font-size: 1.25rem;
      flex: 1;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .badge-approved {
      background-color: #d4edda;
      color: #155724;
    }

    .post-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      color: #666;
      flex-wrap: wrap;
    }

    .post-type {
      font-weight: 600;
      color: #667eea;
    }

    .post-author {
      color: #999;
    }

    .post-description {
      color: #666;
      margin-bottom: 1rem;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .post-actions {
      display: flex;
      gap: 0.5rem;
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

    .btn-primary:hover {
      background-color: #5568d3;
    }

    .btn-secondary {
      background-color: #e0e0e0;
      color: #333;
    }

    .btn-secondary:hover {
      background-color: #d0d0d0;
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

      .posts-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ApprovedPostsComponent implements OnInit {
  posts = signal<Post[]>([]);
  loading = signal(true);

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading.set(true);
    this.postService.getApprovedPosts().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}
