"use client";

import { useState } from "react";
import { Check, Copy, FileText } from "@phosphor-icons/react";

interface MarkdownRendererProps {
  content: string;
  onInsertToNotes?: (code: string) => void;
}

export function MarkdownRenderer({ content, onInsertToNotes }: MarkdownRendererProps) {
  if (!content) return null;

  // Split content by code blocks: ```[lang]\n[code]\n```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          // Parse code block
          const lines = part.split("\n");
          const firstLine = lines[0]; // e.g. "```cpp" or "```"
          const lang = firstLine.slice(3).trim().toUpperCase() || "CODE";
          
          // Get the actual code content (skip first and last line)
          const codeLines = lines.slice(1, lines.length - 1);
          const code = codeLines.join("\n");

          return (
            <CodeBlock 
              key={index} 
              code={code} 
              lang={lang} 
              onInsertToNotes={onInsertToNotes} 
            />
          );
        } else {
          // Render plain text with bold, inline code, and bullet lists
          return (
            <div key={index} className="text-sm leading-relaxed text-text-primary whitespace-pre-wrap break-words">
              {renderFormattedText(part)}
            </div>
          );
        }
      })}
    </div>
  );
}

function CodeBlock({ code, lang, onInsertToNotes }: { code: string; lang: string; onInsertToNotes?: (code: string) => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 border border-border rounded-xl overflow-hidden bg-[#1B1917] text-gray-200 font-mono text-xs shadow-sm">
      {/* Header bar */}
      <div className="bg-[#2B2927] px-4 py-2 border-b border-border/10 flex items-center justify-between">
        <span className="text-[10px] font-bold text-gray-400 tracking-wider">{lang}</span>
        <div className="flex items-center gap-3">
          {onInsertToNotes && (
            <button
              onClick={() => onInsertToNotes(code)}
              className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white transition-colors cursor-pointer font-medium"
              title="Insert into your notes"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Insert to Notes</span>
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-white transition-colors cursor-pointer font-medium"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-signal" />
                <span className="text-signal font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>
      {/* Code body */}
      <pre className="p-4 overflow-x-auto whitespace-pre leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Render bold (**text**) and inline code (`code`)
function renderFormattedText(text: string) {
  const tokens = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  
  return tokens.map((token, i) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={i} className="font-bold text-text-primary">{token.slice(2, -2)}</strong>;
    } else if (token.startsWith("`") && token.endsWith("`")) {
      return <code key={i} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-focus font-mono text-xs">{token.slice(1, -1)}</code>;
    }
    return token;
  });
}
