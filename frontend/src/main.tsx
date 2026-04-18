import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import keycloak from './keycloak';
import { useAuthStore } from './store/authStore';

function renderApp() {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

keycloak
  .init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    pkceMethod: 'S256',
    checkLoginIframe: false,
  })
  .then((authenticated) => {
    if (authenticated && keycloak.tokenParsed) {
      const parsed = keycloak.tokenParsed;
      useAuthStore.getState().setUser(
        {
          sub: String(parsed['sub'] ?? ''),
          preferredUsername: String(parsed['preferred_username'] ?? ''),
          email: parsed['email'] ? String(parsed['email']) : undefined,
        },
        (parsed['realm_access'] as { roles: string[] } | undefined)?.roles ?? []
      );
    } else {
      useAuthStore.getState().setLoading(false);
    }
    renderApp();
  })
  .catch((err) => {
    console.error('Keycloak init error:', err);
    useAuthStore.getState().setLoading(false);
    renderApp();
  });
