import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-all-posts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="header">
        <h1>All Posts (Admin)</h1>
        <a routerLink="/dashboard" class="btn btn-secondary">Back to Dashboard</a>
      </div>

      <div class="filters">
        <button
          class="filter-btn"
          [class.active]="filter() === 'ALL'"
          (click)="setFilter('ALL')"
        >
          All ({{ posts().length }})
        </button>
        <button
          class="filter-btn"
          [class.active]="filter() === 'DRAFT'"
          (click)="setFilter('DRAFT')"
        >
          Draft ({{ countByStatus('DRAFT') }})
        </button>
        <button
          class="filter-btn"
          [class.active]="filter() === 'PENDING_APPROVAL'"
          (click)="setFilter('PENDING_APPROVAL')"
        >
          Pending ({{ countByStatus('PENDING_APPROVAL') }})
        </button>
        <button
          class="filter-btn"
          [class.active]="filter() === 'APPROVED'"
          (click)="setFilter('APPROVED')"
        >
          Approved ({{ countByStatus('APPROVED') }})
        </button>
        <button
          class="filter-btn"
          [class.active]="filter() === 'REJECTED'"
          (click)="setFilter('REJECTED')"
        >
          Rejected ({{ countByStatus('REJECTED') }})
        </button>
        <button
          class="filter-btn"
          [class.active]="filter() === 'CLOSED'"
          (click)="setFilter('CLOSED')"
        >
          Closed ({{ countByStatus('CLOSED') }})
        </button>
      </div>

      @if (loading()) {
        <div class="loading">Loading posts...</div>
      } @else if (filteredPosts().length === 0) {
        <div class="empty-state">
          <p>No posts found with status: {{ filter() }}</p>
        </div>
      } @else {
        <div class="posts-table-container">
          <table class="posts-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Author</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (post of filteredPosts(); track post.id) {
                <tr>
                  <td>{{ post.id }}</td>
                  <td class="title-cell">{{ post.title }}</td>
                  <td>
                    <span class="type-badge">{{ post.type }}</span>
                  </td>
                  <td>
                    <span class="badge" [class]="'badge-' + post.status.toLowerCase()">
                      {{ formatStatus(post.status) }}
                    </span>
                  </td>
                  <td>{{ post.username || 'Unknown' }}</td>
                  <td>{{ formatDate(post.createdAt || '') }}</td>
                  <td>
                    <a [routerLink]="['/posts', post.id]" class="action-link">
                      View
                    </a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .container {
      max-width: 1400px;
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

    .filters {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 0.5rem 1rem;
      border: 2px solid #e0e0e0;
      background-color: white;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      color: #666;
    }

    .filter-btn:hover {
      border-color: #667eea;
      color: #667eea;
    }

    .filter-btn.active {
      background-color: #667eea;
      border-color: #667eea;
      color: white;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 3rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      color: #666;
    }

    .posts-table-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow-x: auto;
    }

    .posts-table {
      width: 100%;
      border-collapse: collapse;
    }

    .posts-table th {
      background-color: #f5f5f5;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #e0e0e0;
      white-space: nowrap;
    }

    .posts-table td {
      padding: 1rem;
      border-bottom: 1px solid #f0f0f0;
      color: #666;
    }

    .posts-table tr:hover {
      background-color: #f9f9f9;
    }

    .title-cell {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 500;
      color: #333;
    }

    .type-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      background-color: #e3f2fd;
      color: #1976d2;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      white-space: nowrap;
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

    .action-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .action-link:hover {
      text-decoration: underline;
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

      .posts-table {
        font-size: 0.875rem;
      }

      .posts-table th,
      .posts-table td {
        padding: 0.5rem;
      }

      .title-cell {
        max-width: 150px;
      }
    }
  `]
})
export class AllPostsComponent implements OnInit {
  posts = signal<Post[]>([]);
  filter = signal<string>('ALL');
  loading = signal(true);

  filteredPosts = signal<Post[]>([]);

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading.set(true);
    this.postService.getAllPosts().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.applyFilter();
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  setFilter(status: string): void {
    this.filter.set(status);
    this.applyFilter();
  }

  applyFilter(): void {
    const currentFilter = this.filter();
    if (currentFilter === 'ALL') {
      this.filteredPosts.set(this.posts());
    } else {
      this.filteredPosts.set(this.posts().filter(p => p.status === currentFilter));
    }
  }

  countByStatus(status: string): number {
    return this.posts().filter(p => p.status === status).length;
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ');
  }

  formatDate(date: string): string {
    return date ? new Date(date).toLocaleDateString() : '';
  }
}
