import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface Candidate {
  name: string;
  surname: string;
  seniority: 'junior' | 'senior';
  years: number;
  availability: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private readonly apiUrl = 'http://localhost:3000/candidates';
  private readonly candidatesKey = 'loadedCandidates';

  private readonly _newCandidate = new BehaviorSubject<Candidate | null>(null);
  readonly newCandidate$ = this._newCandidate.asObservable();

  constructor(
    private readonly http: HttpClient,
  ) { }

  uploadCandidate(formData: FormData): Observable<Candidate> {
    return this.http.post<Candidate>(this.apiUrl, formData).pipe(
      tap((candidate: Candidate) => {
        this._newCandidate.next(candidate);
      })
    )
  }

  getPersistedCandidates(): Candidate[] {
    const persistedData = localStorage.getItem(this.candidatesKey);
    return persistedData ? JSON.parse(persistedData) : [];
  }

  persistCandidates(candidates: Candidate[]): void {
    localStorage.setItem(this.candidatesKey, JSON.stringify(candidates));
  }

  clearPersistedCandidates(): void {
    localStorage.removeItem(this.candidatesKey);
  }
}
