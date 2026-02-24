// Run session check immediately on every page that includes layout.js
Auth.checkSession();

function renderLayout(activePage) {
    const user = Auth.getUser();
    const role = Auth.getUserRole();

    // 1. Inject Sidebar
    let sidebarItems = '';

    if (role === 'user') {
        // User role only sees Invoice Upload
        sidebarItems = `
            <li>
                <a href="/invoice_upload" class="${activePage === 'invoice_upload' ? 'active' : ''}">
                    <i class="fas fa-file-invoice-dollar"></i> <span>Invoice Upload</span>
                </a>
            </li>
        `;
    } else {
        // Admin/Manager/Others see everything
        sidebarItems = `
            <li>
                <a href="/list_project" class="${activePage === 'list_project' ? 'active' : ''}">
                    <i class="fas fa-person"></i> <span>List Project</span>
                </a>
            </li>
            <li>
                <a href="/list_draft" class="${activePage === 'list_draft' ? 'active' : ''}">
                    <i class="fas fa-list"></i> <span>List Draft SLD</span>
                </a>
            </li>
            <li>
                <a href="/price_finder" class="${activePage === 'price_finder' ? 'active' : ''}">
                    <i class="fas fa-dollar"></i> <span>Price Finder</span>
                </a>
            </li>
            <li>
                <a href="/upload_sld" class="${activePage === 'upload_sld' ? 'active' : ''}">
                    <i class="fas fa-file-export"></i> <span>Upload SLD</span>
                </a>
            </li>
            <li>
                <a href="/table_penawaran" class="${activePage === 'table_penawaran' ? 'active' : ''}">
                    <i class="fas fa-file-invoice"></i> <span>Table Penawaran</span>
                </a>
            </li>
            <li>
                <a href="/pricelist" class="${activePage === 'pricelist' ? 'active' : ''}">
                    <i class="fas fa-table"></i> <span>Pricelist</span>
                </a>
            </li>
            <li>
                <a href="/box_list" class="${activePage === 'box_list' ? 'active' : ''}">
                    <i class="fas fa-box"></i> <span>Box List</span>
                </a>
            </li>
            <li>
                <a href="/invoice_upload" class="${activePage === 'invoice_upload' ? 'active' : ''}">
                    <i class="fas fa-file-invoice-dollar"></i> <span>Invoice Upload</span>
                </a>
            </li>
            <li>
                <a href="/list_invoice" class="${activePage === 'list_invoice' ? 'active' : ''}">
                    <i class="fas fa-file-invoice"></i> <span>List Invoice</span>
                </a>
            </li>
        `;
    }

    const sidebarHTML = `
    <nav id="sidebar">
        <div class="sidebar-header">
            <h3>CAKRA AI</h3>
        </div>

        <ul class="list-unstyled components">
            ${sidebarItems}
        </ul>
    </nav>
    <!-- Overlay -->
    <div class="overlay"></div>
    `;

    document.getElementById('sidebar-container').innerHTML = sidebarHTML;

    // 2. Inject Navbar into the beginning of #content
    const navbarHTML = `
    <nav class="navbar navbar-expand-lg sticky-top">
        <div class="container-fluid">
            <button type="button" id="sidebarCollapse" class="btn btn-outline-danger me-3">
                <i class="fas fa-bars"></i>
            </button>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                <ul class="navbar-nav mb-2 mb-lg-0">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-user-shield fa-lg me-1"></i> ${user.email || 'Admin User'} <span class="badge bg-danger ms-1" style="font-size: 0.65rem;">${user.role || ''}</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item" href="#" id="logoutLink"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
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
            Auth.logout();
        });
    }

    // Sidebar Toggle Logic
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');

    // 1. Check LocalStorage on init
    const isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
        content.classList.add('collapsed');
    }

    // 2. Toggle Event
    if (sidebarCollapse) {
        sidebarCollapse.addEventListener('click', function () {
            sidebar.classList.toggle('collapsed');
            content.classList.toggle('collapsed');

            // Save state
            const currentState = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebar_collapsed', currentState);
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
                    Auth.logout();
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

// SweetAlert2 Helpers
async function ensureSwal() {
    if (window.Swal) return;
    try {
        await loadScript('https://cdn.jsdelivr.net/npm/sweetalert2@11');
    } catch (e) {
        console.error('Failed to load SweetAlert2:', e);
    }
}

async function showAlert(title, text, icon = 'info') {
    await ensureSwal();
    if (window.Swal) {
        return Swal.fire({ title, text, icon, confirmButtonColor: '#d33' });
    }
    alert(text || title);
}

async function showConfirm(title, text, confirmButtonText = 'Yes', icon = 'warning') {
    await ensureSwal();
    if (window.Swal) {
        const result = await Swal.fire({
            title,
            text,
            icon,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText
        });
        return result.isConfirmed;
    }
    return confirm(text || title);
}

async function showToast(title, icon = 'success') {
    await ensureSwal();
    if (window.Swal) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
        Toast.fire({ icon, title });
    }
}

// Export to window
window.showAlert = showAlert;
window.showConfirm = showConfirm;
window.showToast = showToast;
window.ensureSwal = ensureSwal;
