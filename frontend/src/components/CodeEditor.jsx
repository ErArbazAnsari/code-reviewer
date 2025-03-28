import { useState, useRef, useCallback } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";
import "prismjs/themes/prism-tomorrow.css";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { 
  Copy, 
  Clipboard, 
  AlignJustify, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  RotateCcw
} from "lucide-react";
import { cn } from "../lib/utils";

// Language definitions with display name and Prism language ID
const LANGUAGES = [
  { name: "JavaScript", value: "javascript" },
  { name: "JSX", value: "jsx" },
  { name: "TypeScript", value: "typescript" },
  { name: "Python", value: "python" },
  { name: "HTML", value: "markup" },
  { name: "CSS", value: "css" },
  { name: "Java", value: "java" },
  { name: "C", value: "c" },
  { name: "C++", value: "cpp" },
  { name: "C#", value: "csharp" },
  { name: "Ruby", value: "ruby" },
  { name: "Go", value: "go" },
  { name: "Rust", value: "rust" },
  { name: "Swift", value: "swift" },
  { name: "PHP", value: "php" },
  { name: "SQL", value: "sql" },
  { name: "Bash", value: "bash" }
];

export default function CodeEditor({ code, setCode, onReview, isLoading }) {
  const [language, setLanguage] = useState("javascript");
  const [fontSize, setFontSize] = useState(16);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 28));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
  };

  const resetEditor = () => {
    // Confirm before resetting
    if (window.confirm("Reset the editor? This will clear your code.")) {
      setCode("");
    }
  };
  
  // Simple HTML escaping function
  const escapeHtml = (text) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
  
  // Create a safe highlighter function
  const highlightCode = useCallback((code) => {
    if (!code) return ""; // Return empty string for empty code
    
    try {
      // Use basic Prism highlighting
      const html = Prism.highlight(
        code,
        Prism.languages[language] || Prism.languages.javascript,
        language
      );
      return html;
    } catch (error) {
      console.error("Highlighting error:", error);
      // Return safely escaped HTML on error
      return escapeHtml(code);
    }
  }, [language]);
  
  return (
    <div className="flex flex-col h-full rounded-md border bg-card text-card-foreground shadow overflow-hidden">
      <div className="flex items-center justify-between border-b p-3 bg-muted/40">
        <div className="flex items-center gap-2">
          <AlignJustify className="h-4 w-4 text-muted-foreground" />
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]" disabled={isLoading}>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={decreaseFontSize}
            disabled={fontSize <= 12 || isLoading}
            title="Decrease font size"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-7 text-center">
            {fontSize}px
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={increaseFontSize}
            disabled={fontSize >= 28 || isLoading}
            title="Increase font size"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCopyCode}
            disabled={!code || isLoading}
            title="Copy code"
          >
            {copied ? <Clipboard className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePasteCode}
            disabled={isLoading}
            title="Paste from clipboard"
          >
            <Clipboard className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={resetEditor}
            disabled={!code || isLoading}
            title="Reset editor"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto relative">
        <Editor
          ref={editorRef}
          value={code}
          onValueChange={(newCode) => setCode(newCode)}
          highlight={highlightCode}
          padding={16}
          className={cn(
            "w-full h-full min-h-[300px] font-mono",
            isLoading && "opacity-70 pointer-events-none"
          )}
          style={{
            fontFamily: '"Fira Code", "Fira Mono", monospace',
            fontSize: `${fontSize}px`,
          }}
          disabled={isLoading}
          textareaId="codeEditor"
        />
      </div>
      
      <div className="flex justify-end items-center p-3 border-t bg-muted/30">
        <Button 
          onClick={onReview} 
          disabled={isLoading || !code}
          className={cn(isLoading && "opacity-80")}
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Review Code
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 