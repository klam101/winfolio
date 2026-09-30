// Files in public/ are served under the Vite base path (/winfolio/ on GitHub Pages)
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
