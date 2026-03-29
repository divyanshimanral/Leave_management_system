import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved) {
      document.documentElement.classList.toggle("dark", saved === "dark");
      setIsDark(saved === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      document.documentElement.classList.toggle("dark", prefersDark);
      setIsDark(prefersDark);
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    setIsDark(!isDark);
  };

  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      className="rounded-xl p-2 glass-hover"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
