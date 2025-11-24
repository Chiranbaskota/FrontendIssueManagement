import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post, CreatePostRequest, UpdateNoteRequest } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) {}

  createPost(request: CreatePostRequest): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, request);
  }

  submitPost(postId: number): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/posts/${postId}/submit`, {});
  }

  approvePost(postId: number, updateNote?: string): Observable<Post> {
    const body = updateNote ? { updateNote } : {};
    return this.http.put<Post>(`${this.apiUrl}/posts/${postId}/approve`, body);
  }

  rejectPost(postId: number, updateNote?: string): Observable<Post> {
    const body = updateNote ? { updateNote } : {};
    return this.http.put<Post>(`${this.apiUrl}/posts/${postId}/reject`, body);
  }

  closePost(postId: number, updateNote?: string): Observable<Post> {
    const body = updateNote ? { updateNote } : {};
    return this.http.put<Post>(`${this.apiUrl}/posts/${postId}/close`, body);
  }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`);
  }

  getApprovedPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts/approved`);
  }

  getUserPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/user/posts`);
  }

  getPostById(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${postId}`);
  }
}
