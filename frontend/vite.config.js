/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        border: "var(--border)",
        night: {
          DEFAULT: "var(--night)",
          soft: "var(--night-soft)",
          foreground: "var(--night-foreground)",
          muted: "var(--night-muted)",
        },
        leaf: {
          DEFAULT: "var(--leaf)",
          soft: "var(--leaf-soft)",
        },
        harvest: "var(--harvest)",
        clay: "var(--clay)",
        sand: "var(--sand)",
      },
    },
  },
  plugins: [],
}