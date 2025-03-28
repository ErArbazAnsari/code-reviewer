import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor, Github, Code } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Code className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
          CodeReview AI
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <a 
          href="https://github.com/ErArbazAnsari/code-reviewer" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="GitHub Profile"
        >
          <Github size={20} />
        </a>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              {theme === 'light' ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
              ) : theme === 'dark' ? (
                <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
              ) : (
                <Monitor className="h-[1.2rem] w-[1.2rem] text-muted-foreground" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="shadow-dropdown">
            <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
              <Sun className="mr-2 h-4 w-4 text-amber-500" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
              <Moon className="mr-2 h-4 w-4 text-blue-400" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
              <Monitor className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 