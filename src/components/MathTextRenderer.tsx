import React from "react";
import katex from "katex";

interface MathTextRendererProps {
  text: string;
  className?: string;
}

export function MathTextRenderer({ text, className = "" }: MathTextRendererProps) {
  if (!text) return null;

  // Split text by both $$...$$ (block math) and $...$ (inline math)
  // Regex captures the delimiter to keep track of blocks
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

  return (
    <div className={`leading-relaxed text-sm lg:text-base ${className}`}>
      {parts.map((part, index) => {
        // Render block math: starting and ending with $$
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const math = part.slice(2, -2).trim();
          try {
            const html = katex.renderToString(math, {
              displayMode: true,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                className="block my-3 overflow-x-auto text-center"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            return (
              <code key={index} className="block font-mono text-xs bg-slate-900 p-2 my-2 rounded">
                {part}
              </code>
            );
          }
        }
        // Render inline math: starting and ending with $
        else if (part.startsWith("$") && part.endsWith("$")) {
          const math = part.slice(1, -1).trim();
          try {
            const html = katex.renderToString(math, {
              displayMode: false,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                className="inline-block px-1 align-middle overflow-x-auto max-w-full"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch (e) {
            return (
              <code key={index} className="font-mono text-xs bg-slate-900 px-1 rounded">
                {part}
              </code>
            );
          }
        }
        // Normal text
        else {
          return <span key={index}>{part}</span>;
        }
      })}
    </div>
  );
}
