/**
 * API Configuration
 * Centralize all API routes here for easy management and dynamic updates.
 */

// const API_BASE_URL = 'http://10.10.28.121:3737';
// const API_BASE_URL = 'http://10.28.24.135:3737';
const API_BASE_URL = 'http://localhost:16753';
const N8N_URL = 'https://flow.ts-ai.solusidaya.id/webhook/cb75c3a7-b203-42ab-ad04-c87fce6a9e1a';
// const API_BASE_URL = 'http://10.28.24.173:3737';
// const API_PHOTOS = 'http://10.28.20.62:1998';
const API_PHOTOS = 'http://10.28.20.62:3737';
const N8N_URL_PRICE_FINDER = 'https://flow.ts-ai.solusidaya.id/webhook/789fae4f-caf6-41ef-8a8c-fec67aad393f';
const N8N_URL_BOX_FINDER = 'https://flow.ts-ai.solusidaya.id/webhook/296f85dc-5363-4ada-acd3-6aaa1a9d84ca';
const N8N_URL_INVOICE = 'https://flow.ts-ai.solusidaya.id/webhook/6c4cee07-3dd6-4b7c-976e-30371e904733'; // Placeholder

const API_CONFIG = {
    baseUrl: API_BASE_URL,
    endpoints: {
        login: `${API_BASE_URL}/login`,
        recentAttendance: `${API_BASE_URL}/recent`,
        userAttendance: `${API_BASE_URL}/user-attendance`,
        photos: `${API_PHOTOS}/photos`,
        users: `${API_BASE_URL}/users`,
        registeruser: `${API_BASE_URL}/register`,
        saveSld: `${API_BASE_URL}/save-sld`,
        listDrafts: `${API_BASE_URL}/list-draft`,
        projects: `${API_BASE_URL}/projects`, // GET for list, POST for create
        update_sld: `${API_BASE_URL}/update-sld`,
        pricelist: `${API_BASE_URL}/pricelist`,
        boxlist: `${API_BASE_URL}/box-list`,
        saveBox: `${API_BASE_URL}/save-box`,
        saveInvoice: `${API_BASE_URL}/save-invoice`,
        draftPenawaran: `${API_BASE_URL}/draft-penawaran`,
        invoiceList: `${API_BASE_URL}/listinvoice`,
        invoiceDetail: `${API_BASE_URL}/invoice-detail`,
        invoiceDetailImage: `${API_BASE_URL}/invoice-detail-image`,
        dashboardInvoice: `${API_BASE_URL}/invoice-summary`,
        updateInvoiceStatus: `${API_BASE_URL}/update-invoice-status`,
        // n8nPriceFinder: `${API_BASE_URL}/n8n-price-finder`,
    },
    // Helper to get photo URL
    getPhotoUrl: (photoName) => `${API_PHOTOS}/photos/${photoName}`
};

// Make it globally accessible
window.API_CONFIG = API_CONFIG;
