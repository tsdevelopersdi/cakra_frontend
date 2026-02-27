/**
 * Workspace Utility
 * Manages the active project context for the engineering modules.
 */

const Workspace = {
    STORAGE_KEY: 'cakra_active_project',

    // 1. Get current active project
    getActiveProject() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || null;
        } catch (e) {
            console.error('Error reading active project from localStorage:', e);
            return null;
        }
    },

    // 2. Set active project
    setActiveProject(project) {
        if (!project || !project.id) {
            console.error('Invalid project data provided to Workspace.setActiveProject');
            return;
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(project));
        console.log(`[Workspace] Active project set to: ${project.project_name} (ID: ${project.id})`);

        // Broadcast the change if needed (could use CustomEvent)
        window.dispatchEvent(new CustomEvent('workspaceChange', { detail: project }));
    },

    // 3. Clear active project (Reset Workspace)
    clearActiveProject() {
        localStorage.removeItem(this.STORAGE_KEY);
        console.log('[Workspace] Active project cleared.');
        window.dispatchEvent(new CustomEvent('workspaceChange', { detail: null }));
    },

    // 4. Helper to check if project is active
    hasActiveProject() {
        return !!this.getActiveProject();
    }
};

// Export to window
window.Workspace = Workspace;
