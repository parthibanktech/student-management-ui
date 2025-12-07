export interface Enrollment {
    id?: number;
    studentId: number;
    studentName?: string;
    courseId: number;
    courseTitle?: string;
    enrollmentDate?: string;
    status?: 'ACTIVE' | 'COMPLETED' | 'DROPPED';
}

export interface EnrollmentRequest {
    studentId: number;
    courseId: number;
}
