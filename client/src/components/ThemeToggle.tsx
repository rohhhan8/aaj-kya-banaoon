import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // To avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button 
        variant="ghost" 
        size="icon"
        onClick={toggleTheme}
        className={`rounded-full w-10 h-10 ${theme === "dark" ? "bg-slate-700/40" : "bg-white/40"} backdrop-blur-sm hover:bg-opacity-50`}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <svg
            className="w-5 h-5 text-marigold fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 text-spice-brown fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 18a6 6 0 100-12 6 6 0 000 12zM12 4a8 8 0 110 16 8 8 0 010-16z" />
            <path d="M12 2a1 1 0 110 2 1 1 0 010-2zM12 20a1 1 0 110 2 1 1 0 010-2zM4.93 4.93a1 1 0 111.41 1.41 1 1 0 01-1.41-1.41zM17.66 17.66a1 1 0 111.41 1.41 1 1 0 01-1.41-1.41zM2 12a1 1 0 112 0 1 1 0 01-2 0zM20 12a1 1 0 112 0 1 1 0 01-2 0zM6.34 17.66a1 1 0 01-1.41 1.41 1 1 0 011.41-1.41zM19.07 4.93a1 1 0 01-1.41 1.41 1 1 0 011.41-1.41z" />
          </svg>
        )}
      </Button>
    </motion.div>
  );
};

export default ThemeToggle;