import { auth } from '../services/auth.js';
import { router } from '../services/router.js';

export function renderLogin() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-logo">
                    <div class="logo-container">
                        <img src="/assets/logo.svg" alt="Task Manager Logo">
                    </div>
                </div>
                
                <h1 class="auth-title">Welcome back</h1>
                <p class="auth-subtitle">Enter your credentials to access the platform</p>
                
                <form id="loginForm">
                    <div class="form-group">
                        <label for="email" class="form-label">Email or username</label>
                        <input 
                            type="email" 
                            class="form-control" 
                            id="email" 
                            placeholder="student@university.edu"
                            required
                        >
                    </div>
                    
                    <div class="form-group">
                        <label for="password" class="form-label">Password</label>
                        <input 
                            type="password" 
                            class="form-control" 
                            id="password" 
                            placeholder="********"
                            required
                        >
                    </div>
                    
                    <div class="forgot-password">
                        <a href="#">Forgot password?</a>
                    </div>
                    
                    <div id="errorMessage" class="alert alert-danger d-none"></div>
                    
                    <button type="submit" class="btn btn-primary">
                        Sign in
                    </button>
                    
                    <div class="auth-link">
                        Don't have an account? <a href="#" id="registerLink">Register</a>
                    </div>
                </form>
                
            </div>
        </div>
    `;

    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('errorMessage');
        
        try {
            const session = await auth.login(email, password);
            
            if (session.role === 'admin') {
                router.navigate('/admin/dashboard');
            } else {
                router.navigate('/user/dashboard');
            }
        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('d-none');
        }
    });

    document.getElementById('registerLink').addEventListener('click', (e) => {
        e.preventDefault();
        router.navigate('/register');
    });
}
