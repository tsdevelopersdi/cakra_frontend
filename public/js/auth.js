/**
 * Auth Utility
 * Centralized Role-Based Access Control and Session Management
 */

const Auth = {
    // 1. Session Management
    checkSession() {
        const isLoginPage = window.location.pathname.includes('/login');
        if (isLoginPage) return;

        const isLoggedIn = localStorage.getItem('session_active');
        if (!isLoggedIn) {
            console.warn('No session active. Redirecting to login.');
            this.logout();
            return;
        }

        // Apply access restriction immediately after session check
        this.checkAccess();
    },

    logout() {
        localStorage.removeItem('session_active');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        document.cookie = 'refreshToken=; Max-Age=0; path=/;';
        window.location.href = '/login';
    },

    // 2. Role and User Helpers
    getUser() {
        try {
            return JSON.parse(localStorage.getItem('user')) || {};
        } catch (e) {
            return {};
        }
    },

    getUserRole() {
        const user = this.getUser();
        return user.role ? user.role.toLowerCase() : '';
    },

    // 3. Access Control
    checkAccess() {
        const path = window.location.pathname;
        const role = this.getUserRole();

        // Strictly restrict 'user' role
        if (role === 'user') {
            const allowedPages = ['/invoice_upload', '/invoice_upload.html'];
            const isAllowed = allowedPages.some(page => path.endsWith(page));

            if (!isAllowed) {
                console.error(`Access Denied: Role 'user' is restricted from ${path}`);
                window.location.href = '/invoice_upload';
            }
        }
    },

    // 4. UI Restriction Helpers
    restrictInvoiceDetails(ui) {
        const role = this.getUserRole();

        // Hide all buttons by default (assumes they have d-none or similar)
        if (ui.rejectBtn) ui.rejectBtn.classList.add('d-none');
        if (ui.forwardBtn) ui.forwardBtn.classList.add('d-none');
        if (ui.updateBtn) ui.updateBtn.classList.add('d-none');
        if (ui.approveBtn) ui.approveBtn.classList.add('d-none');

        if (role === 'admin' || role === 'super admin') {
            if (ui.rejectBtn) ui.rejectBtn.classList.remove('d-none');
            if (ui.forwardBtn) ui.forwardBtn.classList.remove('d-none');
            if (ui.updateBtn) ui.updateBtn.classList.remove('d-none');
        } else if (role === 'manager') {
            if (ui.approveBtn) ui.approveBtn.classList.remove('d-none');
            if (ui.rejectBtn) ui.rejectBtn.classList.remove('d-none');
        }
    }
};

// Auto-run session check on include
Auth.checkSession();

// Export to window
window.Auth = Auth;
