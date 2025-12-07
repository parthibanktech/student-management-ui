import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="antialiased bg-gray-50 dark:bg-gray-900 min-h-screen">
      <!-- Navbar -->
      <nav class="bg-[#161616] border-b border-gray-700 px-4 py-2.5 fixed left-0 right-0 top-0 z-50">
        <div class="flex flex-wrap justify-between items-center relative">
          
          <!-- Left: Mobile Menu & Mobile Brand -->
          <div class="flex justify-start items-center">
            <button (click)="toggleSidebar()" class="p-2 mr-2 text-gray-400 hover:text-white rounded-lg cursor-pointer md:hidden hover:bg-gray-700 focus:bg-gray-700 focus:ring-2 focus:ring-gray-700">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
            </button>
            <span class="flex items-center text-xl font-semibold whitespace-nowrap text-white md:hidden">
              <span class="text-[#3395ff] font-bold mr-2">EduSphere</span>
            </span>
          </div>

          <!-- Center: Desktop Brand (Centered) -->
          <div class="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center">
             <span class="text-xl md:text-2xl font-bold whitespace-nowrap text-white tracking-tight">
              Parthiban <span class="text-[#3395ff]">EduSphere</span>
            </span>
          </div>

          <!-- Right: User Profile -->
          <div class="flex items-center lg:order-2 gap-3">
            <div class="flex items-center gap-2 text-gray-200 bg-[#2a2a2a] px-4 py-1.5 rounded-full text-sm border border-gray-700 shadow-sm">
               <div class="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">A</div>
               <span class="font-medium hidden sm:block tracking-wide">Admin</span>
            </div>
            <button (click)="logout()" class="group flex items-center gap-2 text-xs font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-4 py-2 rounded-full transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#161616]">
                <span>Sign Out</span>
                <svg class="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </nav>

      <!-- Sidebar -->
      <aside 
        class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform bg-[#262626] border-r border-[#393939] sm:translate-x-0"
        [class.-translate-x-full]="!isSidebarOpen"
        [class.translate-x-0]="isSidebarOpen">
        <div class="overflow-y-auto py-5 px-3 h-full bg-[#262626]">
          <ul class="space-y-2">
            <li>
              <a routerLink="/dashboard" routerLinkActive="bg-[#393939] border-l-4 border-[#0f62fe]" 
              class="flex items-center p-2 text-base font-normal text-gray-300 hover:text-white hover:bg-[#393939] group border-l-4 border-transparent transition-all">
                <svg class="w-6 h-6 text-gray-400 group-hover:text-white transition duration-75" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                <span class="ml-3">Dashboard</span>
              </a>
            </li>
            <li>
              <a routerLink="/students" routerLinkActive="bg-[#393939] border-l-4 border-[#0f62fe]" 
              class="flex items-center p-2 text-base font-normal text-gray-300 hover:text-white hover:bg-[#393939] group border-l-4 border-transparent transition-all">
                <svg class="w-6 h-6 text-gray-400 group-hover:text-white transition duration-75" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                <span class="ml-3">Students</span>
              </a>
            </li>
            <li>
              <a routerLink="/courses" routerLinkActive="bg-[#393939] border-l-4 border-[#0f62fe]" 
              class="flex items-center p-2 text-base font-normal text-gray-300 hover:text-white hover:bg-[#393939] group border-l-4 border-transparent transition-all">
                <svg class="w-6 h-6 text-gray-400 group-hover:text-white transition duration-75" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2 .712V17a1 1 0 001 1z"></path></svg>
                <span class="ml-3">Courses</span>
              </a>
            </li>
            <li>
              <a routerLink="/enrollments" routerLinkActive="bg-[#393939] border-l-4 border-[#0f62fe]" 
              class="flex items-center p-2 text-base font-normal text-gray-300 hover:text-white hover:bg-[#393939] group border-l-4 border-transparent transition-all">
                <svg class="w-6 h-6 text-gray-400 group-hover:text-white transition duration-75" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path></svg>
                <span class="ml-3">Enrollments</span>
              </a>
            </li>
            <!-- New Links: Library, Infrastructure, Payment -->
             <li>
              <a routerLink="/library" routerLinkActive="bg-[#393939] border-l-4 border-[#0f62fe]" 
              class="flex items-center p-2 text-base font-normal text-gray-300 hover:text-white hover:bg-[#393939] group border-l-4 border-transparent transition-all">
                <svg class="w-6 h-6 text-gray-400 group-hover:text-white transition duration-75" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                <span class="ml-3">Library</span>
              </a>
            </li>
             <li>
              <a routerLink="/infrastructure" routerLinkActive="bg-[#393939] border-l-4 border-[#0f62fe]" 
              class="flex items-center p-2 text-base font-normal text-gray-300 hover:text-white hover:bg-[#393939] group border-l-4 border-transparent transition-all">
                <svg class="w-6 h-6 text-gray-400 group-hover:text-white transition duration-75" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <span class="ml-3">Infrastructure</span>
              </a>
            </li>
             <li>
              <a routerLink="/payments" routerLinkActive="bg-[#393939] border-l-4 border-[#0f62fe]" 
              class="flex items-center p-2 text-base font-normal text-gray-300 hover:text-white hover:bg-[#393939] group border-l-4 border-transparent transition-all">
                <svg class="w-6 h-6 text-gray-400 group-hover:text-white transition duration-75" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                <span class="ml-3">Payments</span>
              </a>
            </li>
          </ul>
           <div class="mt-auto pt-6 border-t border-[#393939] md:hidden">
              <button (click)="logout()" class="w-full flex items-center p-2 text-base font-normal text-[#fa4d56] hover:bg-[#393939] transition-colors rounded-lg">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  <span class="ml-3">Sign Out</span>
              </button>
           </div>
        </div>
      </aside>

      <!-- Overlay (Mobile Only) -->
      <div *ngIf="isSidebarOpen" (click)="toggleSidebar()" 
          class="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 md:hidden backdrop-blur-sm transition-opacity">
      </div>

      <!-- Main Content -->
      <main class="p-4 md:ml-64 h-auto pt-20">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class MainLayoutComponent {
  isSidebarOpen = true;

  constructor(private authService: AuthService) { }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout();
  }
}
