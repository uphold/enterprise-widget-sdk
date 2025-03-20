/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLIENT_ID: string;
  readonly VITE_CLIENT_SECRET: string;
  readonly VITE_IMPERSONATE_USER_ID: string;
  readonly VITE_PAYMENT_SESSION_URL_OVERRIDE: string;
  readonly VITE_ENTERPRISE_CORE_API_BASE_URL: string;
  readonly VITE_ENTERPRISE_WIDGETS_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
