import { useMemo, useState, type ReactNode } from 'react';

interface LivePreviewProps {
  templateBody: string;
  testValues: Record<string, string>;
}

export default function LivePreview({ templateBody, testValues }: LivePreviewProps) {
  const rendered = useMemo((): ReactNode[] => {
    if (!templateBody) return [];

    const parts: ReactNode[] = [];
    const regex = /\{\{(\w+)\}\}/g;
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(templateBody)) !== null) {
      // Text before the variable
      if (match.index > lastIndex) {
        parts.push(<span key={key++}>{templateBody.slice(lastIndex, match.index)}</span>);
      }

      const varName = match[1];
      const value = testValues[varName];

      if (value) {
        parts.push(
          <span key={key++} className="text-blue-700 font-semibold">{value}</span>,
        );
      } else {
        parts.push(
          <span key={key++} className="bg-yellow-100 text-yellow-700 rounded px-0.5">{`{{${varName}}}`}</span>,
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Remaining text
    if (lastIndex < templateBody.length) {
      parts.push(<span key={key++}>{templateBody.slice(lastIndex)}</span>);
    }

    return parts;
  }, [templateBody, testValues]);

  const renderedText = useMemo(() => {
    if (!templateBody) return '';
    return templateBody.replace(/\{\{(\w+)\}\}/g, (_, varName) => testValues[varName] || `{{${varName}}}`);
  }, [templateBody, testValues]);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(renderedText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="h-full rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-sm font-semibold text-gray-900">Live Preview</span>
        </div>
        {templateBody && (
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-white/60 hover:text-gray-900 transition-colors"
            title="Copy rendered text to clipboard"
          >
            {copied ? (
              <>
                <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!templateBody ? (
          <div className="flex items-center justify-center h-full text-sm text-gray-400">
            Start typing in the template to see a preview
          </div>
        ) : (
          <pre className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm font-mono whitespace-pre-wrap break-words leading-relaxed">
            {rendered}
          </pre>
        )}
      </div>
    </div>
  );
}
