import { useEffect, useState } from 'react';
import type { PromptVersion } from '../types/prompt';
import { fetchVersionHistory, rollbackToVersion } from '../api/prompts';
import StatusBadge from './StatusBadge';
import TypeBadge from './TypeBadge';
import DiffModal from './DiffModal';

interface VersionHistoryProps {
  promptId: number;
  currentVersion: number;
  currentTemplateBody: string;
  onRollback: () => void;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function VersionHistory({ promptId, currentVersion, currentTemplateBody, onRollback }: VersionHistoryProps) {
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [open, setOpen] = useState(false);
  const [diffSelection, setDiffSelection] = useState<number[]>([]);
  const [showDiffModal, setShowDiffModal] = useState(false);

  useEffect(() => {
    fetchVersionHistory(promptId)
      .then(setVersions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [promptId, currentVersion]);

  const handleRollback = async (version: number) => {
    if (!confirm(`Rollback to version ${version}? This will create a new version with that content.`)) return;

    setRolling(true);
    try {
      await rollbackToVersion(promptId, version);
      setDiffSelection([]);
      onRollback();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rollback failed');
    } finally {
      setRolling(false);
    }
  };

  const toggleDiffSelection = (version: number) => {
    setDiffSelection((prev) => {
      if (prev.includes(version)) return prev.filter((v) => v !== version);
      if (prev.length < 2) return [...prev, version];
      return [prev[1], version];
    });
  };

  const getTemplateBody = (version: number): string => {
    if (version === currentVersion) return currentTemplateBody;
    return versions.find((v) => v.version === version)?.templateBody ?? '';
  };

  const sortedDiff = diffSelection.length === 2
    ? [...diffSelection].sort((a, b) => a - b)
    : null;

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 bg-gradient-to-r from-violet-50 to-purple-50 border-b border-gray-200 text-left hover:from-violet-100/50 hover:to-purple-100/50 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <svg className="h-4 w-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Version History
          <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
            {versions.length}
          </span>
        </span>
        <svg className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-gray-200">
          {loading ? (
            <div className="px-6 py-4 text-sm text-gray-500">Loading...</div>
          ) : error ? (
            <div className="px-6 py-4 text-sm text-red-600">{error}</div>
          ) : versions.length === 0 ? (
            <div className="px-6 py-4 text-sm text-gray-500">No previous versions.</div>
          ) : (
            <div>
              {/* Compare controls */}
              <div className="flex items-center justify-between px-6 py-2 border-b border-gray-100">
                <span className="text-xs text-gray-400">
                  Select two versions to compare
                </span>
                <div className="flex items-center gap-2">
                  {sortedDiff && (
                    <button
                      onClick={() => setShowDiffModal(true)}
                      className="rounded-md bg-gradient-to-r from-indigo-600 to-blue-500 px-3 py-1 text-xs font-medium text-white hover:from-indigo-700 hover:to-blue-600 transition-all"
                    >
                      Compare
                    </button>
                  )}
                  {diffSelection.length > 0 && (
                    <button
                      onClick={() => setDiffSelection([])}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Current version entry */}
              <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-200 bg-indigo-50/50">
                <input
                  type="checkbox"
                  checked={diffSelection.includes(currentVersion)}
                  onChange={() => toggleDiffSelection(currentVersion)}
                  className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600"
                />
                <span className="text-sm font-medium text-gray-900">v{currentVersion}</span>
                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600">Current</span>
              </div>

              {/* Version list */}
              <div className="divide-y divide-gray-200">
                {versions.map((v) => (
                  <div key={v.version}>
                    <div
                      className="flex items-center justify-between px-6 py-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => setExpanded(expanded === v.version ? null : v.version)}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={diffSelection.includes(v.version)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleDiffSelection(v.version);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600"
                        />
                        <span className="text-sm font-medium text-gray-900">v{v.version}</span>
                        <span className="text-sm text-gray-500">{v.author}</span>
                        <span className="text-xs text-gray-400">{formatDate(v.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRollback(v.version);
                          }}
                          disabled={rolling}
                          className="rounded-md border border-violet-200 px-3 py-1 text-xs font-medium text-violet-700 hover:bg-violet-50 hover:border-violet-300 disabled:opacity-50 transition-colors"
                        >
                          {rolling ? 'Rolling back...' : 'Rollback'}
                        </button>
                        <span className="text-gray-400 text-xs">{expanded === v.version ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {expanded === v.version && (
                      <div className="px-6 py-3 bg-gray-50 space-y-2">
                        <div className="flex gap-4 text-sm">
                          <span className="text-gray-500">Name: <span className="text-gray-900">{v.name}</span></span>
                          <TypeBadge type={v.type} />
                          <StatusBadge status={v.status} />
                        </div>
                        {v.description && (
                          <div className="text-sm text-gray-500">
                            Description: <span className="text-gray-700">{v.description}</span>
                          </div>
                        )}
                        {v.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {v.tags.map((tag) => (
                              <span key={tag} className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">Template Body:</div>
                          <pre className="rounded bg-white border border-gray-200 p-3 text-xs font-mono text-gray-800 overflow-x-auto max-h-40 whitespace-pre-wrap">
                            {v.templateBody}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Diff Modal */}
      {showDiffModal && sortedDiff && (
        <DiffModal
          oldText={getTemplateBody(sortedDiff[0])}
          newText={getTemplateBody(sortedDiff[1])}
          oldLabel={`v${sortedDiff[0]}${sortedDiff[0] === currentVersion ? ' (Current)' : ''}`}
          newLabel={`v${sortedDiff[1]}${sortedDiff[1] === currentVersion ? ' (Current)' : ''}`}
          onClose={() => setShowDiffModal(false)}
        />
      )}
    </div>
  );
}
