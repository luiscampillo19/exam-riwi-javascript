import { auth } from '../services/auth.js';
import { router } from '../services/router.js';

export function renderRegister() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-logo">
                    <div class="logo-container">
                        <img src="/assets/logo.svg" alt="Task Manager Logo">
                    </div>
                </div>
                
                <h1 class="auth-title">Create account</h1>
                <p class="auth-subtitle">Join the academic performance platform today</p>
                
                <form id="registerForm">
                    <div class="form-group">
                        <label for="name" class="form-label">Full Name</label>
                        <input 
                            type="text" 
                            class="form-control" 
                            id="name" 
                            placeholder="John Doe"
                            required
                        >
                    </div>
                    
                    <div class="form-group">
                        <label for="email" class="form-label">Email address</label>
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
                            placeholder="Create a password"
                            required
                            minlength="6"
                        >
                    </div>
                    
                    <div class="form-group">
                        <label for="confirmPassword" class="form-label">Confirm Password</label>
                        <input 
                            type="password" 
                            class="form-control" 
                            id="confirmPassword" 
                            placeholder="Confirm password"
                            required
                        >
                    </div>
                    
                    <div id="errorMessage" class="alert alert-danger d-none"></div>
                    
                    <button type="submit" class="btn btn-primary">
                        Register
                    </button>
                    
                    <div class="auth-link">
                        Already have an account? <a href="#" id="loginLink">Sign in</a>
                    </div>
                </form>
            </div>
        </div>
    `;

    const form = document.getElementById('registerForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorDiv = document.getElementById('errorMessage');
        
        if (password !== confirmPassword) {
            errorDiv.textContent = 'Las contraseñas no coinciden';
            errorDiv.classList.remove('d-none');
            return;
        }
        
        try {
            await auth.register(name, email, password);
            router.navigate('/user/dashboard');
        } catch (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('d-none');
        }
    });

    document.getElementById('loginLink').addEventListener('click', (e) => {
        e.preventDefault();
        router.navigate('/login');
    });
}
