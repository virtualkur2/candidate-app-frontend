import { Routes } from '@angular/router';
import { CandidateForm } from './candidate-form/candidate-form';

export const routes: Routes = [
    { path: '', redirectTo: '/candidates', pathMatch: 'full'},
    { path: 'candidates', component: CandidateForm },
];
