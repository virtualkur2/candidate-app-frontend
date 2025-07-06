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
  candidates: unknown[] = [];
  displayedColumns: string[] = [
    'name', 'surname', 'seniority', 'years', 'availability'
  ];
  

  constructor(
    private readonly fb: FormBuilder,
    private readonly snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
      this.candidateForm = this.fb.group({
        name: ['', Validators.required],
        surname: ['', Validators.required],
        excelFile: [null, Validators.required],
      });
  }

  ngOnDestroy(): void {
      // on destroy component
  }

  onFileSelected(event: Event): void {}

  onSubmit(): void {}
}
