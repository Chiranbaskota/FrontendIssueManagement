import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <nav class="navbar">
        <div class="navbar-content">
          <h1>Issue Management</h1>
          <div class="navbar-actions">
            <span class="user-info">
              {{ currentUser()?.username }} ({{ currentUser()?.role }})
            </span>
            <button class="btn btn-secondary" (click)="logout()">Logout</button>
          </div>
        </div>
      </nav>

      <div class="dashboard-content">
        <div class="sidebar">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="sidebar-link">
            <span class="icon">📊</span> Dashboard
          </a>
          <a routerLink="/posts/approved" routerLinkActive="active" class="sidebar-link">
            <span class="icon">✓</span> Approved Posts
          </a>
          <a routerLink="/posts/my-posts" routerLinkActive="active" class="sidebar-link">
            <span class="icon">📝</span> My Posts
          </a>
          <a routerLink="/posts/create" routerLinkActive="active" class="sidebar-link">
            <span class="icon">➕</span> Create Post
          </a>
          @if (isAdmin()) {
            <hr class="sidebar-divider" />
            <div class="sidebar-section-title">Admin</div>
            <a routerLink="/admin/posts" routerLinkActive="active" class="sidebar-link">
              <span class="icon">📋</span> All Posts
            </a>
            <a routerLink="/admin/pending" routerLinkActive="active" class="sidebar-link">
              <span class="icon">⏳</span> Pending Approval
            </a>
          }
        </div>

        <div class="main-content">
          <div class="welcome-section">
            <h2>Welcome, {{ currentUser()?.username }}!</h2>
            <p>Manage and track your posts in the Issue Management System</p>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ myPostsCount() }}</div>
              <div class="stat-label">My Posts</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ approvedPostsCount() }}</div>
              <div class="stat-label">Approved Posts</div>
            </div>
            @if (isAdmin()) {
              <div class="stat-card">
                <div class="stat-value">{{ pendingCount() }}</div>
                <div class="stat-label">Pending Approval</div>
              </div>
            }
          </div>

          <div class="quick-actions">
            <h3>Quick Actions</h3>
            <div class="action-buttons">
              <a routerLink="/posts/create" class="action-btn">
                <span class="icon">➕</span>
                <span>Create New Post</span>
              </a>
              <a routerLink="/posts/my-posts" class="action-btn">
                <span class="icon">📝</span>
                <span>View My Posts</span>
              </a>
              @if (isAdmin()) {
                <a routerLink="/admin/pending" class="action-btn">
                  <span class="icon">⏳</span>
                  <span>Review Pending</span>
                </a>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .navbar {
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1rem 2rem;
    }

    .navbar-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar h1 {
      margin: 0;
      font-size: 1.5rem;
      color: #333;
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      font-size: 0.875rem;
      color: #666;
      font-weight: 500;
    }

    .dashboard-content {
      display: flex;
      max-width: 1400px;
      margin: 0 auto;
      min-height: calc(100vh - 72px);
    }

    .sidebar {
      width: 250px;
      background-color: #fff;
      padding: 2rem 0;
      box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
    }

    .sidebar-link {
      display: flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      color: #666;
      text-decoration: none;
      transition: all 0.2s;
      font-weight: 500;
    }

    .sidebar-link:hover {
      background-color: #f5f5f5;
      color: #667eea;
    }

    .sidebar-link.active {
      background-color: #667eea;
      color: white;
      border-right: 4px solid #5568d3;
    }

    .sidebar-link .icon {
      margin-right: 0.75rem;
      font-size: 1.25rem;
    }

    .sidebar-divider {
      margin: 1rem 0;
      border: none;
      border-top: 1px solid #e0e0e0;
    }

    .sidebar-section-title {
      padding: 0.5rem 1.5rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .main-content {
      flex: 1;
      padding: 2rem;
    }

    .welcome-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .welcome-section h2 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
    }

    .welcome-section p {
      margin: 0;
      opacity: 0.9;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background-color: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #666;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .quick-actions {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .quick-actions h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
      background-color: #f5f5f5;
      border-radius: 8px;
      text-decoration: none;
      color: #333;
      transition: all 0.2s;
      gap: 0.5rem;
    }

    .action-btn:hover {
      background-color: #667eea;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }

    .action-btn .icon {
      font-size: 2rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary {
      background-color: #e0e0e0;
      color: #333;
    }

    .btn-secondary:hover {
      background-color: #d0d0d0;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
      }

      .navbar {
        padding: 1rem;
      }

      .navbar-content {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser = this.authService.currentUser;
  isAdmin = this.authService.isAdmin;

  myPostsCount = signal(0);
  approvedPostsCount = signal(0);
  pendingCount = signal(0);

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.postService.getUserPosts().subscribe({
      next: (posts) => this.myPostsCount.set(posts.length)
    });

    this.postService.getApprovedPosts().subscribe({
      next: (posts) => this.approvedPostsCount.set(posts.length)
    });

    if (this.isAdmin()) {
      this.postService.getAllPosts().subscribe({
        next: (posts) => {
          const pending = posts.filter(p => p.status === 'PENDING_APPROVAL');
          this.pendingCount.set(pending.length);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
