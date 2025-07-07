import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { CandidateService, Candidate } from './candidate';

describe('CandidateService', () => {
  let service: CandidateService;
  let httpClientMock: { post: jest.Mock };
  const candidate: Candidate = { name: 'John', surname: 'Doe', seniority: 'junior', years: 1, availability: true };

  beforeEach(() => {
    httpClientMock = { post: jest.fn() };
    TestBed.configureTestingModule({
      providers: [
        CandidateService,
        { provide: HttpClient, useValue: httpClientMock },
      ],
    });
    service = TestBed.inject(CandidateService);

    // Mock localStorage
    let store: Record<string, string> = { 'loadedCandidates': JSON.stringify([candidate]) };
    const localStorageMock = {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
      removeItem: jest.fn((key: string) => { delete store[key]; }),
      clear: jest.fn(() => { store = {}; }),
    };
    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload candidate and emit newCandidate$', (done) => {
    httpClientMock.post.mockReturnValue(of(candidate));
    const sub = service.newCandidate$.subscribe((emitted) => {
      if (emitted) {
        expect(emitted).toEqual(candidate);
        sub.unsubscribe();
        done();
      }
    });
    service.uploadCandidate(new FormData()).subscribe((result) => {
      expect(result).toEqual(candidate);
    });
  });

  it('should handle upload error', (done) => {
    httpClientMock.post.mockReturnValue(throwError(() => new Error('fail')));
    service.uploadCandidate(new FormData()).subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      }
    });
  });

  it('should get persisted candidates from localStorage', () => {
    const result = service.getPersistedCandidates();
    expect(result).toEqual([candidate]);
    expect(localStorage.getItem).toHaveBeenCalledWith('loadedCandidates');
  });

  it('should persist candidates to localStorage', () => {
    service.persistCandidates([candidate]);
    expect(localStorage.setItem).toHaveBeenCalledWith('loadedCandidates', JSON.stringify([candidate]));
  });

  it('should clear persisted candidates from localStorage', () => {
    service.clearPersistedCandidates();
    expect(localStorage.removeItem).toHaveBeenCalledWith('loadedCandidates');
  });
});
