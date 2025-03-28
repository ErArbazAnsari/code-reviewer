import { useState } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { marked } from "marked";
import { Copy, Download, ChevronUp, ChevronDown, ThumbsUp, ExternalLink, Clipboard } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

export default function ReviewResults({ review, isLoading }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);

  // Function to enhance text with colored emojis using React-safe methods
  const formatReview = (text) => {
    if (!text) return text;
    
    return text
      .replace(/❌/g, '{{red-x}}')
      .replace(/✅/g, '{{green-check}}')
      .replace(/⚠️/g, '{{amber-warning}}')
      .replace(/💡/g, '{{blue-bulb}}');
  };

  const handleCopy = () => {
    if (!review) return;
    
    navigator.clipboard.writeText(review);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReview = () => {
    if (!review) return;
    
    const blob = new Blob([review], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "code-review.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const openInEditor = () => {
    if (!review) return;
    
    // Open in a new tab with a simple markdown editor view
    const editorWindow = window.open('', '_blank');
    
    if (editorWindow) {
      editorWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Code Review - Detailed View</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5.1.0/github-markdown.min.css">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
          <script>
            document.addEventListener('DOMContentLoaded', () => {
              document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
              });
            });
          </script>
          <style>
            body {
              box-sizing: border-box;
              min-width: 200px;
              max-width: 980px;
              margin: 0 auto;
              padding: 45px;
              background-color: #0d1117;
              color: #c9d1d9;
            }
            .markdown-body {
              background-color: #0d1117;
              color: #c9d1d9;
            }
            .markdown-body pre {
              background-color: #161b22;
            }
            .markdown-body h1, .markdown-body h2 {
              border-bottom-color: #21262d;
            }
            .markdown-body blockquote {
              color: #8b949e;
              border-left-color: #3b434b;
            }
            @media (max-width: 767px) {
              body {
                padding: 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class="markdown-body">
            ${marked.parse(review)}
          </div>
          <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
        </body>
        </html>
      `);
      editorWindow.document.close();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-md border bg-card p-8 text-card-foreground shadow">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-center text-muted-foreground">
          Analyzing your code...
        </p>
        <p className="text-center text-sm text-muted-foreground mt-2">
          This may take a few moments
        </p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-md border bg-card p-8 text-card-foreground shadow">
        <div className="text-6xl mb-4">💻</div>
        <h3 className="text-xl font-medium mb-2">No review yet</h3>
        <p className="text-center text-muted-foreground">
          Submit your code to get an expert review
        </p>
      </div>
    );
  }

  const formattedReview = formatReview(review);

  return (
    <div className="flex flex-col h-full rounded-md border bg-card text-card-foreground shadow overflow-hidden">
      <div className="flex items-center justify-between border-b p-3 bg-muted/40">
        <div className="flex items-center gap-2">
          <ThumbsUp className="h-4 w-4 text-primary" />
          <h3 className="font-medium">Code Review Results</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setExpanded(!expanded)}
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCopy}
            title="Copy review"
          >
            <Copy className={cn("h-4 w-4", copied && "text-green-500")} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={downloadReview}
            title="Download as Markdown"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={openInEditor}
            title="Open in full view"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {expanded && (
        <div className="flex-1 overflow-auto p-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <Markdown 
              rehypePlugins={[rehypeHighlight]}
              components={{
                pre: ({ node, className, children, ...props }) => {
                  // Extract language from className if it exists
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  
                  return (
                    <div className="relative my-4 group">
                      <pre className="rounded-md bg-muted/20 p-4 overflow-x-auto" {...props}>
                        {children}
                      </pre>
                      {language && (
                        <div className="code-language-label">
                          {language}
                        </div>
                      )}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-7 w-7 p-0 bg-muted/30 hover:bg-muted/50"
                          onClick={() => {
                            // Extract and copy the code text
                            const codeText = children?.props?.children || '';
                            navigator.clipboard.writeText(codeText);
                          }}
                          title="Copy code"
                        >
                          <Clipboard className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                },
                code: ({ node, className, children, ...props }) => {
                  // Check if this is an inline code block or a fenced code block
                  const match = /language-(\w+)/.exec(className || '');
                  return !match ? (
                    <code className="px-1.5 py-0.5 rounded bg-muted/30 font-mono text-sm" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={cn("text-sm block", className)} {...props}>
                      {children}
                    </code>
                  );
                },
                h1: ({ node, ...props }) => (
                  <h1 className="text-2xl font-bold mt-6 mb-4 text-foreground/90 border-b pb-1" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-xl font-bold mt-5 mb-3 text-foreground/90 border-b pb-1" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg font-bold mt-4 mb-2 text-foreground/90" {...props} />
                ),
                p: ({ node, children, ...props }) => {
                  // Handle the emoji replacements as part of the paragraph rendering
                  if (typeof children === 'string') {
                    let content = children;
                    if (content.includes('{{red-x}}')) {
                      return (
                        <p className="my-2 leading-relaxed" {...props}>
                          {content.split('{{red-x}}').map((part, i, arr) => (
                            i === arr.length - 1 ? (
                              part
                            ) : (
                              <>
                                {part}<span className="text-destructive">❌</span>
                              </>
                            )
                          ))}
                        </p>
                      );
                    } else if (content.includes('{{green-check}}')) {
                      return (
                        <p className="my-2 leading-relaxed" {...props}>
                          {content.split('{{green-check}}').map((part, i, arr) => (
                            i === arr.length - 1 ? (
                              part
                            ) : (
                              <>
                                {part}<span className="text-green-500">✅</span>
                              </>
                            )
                          ))}
                        </p>
                      );
                    } else if (content.includes('{{amber-warning}}')) {
                      return (
                        <p className="my-2 leading-relaxed" {...props}>
                          {content.split('{{amber-warning}}').map((part, i, arr) => (
                            i === arr.length - 1 ? (
                              part
                            ) : (
                              <>
                                {part}<span className="text-amber-500">⚠️</span>
                              </>
                            )
                          ))}
                        </p>
                      );
                    } else if (content.includes('{{blue-bulb}}')) {
                      return (
                        <p className="my-2 leading-relaxed" {...props}>
                          {content.split('{{blue-bulb}}').map((part, i, arr) => (
                            i === arr.length - 1 ? (
                              part
                            ) : (
                              <>
                                {part}<span className="text-blue-500">💡</span>
                              </>
                            )
                          ))}
                        </p>
                      );
                    }
                  }
                  return <p className="my-2 leading-relaxed" {...props}>{children}</p>;
                },
                ul: ({ node, ...props }) => (
                  <ul className="my-3 pl-6 list-disc" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="my-3 pl-6 list-decimal" {...props} />
                ),
                li: ({ node, children, ...props }) => {
                  // Handle the emoji replacements in list items
                  if (typeof children === 'string') {
                    let content = children;
                    if (content.includes('{{red-x}}')) {
                      return (
                        <li className="mb-1" {...props}>
                          {content.split('{{red-x}}').map((part, i, arr) => (
                            i === arr.length - 1 ? (
                              part
                            ) : (
                              <>
                                {part}<span className="text-destructive">❌</span>
                              </>
                            )
                          ))}
                        </li>
                      );
                    } else if (content.includes('{{green-check}}')) {
                      return (
                        <li className="mb-1" {...props}>
                          {content.split('{{green-check}}').map((part, i, arr) => (
                            i === arr.length - 1 ? (
                              part
                            ) : (
                              <>
                                {part}<span className="text-green-500">✅</span>
                              </>
                            )
                          ))}
                        </li>
                      );
                    } else if (content.includes('{{amber-warning}}')) {
                      return (
                        <li className="mb-1" {...props}>
                          {content.split('{{amber-warning}}').map((part, i, arr) => (
                            i === arr.length - 1 ? (
                              part
                            ) : (
                              <>
                                {part}<span className="text-amber-500">⚠️</span>
                              </>
                            )
                          ))}
                        </li>
                      );
                    } else if (content.includes('{{blue-bulb}}')) {
                      return (
                        <li className="mb-1" {...props}>
                          {content.split('{{blue-bulb}}').map((part, i, arr) => (
                            i === arr.length - 1 ? (
                              part
                            ) : (
                              <>
                                {part}<span className="text-blue-500">💡</span>
                              </>
                            )
                          ))}
                        </li>
                      );
                    }
                  }
                  return <li className="mb-1" {...props}>{children}</li>;
                },
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground" {...props} />
                ),
              }}
            >
              {formattedReview}
            </Markdown>
          </div>
        </div>
      )}
    </div>
  );
} 