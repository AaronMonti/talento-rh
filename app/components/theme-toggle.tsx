"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="brutalist"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="neubrutal-button bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-600 dark:to-pink-600 hover:from-purple-500 hover:to-pink-500 dark:hover:from-purple-700 dark:hover:to-pink-700 text-white border-black dark:border-white"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
} 