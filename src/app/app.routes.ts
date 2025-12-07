import { Routes } from '@angular/router';
// Routes configuration
import { MainLayoutComponent } from './core/layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { StudentListComponent } from './features/student/student-list/student-list.component';
import { StudentDetailComponent } from './features/student/student-detail/student-detail.component';
import { CourseListComponent } from './features/course/course-list/course-list.component';
import { CourseFormComponent } from './features/course/course-form/course-form.component';
import { EnrollmentListComponent } from './features/enrollment/enrollment-list/enrollment-list.component';
import { EnrollmentFormComponent } from './features/enrollment/enrollment-form/enrollment-form.component';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'students', component: StudentListComponent },
            { path: 'students/:id', component: StudentDetailComponent },
            { path: 'courses', component: CourseListComponent },
            { path: 'courses/new', component: CourseFormComponent },
            { path: 'enrollments', component: EnrollmentListComponent },
            { path: 'enrollments/new', component: EnrollmentFormComponent },
            { path: 'library', loadComponent: () => import('./features/library/library.component').then(m => m.LibraryComponent) },
            { path: 'infrastructure', loadComponent: () => import('./features/infrastructure/infrastructure.component').then(m => m.InfrastructureComponent) },
            { path: 'payments', loadComponent: () => import('./features/payment/payment.component').then(m => m.PaymentComponent) },
            { path: 'payment-gateway', loadComponent: () => import('./features/payment/payment-gateway/payment-gateway.component').then(m => m.PaymentGatewayComponent) },
        ]
    }
];
