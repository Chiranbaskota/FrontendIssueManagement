import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'posts',
    canActivate: [authGuard],
    children: [
      {
        path: 'create',
        loadComponent: () => import('./posts/create-post/create-post.component').then(m => m.CreatePostComponent)
      },
      {
        path: 'my-posts',
        loadComponent: () => import('./posts/my-posts/my-posts.component').then(m => m.MyPostsComponent)
      },
      {
        path: 'approved',
        loadComponent: () => import('./posts/approved-posts/approved-posts.component').then(m => m.ApprovedPostsComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./posts/post-detail/post-detail.component').then(m => m.PostDetailComponent)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'posts',
        loadComponent: () => import('./admin/all-posts/all-posts.component').then(m => m.AllPostsComponent)
      },
      {
        path: 'pending',
        loadComponent: () => import('./admin/pending-posts/pending-posts.component').then(m => m.PendingPostsComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
