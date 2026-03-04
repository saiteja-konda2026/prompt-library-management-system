import { useEffect } from 'react';
import DiffView from './DiffView';

interface DiffModalProps {
  oldText: string;
  newText: string;
  oldLabel: string;
  newLabel: string;
  onClose: () => void;
}

export default function DiffModal({ oldText, newText, oldLabel, newLabel, onClose }: DiffModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl flex flex-col"
        style={{ width: '90vw', height: '80vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">
            Compare Versions: {oldLabel} vs {newLabel}
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Diff Content */}
        <div className="flex-1 overflow-hidden p-4">
          <DiffView
            oldText={oldText}
            newText={newText}
            oldLabel={oldLabel}
            newLabel={newLabel}
          />
        </div>
      </div>
    </div>
  );
}
