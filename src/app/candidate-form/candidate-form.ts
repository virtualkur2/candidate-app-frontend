import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Candidate, CandidateService } from '../services/candidate';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-candidate-form',
  templateUrl: './candidate-form.html',
  styleUrl: './candidate-form.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTableModule,
    TitleCasePipe
  ]
})
export class CandidateForm implements OnInit, OnDestroy {
  candidateForm!: FormGroup;
  selectedFile: File | null = null;
  isLoading = false;
  candidates: Candidate[] = [];
  displayedColumns: string[] = [
    'name', 'surname', 'seniority', 'years', 'availability'
  ];
  private candidateSubscription!: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private readonly snackbar: MatSnackBar,
    private readonly candidateService: CandidateService,
  ) { }

  ngOnInit(): void {
      this.candidateForm = this.fb.group({
        name: ['', Validators.required],
        surname: ['', Validators.required],
        excelFile: [null, Validators.required],
      });

      this.candidates = this.candidateService.getPersistedCandidates();

      this.candidateSubscription = this.candidateService.newCandidate$.subscribe(
        (newCandidate: Candidate | null) => {
          if (newCandidate) {
            this.candidates = [...this.candidates, newCandidate];
            this.candidateService.persistCandidates(this.candidates);
          }
        }
      )

  }

  ngOnDestroy(): void {
      if (this.candidateSubscription) {
        this.candidateSubscription.unsubscribe();
      }
  }

  onFileSelected(event: Event): void {}

  onSubmit(): void {}
}
