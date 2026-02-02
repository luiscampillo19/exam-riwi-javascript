import { auth } from './auth.js';
import { renderLogin } from '../views/login.js';
import { renderRegister } from '../views/register.js';
import { renderUserDashboard } from '../views/userDashboard.js';
import { renderUserProfile } from '../views/userProfile.js';
import { renderAdminProfile } from '../views/adminProfile.js';
import { renderAdminDashboard } from '../views/adminDashboard.js';

export const router = {
    routes: {
        '/': renderLogin,
        '/login': renderLogin,
        '/register': renderRegister,
        '/user/dashboard': renderUserDashboard,
        '/user/profile': renderUserProfile,
        "/admin/profile": renderAdminProfile,
        '/admin/dashboard': renderAdminDashboard
    },

    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    },

    handleRoute() {
        const path = window.location.pathname;
        const session = auth.getSession();

        if (path === '/' || path === '/login' || path === '/register') {
            if (session) {
                if (session.role === 'admin') {
                    if (path !== '/admin/dashboard') {
                        return this.navigate('/admin/dashboard');
                    }
                } else {
                    if (path !== '/user/dashboard') {
                        return this.navigate('/user/dashboard');
                    }
                }
            }
            const render = this.routes[path] || this.routes['/'];
            render();
            return;
        }

        if (!session) {
            return this.navigate('/login');
        }

        if (path.startsWith('/admin/')) {
            if (session.role !== 'admin') {
                return this.navigate('/user/dashboard');
            }
        } else if (path.startsWith('/user/')) {
            if (session.role !== 'user') {
                return this.navigate('/admin/dashboard');
            }
        }

        const render = this.routes[path];
        if (render) {
            render();
        } else {
            this.navigate('/');
        }
    },

    init() {
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });
        this.handleRoute();
    }
};
