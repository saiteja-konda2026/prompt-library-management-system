import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PromptPage, PromptStatus, PromptType } from '../types/prompt';
import { fetchPrompts } from '../api/prompts';
import StatusBadge from '../components/StatusBadge';
import TypeBadge from '../components/TypeBadge';
import Pagination from '../components/Pagination';

const PROMPT_TYPES: PromptType[] = ['SYSTEM', 'USER', 'STARTER', 'FOLLOW_UP'];
const PROMPT_STATUSES: PromptStatus[] = ['DRAFT', 'ACTIVE', 'ARCHIVED'];
const PAGE_SIZE = 20;

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<PromptPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<PromptType | ''>('');
  const [statusFilter, setStatusFilter] = useState<PromptStatus | ''>('');
  const [tagFilter, setTagFilter] = useState('');
  const [page, setPage] = useState(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [typeFilter, statusFilter, tagFilter]);

  // Fetch prompts
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchPrompts({
      search: debouncedSearch || undefined,
      type: typeFilter || undefined,
      status: statusFilter || undefined,
      tags: tagFilter || undefined,
      page,
      size: PAGE_SIZE,
    })
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [debouncedSearch, typeFilter, statusFilter, tagFilter, page]);

  return (
    <div className="space-y-4">
      {/* Search, Filters, and New Prompt */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as PromptType | '')}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          {PROMPT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as PromptStatus | '')}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          {PROMPT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by tags (comma-separated)"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={() => navigate('/prompts/new')}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 whitespace-nowrap"
        >
          + New Prompt
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tags</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Version</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data?.content.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                  No prompts found.
                </td>
              </tr>
            ) : (
              data?.content.map((prompt) => (
                <tr
                  key={prompt.id}
                  onClick={() => navigate(`/prompts/${prompt.id}`)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{prompt.name}</div>
                    {prompt.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">{prompt.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <TypeBadge type={prompt.type} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {prompt.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={prompt.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    v{prompt.version}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(prompt.updatedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {data && (
          <Pagination
            page={data.number}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
