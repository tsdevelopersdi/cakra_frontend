/**
 * Workspace Utility
 * Manages the active project context for the engineering modules.
 */
const Workspace = {
    STORAGE_KEY: 'cakra_active_project',
    getActiveProject() {
        try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || null; }
        catch (e) { return null; }
    },
    setActiveProject(project) {
        if (!project) return;
        const id = project.id || project.ID;
        if (!id) {
            console.error('Invalid project data (missing ID) provided to Workspace.setActiveProject:', project);
            return;
        }
        // Normalize to 'id' for storage consistency
        const normalizedProject = { ...project, id: id };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(normalizedProject));
        window.dispatchEvent(new CustomEvent('workspaceChange', { detail: normalizedProject }));
    },
    clearActiveProject() {
        localStorage.removeItem(this.STORAGE_KEY);
        window.dispatchEvent(new CustomEvent('workspaceChange', { detail: null }));
    },
    hasActiveProject() { return !!this.getActiveProject(); }
};
window.Workspace = Workspace;

// Run session check immediately on every page that includes layout.js
Auth.checkSession();

function renderLayout(activePage) {
    // Set static title and favicon
    document.title = "ESTIMACORE";

    // Inject or update favicon
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
    }
    favicon.href = 'img/estimacore.png';

    const user = Auth.getUser();
    const role = Auth.getUserRole();

    // 1. Inject Sidebar
    let sidebarItems = '';

    if (role === 'user') {
        sidebarItems = `
            <div class="sidebar-section-label">Finance</div>
            <li>
                <a href="#invoiceSubmenu" data-bs-toggle="collapse" aria-expanded="${['invoice_upload', 'list_invoice'].includes(activePage) ? 'true' : 'false'}" class="dropdown-toggle ${['invoice_upload', 'list_invoice'].includes(activePage) ? '' : 'collapsed'}">
                    <i class="fas fa-file-invoice-dollar"></i> <span>Struck</span>
                </a>
                <ul class="collapse list-unstyled ${['invoice_upload', 'list_invoice'].includes(activePage) ? 'show' : ''}" id="invoiceSubmenu">
                    <li>
                        <a href="/invoice_upload" class="${activePage === 'invoice_upload' ? 'active' : ''}">
                             <i class="fas fa-upload me-2" style="font-size: 0.8rem;"></i> Upload
                        </a>
                    </li>
                </ul>
            </li>
        `;
    } else {
        // Admin/Manager/Others see everything
        sidebarItems = `
            <div class="sidebar-section-label">Engineering (PM)</div>
            <li>
                <a href="/list_draft" class="${activePage === 'list_draft' ? 'active' : ''}">
                    <i class="fas fa-list"></i> <span>Draft SLD</span>
                </a>
            </li>

            <div class="sidebar-section-label">Engineering (Tools)</div>
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
                    <i class="fas fa-file-invoice"></i> <span>Bill of Quantity</span>
                </a>
            </li>

            <div class="sidebar-section-label">Engineering (Database)</div>
            <li>
                <a href="/pricelist" class="${activePage === 'pricelist' ? 'active' : ''}">
                    <i class="fas fa-table"></i> <span>Pricelist</span>
                </a>
            </li>
            <li>
                <a href="/box_list" class="${activePage === 'box_list' ? 'active' : ''}">
                    <i class="fas fa-box"></i> <span>Boxes</span>
                </a>
            </li>

            <div class="sidebar-section-label">Finance</div>
            <li>
                <a href="#invoiceSubmenu" data-bs-toggle="collapse" aria-expanded="${['invoice_upload', 'list_invoice', 'invoice_detail'].includes(activePage) ? 'true' : 'false'}" class="dropdown-toggle ${['invoice_upload', 'list_invoice', 'invoice_detail'].includes(activePage) ? '' : 'collapsed'}">
                    <i class="fas fa-file-invoice-dollar"></i> <span>Struck</span>
                </a>
                <ul class="collapse list-unstyled ${['invoice_upload', 'list_invoice', 'invoice_detail'].includes(activePage) ? 'show' : ''}" id="invoiceSubmenu">
                    <li>
                        <a href="/invoice_upload" class="${activePage === 'invoice_upload' ? 'active' : ''}">
                             <i class="fas fa-upload me-2" style="font-size: 0.8rem;"></i> Upload
                        </a>
                    </li>
                    <li>
                        <a href="/list_invoice" class="${activePage === 'list_invoice' ? 'active' : ''}">
                             <i class="fas fa-list me-2" style="font-size: 0.8rem;"></i> List
                        </a>
                    </li>
                </ul>
            </li>
        `;
    }

    // 3. Workspace Context Indicator (NEW)
    const renderWorkspaceIndicator = (project) => {
        if (project) {
            return `<div class="active-workspace-indicator mt-auto mx-3 mb-3 p-3 rounded" style="background: rgba(255,0,60,0.1); border-left: 4px solid var(--neon-red);">
                <div class="small opacity-50 text-uppercase fw-bold" style="font-size: 0.65rem;">Active Workspace</div>
                <div class="fw-bold text-truncate" title="${project.project_name}">${project.project_name}</div>
                <div class="d-flex gap-2 mt-2">
                    <a href="/home" class="btn btn-xs btn-outline-danger py-0 px-2 font-monospace" style="font-size: 0.65rem;">
                        <i class="fas fa-exchange-alt me-1"></i> SWITCH
                    </a>
                    <button onclick="Workspace.clearActiveProject(); window.location.href='/home';" class="btn btn-xs btn-link text-muted p-0 border-0 text-decoration-none" style="font-size: 0.65rem;">
                        <i class="fas fa-times-circle me-1"></i> EXIT
                    </button>
                </div>
               </div>`;
        }
        return `<div class="active-workspace-indicator mt-auto mx-3 mb-3 p-3 rounded text-center" style="background: rgba(255,255,255,0.05); border: 1px dashed rgba(255,255,255,0.2);">
            <div class="small opacity-50 mb-2">No active project</div>
            <a href="/" class="btn btn-sm btn-outline-light w-100" style="font-size: 0.75rem;">SELECT PROJECT</a>
           </div>`;
    };

    const activeProject = Workspace.getActiveProject();
    const workspaceIndicatorHTML = `<div id="sidebar-workspace-indicator-container">${renderWorkspaceIndicator(activeProject)}</div>`;

    const sidebarHTML = `
    <nav id="sidebar" class="d-flex flex-column h-100">
        <div class="sidebar-header">
            <img src="img/estimacore.png" alt="Logo" class="sidebar-logo">
            <h3>ESTIMACORE</h3>
        </div>

        <ul class="list-unstyled components flex-grow-1">
            ${sidebarItems}
        </ul>

        ${workspaceIndicatorHTML}
    </nav>
    <!-- Overlay -->
    <div class="overlay"></div>
    `;

    document.getElementById('sidebar-container').innerHTML = sidebarHTML;

    // 4. Workspace Protection (NEW)

    const engineeringTools = ['price_finder', 'upload_sld', 'table_penawaran', 'BoQ'];
    const isEngineeringPage = engineeringTools.includes(activePage);

    if (isEngineeringPage && !activeProject) {
        console.warn(`[Workspace] Access to ${activePage} blocked: No active project.`);
        // Use a flag to prevent multiple alerts if renderLayout is called twice
        if (window._workspaceAlertActive) return;
        window._workspaceAlertActive = true;

        setTimeout(async () => {
            await showAlert('Workspace Required', 'Please select a project from the dashboard first.', 'warning');
            window._workspaceAlertActive = false;
            window.location.href = '/home'; // Explicitly go to /home instead of /
        }, 100);
    }

    // 5. Inject Navbar into the beginning of #content
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
                <ul class="navbar-nav mb-2 mb-lg-0 align-items-center">
                    <div id="navbar-project-context-container" class="d-flex align-items-center">
                        ${renderNavbarProjectBadge(activeProject)}
                    </div>
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

    // 6. Initialize Interactive Logic (Toggle, etc.)
    initializeLayoutInteractions();

    // Listen for Workspace Changes (Dynamic UI Sync)
    window.addEventListener('workspaceChange', function (e) {
        const newProject = e.detail;

        // Update Sidebar
        const sidebarContainer = document.getElementById('sidebar-workspace-indicator-container');
        if (sidebarContainer) {
            sidebarContainer.innerHTML = renderWorkspaceIndicator(newProject);
        }

        // Update Navbar
        const navbarContainer = document.getElementById('navbar-project-context-container');
        if (navbarContainer) {
            navbarContainer.innerHTML = renderNavbarProjectBadge(newProject);
        }
    });
}

