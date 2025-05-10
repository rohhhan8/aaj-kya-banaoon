import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ 
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  // To avoid hydration issues with next-themes
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="light" 
      enableSystem={true} 
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export default ThemeProvider;