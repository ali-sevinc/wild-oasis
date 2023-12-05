import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "import.meta.env.REACT_APP_SUPABASE_KEY": JSON.stringify(
        env.REACT_APP_SUPABASE_KEY
      ),
      "import.meta.env.REACT_APP_SUPABASE_URL": JSON.stringify(
        env.REACT_APP_SUPABASE_URL
      ),
    },
    plugins: [react()],
  };
});
