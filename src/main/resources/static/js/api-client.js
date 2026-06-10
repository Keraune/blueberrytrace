(function () {
    'use strict';

    const endpoints = Object.freeze({
        bootstrap: '/api/v1/frontend/bootstrap',
        session: '/api/v1/session/me',
        dashboard: '/api/v1/dashboard/summary',
        catalogs: '/api/v1/catalogs/operations',
        lotes: '/api/v1/lotes',
        camas: '/api/v1/camas',
        siembras: '/api/v1/siembras',
        uniformizaciones: '/api/v1/procesos/uniformizaciones',
        formalizaciones: '/api/v1/procesos/formalizaciones',
        clasificaciones: '/api/v1/clasificaciones',
        despachos: '/api/v1/despachos',
        trazabilidad: '/api/v1/reportes/trazabilidad',
        usuarios: '/api/v1/usuarios'
    });

    function csrfHeaders() {
        const token = document.querySelector('meta[name="_csrf"]')?.content;
        const header = document.querySelector('meta[name="_csrf_header"]')?.content;
        return token && header ? { [header]: token } : {};
    }

    function buildUrl(path, params) {
        const url = new URL(path, window.location.origin);
        if (params && typeof params === 'object') {
            Object.entries(params)
                .filter(([, value]) => value !== undefined && value !== null && value !== '')
                .forEach(([key, value]) => url.searchParams.set(key, value));
        }
        return url.toString();
    }

    async function request(path, options) {
        const requestOptions = options || {};
        const headers = {
            Accept: 'application/json',
            'X-Requested-With': 'BlueberryTraceFrontend',
            ...csrfHeaders(),
            ...(requestOptions.headers || {})
        };

        if (requestOptions.body && !(requestOptions.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(path, {
            credentials: 'same-origin',
            ...requestOptions,
            headers
        });

        const contentType = response.headers.get('content-type') || '';
        const payload = contentType.includes('application/json') ? await response.json() : await response.text();

        if (!response.ok) {
            const message = typeof payload === 'object' && payload.message
                ? payload.message
                : `Error HTTP ${response.status}`;
            throw new Error(message);
        }

        return payload;
    }

    function get(path, params) {
        return request(buildUrl(path, params), { method: 'GET' });
    }

    function send(path, method, data) {
        const body = data instanceof FormData ? data : JSON.stringify(data || {});
        return request(path, { method, body });
    }

    window.BlueberryTraceApi = Object.freeze({
        endpoints,
        get,
        post: (path, data) => send(path, 'POST', data),
        put: (path, data) => send(path, 'PUT', data),
        patch: (path, data) => send(path, 'PATCH', data),
        delete: (path, data) => send(path, 'DELETE', data),
        buildUrl
    });
})();
