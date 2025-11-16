// Central place to configure the frontend API base URL
//
// Priority:
// 1. VITE_API_URL from environment (recommended for all environments)
// 2. Fallback to a sensible default per environment
//    - DEV: local backend on port 5000
//    - PROD: deployed backend URL (replace with your real domain)

const DEV_FALLBACK_API_URL = 'http://127.0.0.1:5000';
const PROD_FALLBACK_API_URL = 'https://your-backend-domain.com'; // TODO: set to your deployed backend URL

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? DEV_FALLBACK_API_URL : PROD_FALLBACK_API_URL);
