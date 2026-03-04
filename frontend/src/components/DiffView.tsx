import { useMemo, type ReactNode } from 'react';
import { diffLines, diffWords } from 'diff';

interface DiffViewProps {
  oldText: string;
  newText: string;
  oldLabel: string;
  newLabel: string;
}

interface DiffRow {
  left: ReactNode;
  right: ReactNode;
  leftType: 'equal' | 'removed' | 'empty';
  rightType: 'equal' | 'added' | 'empty';
}

function renderWordDiff(oldStr: string, newStr: string): { left: ReactNode; right: ReactNode } {
  const changes = diffWords(oldStr, newStr);
  const leftParts: ReactNode[] = [];
  const rightParts: ReactNode[] = [];

  changes.forEach((change, i) => {
    if (change.added) {
      rightParts.push(
        <span key={i} className="bg-green-300 rounded-sm">{change.value}</span>,
      );
    } else if (change.removed) {
      leftParts.push(
        <span key={i} className="bg-red-300 rounded-sm">{change.value}</span>,
      );
    } else {
      leftParts.push(<span key={`l${i}`}>{change.value}</span>);
      rightParts.push(<span key={`r${i}`}>{change.value}</span>);
    }
  });

  return { left: <>{leftParts}</>, right: <>{rightParts}</> };
}

function computeDiff(oldText: string, newText: string): DiffRow[] {
  const changes = diffLines(oldText, newText);
  const rows: DiffRow[] = [];

  let i = 0;
  while (i < changes.length) {
    const change = changes[i];

    if (!change.added && !change.removed) {
      // Unchanged lines
      const lines = change.value.replace(/\n$/, '').split('\n');
      for (const line of lines) {
        rows.push({ left: line, right: line, leftType: 'equal', rightType: 'equal' });
      }
      i++;
    } else if (change.removed && i + 1 < changes.length && changes[i + 1].added) {
      // Modified: removed followed by added — do word-level diff
      const oldLines = change.value.replace(/\n$/, '').split('\n');
      const newLines = changes[i + 1].value.replace(/\n$/, '').split('\n');
      const maxLen = Math.max(oldLines.length, newLines.length);

      for (let j = 0; j < maxLen; j++) {
        if (j < oldLines.length && j < newLines.length) {
          const { left, right } = renderWordDiff(oldLines[j], newLines[j]);
          rows.push({ left, right, leftType: 'removed', rightType: 'added' });
        } else if (j < oldLines.length) {
          rows.push({ left: oldLines[j], right: null, leftType: 'removed', rightType: 'empty' });
        } else {
          rows.push({ left: null, right: newLines[j], leftType: 'empty', rightType: 'added' });
        }
      }
      i += 2;
    } else if (change.removed) {
      const lines = change.value.replace(/\n$/, '').split('\n');
      for (const line of lines) {
        rows.push({ left: line, right: null, leftType: 'removed', rightType: 'empty' });
      }
      i++;
    } else {
      const lines = change.value.replace(/\n$/, '').split('\n');
      for (const line of lines) {
        rows.push({ left: null, right: line, leftType: 'empty', rightType: 'added' });
      }
      i++;
    }
  }

  return rows;
}

const leftStyles = {
  equal: '',
  removed: 'bg-red-100',
  empty: 'bg-gray-50',
};

const rightStyles = {
  equal: '',
  added: 'bg-green-100',
  empty: 'bg-gray-50',
};

export default function DiffView({ oldText, newText, oldLabel, newLabel }: DiffViewProps) {
  const rows = useMemo(() => computeDiff(oldText, newText), [oldText, newText]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full">
      <div className="grid grid-cols-2 divide-x divide-gray-200 shrink-0">
        <div className="bg-red-50 px-4 py-2 text-sm font-medium text-red-700">{oldLabel}</div>
        <div className="bg-green-50 px-4 py-2 text-sm font-medium text-green-700">{newLabel}</div>
      </div>
      <div className="overflow-y-auto flex-1">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-2 divide-x divide-gray-200">
            <pre className={`px-4 py-0.5 min-h-[1.5rem] text-sm font-mono m-0 whitespace-pre-wrap break-words ${leftStyles[row.leftType]}`}>
              {row.left ?? '\u00A0'}
            </pre>
            <pre className={`px-4 py-0.5 min-h-[1.5rem] text-sm font-mono m-0 whitespace-pre-wrap break-words ${rightStyles[row.rightType]}`}>
              {row.right ?? '\u00A0'}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
