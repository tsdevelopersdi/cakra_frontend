function performLogout() {
    // 1. Clear Local Flag
    localStorage.removeItem('session_active');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // 2. Clear Session Cookies (Best Effort for client-side)
    document.cookie = 'refreshToken=; Max-Age=0; path=/;';

    // 3. Redirect
    window.location.href = '/login';
}

function checkSession() {
    const isLoginPage = window.location.pathname.includes('/login');
    if (isLoginPage) return;

    // We use localStorage because HttpOnly cookies (or cross-domain cookies) cannot be read by JS.
    const isLoggedIn = localStorage.getItem('session_active');

    if (!isLoggedIn) {
        console.log('No session marker found, redirecting to login.');
        performLogout();
        return;
    }

    // Role-based access control
    const userStr = localStorage.getItem('user');
    let user = {};
    try {
        user = JSON.parse(userStr) || {};
    } catch (e) { }

    // If the role is explicitly 'user', log them out immediately since this app is for HR only
    if (user.role === 'user') {
        console.warn('Access denied: User role is not authorized for this dashboard.');
        performLogout();
        return;
    }

    const isUserManagementPage = window.location.pathname.includes('/user_management');
    if (isUserManagementPage && user.role !== 'admin' && user.role !== 'super admin') {
        console.warn('Access denied: User is not an admin.');
        window.location.href = '/attendance_user';
    }
}

console.log(localStorage.getItem('user'));
// console.log(localStorage.getItem('role'));
// Run immediately
checkSession();

function renderLayout(activePage) {
    const userStr = localStorage.getItem('user');
    let user = {};
    try {
        user = JSON.parse(userStr) || {};
    } catch (e) { }
    const isAdmin = user.role === 'admin' || user.role === 'super admin';

    // 1. Inject Sidebar
    const sidebarHTML = `
    <nav id="sidebar">
        <div class="sidebar-header">
            <h3><img src="img/gmt.png" alt="Logo" class="me-2" style="max-width: 70px;"></h3>
        </div>

        <ul class="list-unstyled components">
            <li>
                <a href="/attendance_user" class="${activePage === 'attendance_user' ? 'active' : ''}">
                    <i class="fas fa-user"></i> Attendance User
                </a>
            </li>
            ${isAdmin ? `
            <li>
                <a href="/user_management" class="${activePage === 'user_management' ? 'active' : ''}">
                    <i class="fas fa-users"></i> User Management
                </a>
            </li>
            ` : ''}
        </ul>
    </nav>
    <!-- Overlay -->
    <div class="overlay"></div>
    `;

    document.getElementById('sidebar-container').innerHTML = sidebarHTML;

    // 2. Inject Navbar into the beginning of #content
    const navbarHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
        <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                <ul class="navbar-nav mb-2 mb-lg-0">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-user-circle fa-lg"></i> ${user.email || 'Admin User'} <span class="text-muted small ms-1">(${user.role || ''})</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="#" id="logoutLink">Logout</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `;

    // Prepend navbar to content
    const contentDiv = document.getElementById('content');
    contentDiv.insertAdjacentHTML('afterbegin', navbarHTML);



    // 3. Initialize Interactive Logic (Toggle, etc.)
    initializeLayoutInteractions();
}

function initializeLayoutInteractions() {
    const logoutLink = document.getElementById('logoutLink');

    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            performLogout();
        });
    }
}

/**
 * Dynamically loads jQuery and DataTables, then initializes the table.
 * @param {string} selector - CSS selector for the table (e.g., '#myTable')
 * @param {object} options - Optional DataTables configuration object
 */
async function initDataTable(selector, options = {}) {
    try {
        // 1. Load jQuery if not present
        if (!window.jQuery) {
            await loadScript('https://code.jquery.com/jquery-3.7.0.min.js');
        }

        // 2. Load DataTables CSS & JS (Bootstrap 5 Check)
        if (!$.fn.DataTable) {
            loadCSS('https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css');
            await loadScript('https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js');
            await loadScript('https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js');

            // Load DataTables Buttons extension for Excel export
            loadCSS('https://cdn.datatables.net/buttons/2.4.2/css/buttons.bootstrap5.min.css');
            await loadScript('https://cdn.datatables.net/buttons/2.4.2/js/dataTables.buttons.min.js');
            await loadScript('https://cdn.datatables.net/buttons/2.4.2/js/buttons.bootstrap5.min.js');
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
            await loadScript('https://cdn.datatables.net/buttons/2.4.2/js/buttons.html5.min.js');

            // Setup global AJAX error handling for 403 Forbidden
            $(document).ajaxError(function (event, jqXHR, ajaxSettings, thrownError) {
                if (jqXHR.status === 403) {
                    console.warn('Unauthorized (403) detected. Logging out.');
                    performLogout();
                }
            });
        }

        // 3. Initialize DataTable with merged options
        const defaultOptions = {
            responsive: true,
            language: {
                search: "_INPUT_",
                searchPlaceholder: "Search...",
            },
            lengthMenu: [5, 10, 25, 50],
            pageLength: 10
        };

        const finalOptions = { ...defaultOptions, ...options };

        // Deep merge language or other nested objects if necessary, 
        // but for now simple spread is enough for top-level overrides.
        // If user passes specific language overrides, we might want to manually merge.
        if (options.language) {
            finalOptions.language = { ...defaultOptions.language, ...options.language };
        }

        $(selector).DataTable(finalOptions);

    } catch (error) {
        console.error('Failed to initialize DataTable:', error);
    }
}

// Helper to load JS
function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Helper to load CSS
function loadCSS(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}
