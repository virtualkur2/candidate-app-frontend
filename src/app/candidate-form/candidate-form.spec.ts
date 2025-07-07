import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { CandidateForm } from './candidate-form';
import { CandidateService } from '../services/candidate';

const mockCandidateService = {
  getPersistedCandidates: jest.fn(() => []),
  uploadCandidate: jest.fn(() => of({ name: 'John', surname: 'Doe', seniority: 'junior', years: 1, availability: true })),
  newCandidate$: of(null),
  persistCandidates: jest.fn(),
};

const mockSnackBar = {
  open: jest.fn(),
};

describe('CandidateForm', () => {
  let component: CandidateForm;
  let fixture: ComponentFixture<CandidateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateForm, ReactiveFormsModule],
      providers: [
        { provide: CandidateService, useValue: mockCandidateService },
        { provide: MatSnackBar, useValue: mockSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CandidateForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.candidateForm.valid).toBeFalsy();
  });

  it('should validate required fields', () => {
    const form = component.candidateForm;
    form.get('name')?.setValue('');
    form.get('surname')?.setValue('');
    form.get('excelFile')?.setValue(null);
    expect(form.valid).toBeFalsy();
    form.get('name')?.setValue('John');
    form.get('surname')?.setValue('Doe');
    form.get('excelFile')?.setValue(new File([''], 'test.xlsx'));
    expect(form.valid).toBeTruthy();
  });

  it('should patch file on file selection', () => {
    const file = new File([''], 'test.xlsx');
    const event = { currentTarget: { files: [file] } } as unknown as Event;
    component.onFileSelected(event);
    expect(component.selectedFile).toBe(file);
    expect(component.candidateForm.get('excelFile')?.value).toBe(file);
  });

  it('should submit valid form and reset', () => {
    const form = component.candidateForm;
    const file = new File([''], 'test.xlsx');
    form.get('name')?.setValue('John');
    form.get('surname')?.setValue('Doe');
    component.selectedFile = file;
    form.get('excelFile')?.setValue(file);
    component.onSubmit();
    expect(mockCandidateService.uploadCandidate).toHaveBeenCalled();
  });
});