// Helper for Navbar Project Badge
function renderNavbarProjectBadge(project) {
    if (!project) return '';
    return `
        <li class="nav-item me-2">
            <span class="text-muted d-none d-sm-inline small me-1">Project:</span>
            <span class="badge bg-dark border border-secondary fw-bold text-truncate" style="max-width: 120px;" title="${project.project_name}">${project.project_name}</span>
        </li>
    `;
}

function initializeLayoutInteractions() {
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            // Clear workspace too on logout
            if (window.Workspace) Workspace.clearActiveProject();
            Auth.logout();
        });
    }

    // Sidebar Toggle Logic
    const sidebarCollapse = document.getElementById('sidebarCollapse');
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const overlay = document.querySelector('.overlay');

    // 1. Check LocalStorage on init (Desktop only)
    if (window.innerWidth > 768) {
        const isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
            content.classList.add('collapsed');
        }
    }

    // 2. Toggle Event
    if (sidebarCollapse) {
        sidebarCollapse.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                // Mobile behavior
                sidebar.classList.toggle('active');
                if (overlay) overlay.classList.toggle('active');
            } else {
                // Desktop behavior
                sidebar.classList.toggle('collapsed');
                content.classList.toggle('collapsed');
                // Save state
                localStorage.setItem('sidebar_collapsed', sidebar.classList.contains('collapsed'));
            }
        });
    }

    // 3. Close sidebar on overlay click (Mobile)
    if (overlay) {
        overlay.addEventListener('click', function () {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
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
