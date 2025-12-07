
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/course.service';
import { EnrollmentService } from '../../services/enrollment.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#f4f4f4] p-6 lg:p-8">
      <!-- Header -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-light text-[#161616]">Dashboard</h1>
          <p class="text-[#525252] text-sm mt-1">System performance overview</p>
        </div>
        <div class="flex gap-3">
          <button (click)="generateReport()" class="bg-[#0f62fe] text-white px-4 py-2 text-sm font-medium hover:bg-[#0353e9] transition-colors flex items-center gap-2">
            Generate Report
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Stat Card 1 -->
        <div class="bg-white p-5 border border-[#e0e0e0] shadow-sm relative overflow-hidden group hover:border-[#0f62fe] transition-colors">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-xs font-semibold text-[#525252] uppercase tracking-wider">Total Students</p>
              <h3 class="text-3xl font-light text-[#161616] mt-1">{{ totalStudents() }}</h3>
            </div>
            <div class="p-2 bg-blue-50 text-[#0f62fe] rounded-lg">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
          </div>
          <div class="flex items-center text-xs">
            <span class="text-[#525252]">Active in system</span>
          </div>
        </div>

        <!-- Stat Card 2 -->
        <div class="bg-white p-5 border border-[#e0e0e0] shadow-sm relative overflow-hidden group hover:border-[#8a3ffc] transition-colors">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-xs font-semibold text-[#525252] uppercase tracking-wider">Active Courses</p>
              <h3 class="text-3xl font-light text-[#161616] mt-1">{{ totalCourses() }}</h3>
            </div>
            <div class="p-2 bg-purple-50 text-[#8a3ffc] rounded-lg">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
          </div>
          <div class="flex items-center text-xs">
            <span class="text-[#525252] bg-[#f4f4f4] px-1.5 py-0.5 rounded">
              Updated just now
            </span>
          </div>
        </div>

        <!-- Stat Card 3 -->
        <div class="bg-white p-5 border border-[#e0e0e0] shadow-sm relative overflow-hidden group hover:border-[#009d9a] transition-colors">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-xs font-semibold text-[#525252] uppercase tracking-wider">Enrollments</p>
              <h3 class="text-3xl font-light text-[#161616] mt-1">{{ totalEnrollments() }}</h3>
            </div>
            <div class="p-2 bg-teal-50 text-[#009d9a] rounded-lg">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div class="flex items-center text-xs">
             <span class="text-[#525252]">Active enrollments</span>
          </div>
        </div>

        <!-- Stat Card 4 -->
        <div class="bg-white p-5 border border-[#e0e0e0] shadow-sm relative overflow-hidden group hover:border-[#da1e28] transition-colors">
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-xs font-semibold text-[#525252] uppercase tracking-wider">Revenue</p>
              <h3 class="text-3xl font-light text-[#161616] mt-1">\${{ totalRevenue() }}</h3>
            </div>
            <div class="p-2 bg-red-50 text-[#da1e28] rounded-lg">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div class="flex items-center text-xs">
            <span class="text-[#525252] bg-[#f4f4f4] px-1.5 py-0.5 rounded">
              Estimated Revenue
            </span>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Enrollments -->
        <div class="lg:col-span-2 bg-white border border-[#e0e0e0] shadow-sm">
          <div class="px-5 py-4 border-b border-[#e0e0e0] flex justify-between items-center bg-[#f4f4f4]">
            <h4 class="text-sm font-bold text-[#161616] uppercase tracking-wide">Recent Enrollments</h4>
            <button class="text-[#0f62fe] text-xs font-medium hover:underline">View All</button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-white border-b border-[#e0e0e0]">
                  <th class="px-5 py-3 text-xs font-semibold text-[#525252] uppercase">ID</th>
                  <th class="px-5 py-3 text-xs font-semibold text-[#525252] uppercase">Student</th>
                   <th class="px-5 py-3 text-xs font-semibold text-[#525252] uppercase">Course</th>
                  <th class="px-5 py-3 text-xs font-semibold text-[#525252] uppercase">Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#e0e0e0]">
                 <tr *ngFor="let item of recentEnrollments()" class="hover:bg-[#e8f0fe] transition-colors">
                   <td class="px-5 py-3 text-sm text-[#161616]">{{item.id}}</td>
                   <td class="px-5 py-3 text-sm text-[#525252]">
                     {{ item.studentName || getStudentName(item.studentId) }}
                   </td>
                    <td class="px-5 py-3 text-sm text-[#525252]">
                     {{ item.courseTitle || getCourseTitle(item.courseId) }}
                    </td>
                   <td class="px-5 py-3 text-sm text-[#525252]">{{item.enrollmentDate | date:'mediumDate'}}</td>
                 </tr>
                 <tr *ngIf="recentEnrollments().length === 0">
                    <td colspan="4" class="px-5 py-8 text-center text-sm text-[#525252]">
                        No enrollments found.
                    </td>
                 </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- System Activity -->
        <div class="bg-white border border-[#e0e0e0] shadow-sm">
          <div class="px-5 py-4 border-b border-[#e0e0e0] bg-[#f4f4f4]">
             <h4 class="text-sm font-bold text-[#161616] uppercase tracking-wide">Activity Feed</h4>
          </div>
          <div class="p-5">
            <div class="relative pl-4 border-l border-[#e0e0e0] space-y-6">
              <div class="relative">
                <div class="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#0f62fe] border-2 border-white"></div>
                <p class="text-sm font-medium text-[#161616]">System Started</p>
                <p class="text-xs text-[#525252] mt-0.5">Microservices active</p>
                <span class="text-[10px] text-[#525252] mt-1 block">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  private studentService = inject(StudentService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);

  totalStudents = computed(() => this.studentService.students().length);
  totalCourses = computed(() => this.courseService.courses().length);
  totalEnrollments = computed(() => this.enrollmentService.enrollments().length);
  totalRevenue = computed(() => this.enrollmentService.enrollments().length * 99); // $99 per course assumption

  recentEnrollments = computed(() => this.enrollmentService.enrollments().slice(0, 5));

  constructor() {
    // Trigger loads logic
  }

  getStudentName(id: number): string {
    const student = this.studentService.students().find(s => s.id === id);
    return student ? student.name : 'Unknown Student';
  }

  getCourseTitle(id: number): string {
    const course = this.courseService.courses().find(c => c.id === id);
    return course ? course.title : 'Unknown Course';
  }

  generateReport() {
    const students = this.totalStudents();
    const courses = this.totalCourses();
    const enrollments = this.totalEnrollments();
    const revenue = this.totalRevenue();

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Parthiban Institute SMS Report\n";
    csvContent += `Generated On,${new Date().toLocaleString()}\n\n`;

    csvContent += "System Summary\n";
    csvContent += `Total Students,${students}\n`;
    csvContent += `Active Courses,${courses}\n`;
    csvContent += `Total Enrollments,${enrollments}\n`;
    csvContent += `Estimated Revenue,$${revenue}\n\n`;

    csvContent += "Recent Activity (Top 5)\n";
    csvContent += "ID,Student,Course,Date\n";

    this.recentEnrollments().forEach(item => {
      const sName = this.getStudentName(item.studentId);
      const cTitle = this.getCourseTitle(item.courseId);
      csvContent += `${item.id},"${sName}","${cTitle}",${item.enrollmentDate}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sms_report_${new Date().getTime()}.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  }
}
