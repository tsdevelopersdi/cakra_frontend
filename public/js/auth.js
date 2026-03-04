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
        // Call backend to clear httpOnly cookies server-side
        fetch(API_CONFIG.endpoints.login.replace('/auth/login', '/logout'), {
            method: 'DELETE',
            credentials: 'include',
        }).catch(() => { }); // fail silently, we still clear local state

        localStorage.removeItem('session_active');
        localStorage.removeItem('user');
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

        // strictly restrict 'user' role
        if (role === 'user') {
            const allowedPages = ['/invoice_upload', '/invoice_upload.html'];
            const isAllowed = allowedPages.some(page => path.endsWith(page));

            if (!isAllowed) {
                console.error(`Access Denied: Role 'user' is restricted from ${path}`);
                window.location.href = '/invoice_upload';
            }
        } else if (role) {
            // Non-user roles (Admin/Manager) should go to list_invoice instead of project dashboard
            const dashboardPages = ['/home', '/home.html', '/dashboard', '/'];
            const isDashboard = dashboardPages.some(page => path === page || path.endsWith(page));

            if (isDashboard) {
                window.location.href = '/list_invoice';
            }
        }
    },

    // 4. UI Restriction Helpers
    restrictInvoiceDetails(ui, status = null) {
        const role = this.getUserRole();

        // 1. Hide all buttons by default
        if (ui.rejectBtn) ui.rejectBtn.classList.add('d-none');
        if (ui.forwardBtn) ui.forwardBtn.classList.add('d-none');
        if (ui.updateBtn) ui.updateBtn.classList.add('d-none');
        if (ui.approveBtn) ui.approveBtn.classList.add('d-none');
        if (ui.closeBtn) ui.closeBtn.classList.add('d-none');

        // 2. Access Control Logic (Role + Status)
        if (role === 'admin' || role === 'super admin') {
            if (ui.rejectBtn) ui.rejectBtn.classList.remove('d-none');
            if (ui.forwardBtn) ui.forwardBtn.classList.remove('d-none');
            if (ui.updateBtn) ui.updateBtn.classList.remove('d-none');

            // Only show close button if invoice is already accepted
            if (ui.closeBtn && (status === 'accepted' || status === 'approved')) {
                ui.closeBtn.classList.remove('d-none');
            }
        } else if (role === 'manager') {
            // Only show approve button if status is 'on_forward'
            if (ui.approveBtn && status === 'on_forward') {
                ui.approveBtn.classList.remove('d-none');
            }

            if (ui.rejectBtn) ui.rejectBtn.classList.remove('d-none');

            // Only show close button if invoice is already accepted
            if (ui.closeBtn && (status === 'accepted' || status === 'approved')) {
                ui.closeBtn.classList.remove('d-none');
            }
        }
    }
};

// Auto-run session check on include
Auth.checkSession();

// Export to window
window.Auth = Auth;
