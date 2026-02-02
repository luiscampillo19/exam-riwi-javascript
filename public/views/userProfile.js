import { auth } from '../services/auth.js';

export function renderUserProfile() {
    if (!auth.requireUser()) return;
    
    const session = auth.getSession();
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="app-container">
            <aside class="sidebar">
                <div class="sidebar-logo">
                    <img src="/assets/logo2.svg" >
                </div>
                <nav class="sidebar-nav">
                    <a class="nav-item" onclick="navigateTo('/user/dashboard')">
                        <i class="bi bi-grid"></i>
                        <span>Dashboard</span>
                    </a>
                    <a class="nav-item" onclick="navigateTo('/user/dashboard')">
                        <i class="bi bi-check2-square"></i>
                        <span>My Tasks</span>
                    </a>
                    <a class="nav-item active" onclick="navigateTo('/user/profile')">
                        <i class="bi bi-person"></i>
                        <span>Profile</span>
                    </a>
                </nav>
            </aside>

            <main class="main-content">
                <header class="page-header">
                    <div class="page-header-left">
                        <div class="breadcrumb">
                            <i class="bi bi-house-door"></i>
                            <span>›</span>
                            <span>Profile</span>
                        </div>
                        <h1 class="page-title">My Profile</h1>
                        <p class="page-subtitle">Manage your account information</p>
                    </div>
                    <div class="page-header-right">
                        <button class="btn-icon" onclick="window.logout()">
                            <i class="bi bi-box-arrow-right"></i>
                        </button>
                    </div>
                </header>

                <div style="max-width: 600px; margin: 0 auto;">
                    <div class="stat-card" style="text-align: center; padding: 48px;">
                        <div style="margin: 0 auto 24px; width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%); display: flex; align-items: center; justify-content: center; font-size: 48px; color: white; font-weight: 700;">
                            ${session.avatar}
                        </div>
                        
                        <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">${session.name}</h2>
                        <p style="font-size: 16px; color: var(--text-secondary); margin-bottom: 8px;">${session.jobTitle || 'User'}</p>
                        <p style="font-size: 14px; color: var(--text-light);">${session.email}</p>
                        
                        <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid var(--border-color); text-align: left;">
                            <div style="margin-bottom: 24px;">
                                <div style="font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Full Name</div>
                                <div style="font-size: 16px; color: var(--text-primary);">${session.name}</div>
                            </div>
                            
                            <div style="margin-bottom: 24px;">
                                <div style="font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Email Address</div>
                                <div style="font-size: 16px; color: var(--text-primary);">${session.email}</div>
                            </div>
                            
                            <div style="margin-bottom: 24px;">
                                <div style="font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Role</div>
                                <div style="font-size: 16px; color: var(--text-primary);">User</div>
                            </div>
                            
                            <div>
                                <div style="font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">User ID</div>
                                <div style="font-size: 16px; color: var(--text-primary);">#${session.id}</div>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary" onclick="window.logout()" style="margin-top: 32px; background: var(--priority-high);">
                            <i class="bi bi-box-arrow-right"></i>
                            Sign Out
                        </button>
                    </div>
                </div>
            </main>
        </div>
    `;

    window.logout = () => auth.logout();
}
