/**
 * API Configuration
 * Centralize all API routes here for easy management and dynamic updates.
 */

// const API_BASE_URL = 'http://10.10.28.121:3737';
const API_BASE_URL = 'http://10.28.24.135:3737';
// const API_BASE_URL = 'http://10.28.24.173:3737';
const API_PHOTOS = 'http://10.28.24.135:1998';

const API_CONFIG = {
    baseUrl: API_BASE_URL,
    endpoints: {
        login: `${API_BASE_URL}/login`,
        recentAttendance: `${API_BASE_URL}/recent`,
        userAttendance: `${API_BASE_URL}/user-attendance`,
        photos: `${API_PHOTOS}/photos`,
        users: `${API_BASE_URL}/users`,
        registeruser: `${API_BASE_URL}/register`,
    },
    // Helper to get photo URL
    getPhotoUrl: (photoName) => `${API_PHOTOS}/photos/${photoName}`
};

// Make it globally accessible
window.API_CONFIG = API_CONFIG;
