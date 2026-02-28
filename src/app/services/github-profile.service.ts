import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class GitHubProfileService {
  constructor(private readonly http: HttpClient) {}

  getProfile(username: string): Observable<GitHubProfile> {
    return this.http.get<GitHubProfile>(
      `https://api.github.com/users/${encodeURIComponent(username)}`
    );
  }
}

