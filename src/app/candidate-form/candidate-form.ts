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

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    this.selectedFile = fileList?.length ? fileList[0] : null;
    this.candidateForm.patchValue({
      excelFile: this.selectedFile,
    });
    this.candidateForm.get('excelFile')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.candidateForm.valid && this.selectedFile) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('name', this.candidateForm.get('name')?.value);
      formData.append('surname', this.candidateForm.get('surname')?.value);
      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.candidateService.uploadCandidate(formData).subscribe({
        next: (_response) => {
          this.isLoading = false;
          this.snackbar.open('Candidate submitted successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.candidateForm.reset();
          this.selectedFile = null;
          if (document.querySelector('input[type="file"]')) {
            (document.querySelector('input[type="file"]') as HTMLInputElement).value = '';
          }
          Object.keys(this.candidateForm.controls).forEach(key => {
            this.candidateForm.get(key)?.setErrors(null);
          });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error submitting candidate:', error);
          const errorMessage = error.error?.message ?? 'Failed to submit candidate. Please try again.';
          this.snackbar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['snackbar-error'],
          });
        }
      })
    } else {
      this.candidateForm.markAllAsTouched();
      this.snackbar.open('Please fill in all required fields and upload an Excel file.', 'Close', {
        duration: 5000,
        panelClass: ['snackbar-warning'],
      });
    }
  }
}
