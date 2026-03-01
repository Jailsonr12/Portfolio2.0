import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, timeout } from 'rxjs';

export interface GitHubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  company: string | null;
  location: string | null;
  blog: string | null;
  html_url: string;
  twitter_username: string | null;
  followers: number;
  following: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  homepage: string | null;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class GitHubProfileService {
  constructor(private readonly http: HttpClient) {}

  getProfile(username: string): Observable<GitHubProfile> {
    return this.http.get<GitHubProfile>(
      `https://api.github.com/users/${encodeURIComponent(username)}`
    ).pipe(timeout(5000));
  }

  getRepos(username: string): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=12`
    ).pipe(timeout(5000));
  }
}
