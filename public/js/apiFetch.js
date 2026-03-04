/**
 * apiFetch — Authenticated Fetch Wrapper
 *
 * Drop-in replacement for fetch() for all calls to our backend.
 * Automatically:
 *   1. Sends credentials (cookies) on every request
 *   2. If the server returns 401 (expired access token), calls GET /token
 *      to silently refresh the cookie, then retries the original request once
 *   3. If refresh also fails (refresh token expired), logs the user out
 */

async function apiFetch(url, options = {}) {
    // Always send cookies
    const opts = {
        ...options,
        credentials: 'include',
        headers: {
            ...(options.headers || {}),
        },
    };

    let response = await fetch(url, opts);

    // If the access token has expired, try to refresh it silently
    if (response.status === 401) {
        const refreshed = await _refreshAccessToken();

        if (refreshed) {
            // Retry the original request with the fresh cookie
            response = await fetch(url, opts);
        } else {
            // Refresh token also expired or invalid — log the user out
            Auth.logout();
            return response; // return the 401 so callers can handle it if needed
        }
    }

    return response;
}

/**
 * Calls GET /token to get a fresh accessToken cookie.
 * Returns true if successful, false if the refresh token is invalid/expired.
 */
async function _refreshAccessToken() {
    try {
        const res = await fetch(`${API_CONFIG.baseUrl}/token`, {
            method: 'GET',
            credentials: 'include',
        });
        return res.ok; // 200 = cookie was refreshed, 401/403 = session dead
    } catch {
        return false;
    }
}

// Make globally accessible
window.apiFetch = apiFetch;
