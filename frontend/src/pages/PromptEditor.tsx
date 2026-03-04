import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Prompt, PromptType, VariableDefinition } from '../types/prompt';
import { fetchPromptById, createPrompt, updatePrompt, deletePrompt } from '../api/prompts';
import StatusBadge from '../components/StatusBadge';
import VariablesPanel from '../components/VariablesPanel';
import LivePreview from '../components/LivePreview';
import VersionHistory from '../components/VersionHistory';

const PROMPT_TYPES: PromptType[] = ['SYSTEM', 'USER', 'STARTER', 'FOLLOW_UP'];

export default function PromptEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = id !== undefined;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<Prompt | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<PromptType>('USER');
  const [templateBody, setTemplateBody] = useState('');
  const [tags, setTags] = useState('');
  const [variables, setVariables] = useState<VariableDefinition[]>([]);
  const [testValues, setTestValues] = useState<Record<string, string>>({});

  const loadPrompt = () => {
    fetchPromptById(Number(id))
      .then((data) => {
        setPrompt(data);
        setName(data.name);
        setDescription(data.description || '');
        setType(data.type);
        setTemplateBody(data.templateBody);
        setTags(data.tags.join(', '));
        setVariables(data.variables);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Load prompt in edit mode
  useEffect(() => {
    if (!isEditMode) return;
    loadPrompt();
  }, [id, isEditMode]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const requestData = {
      name,
      type,
      templateBody,
      description: description || undefined,
      tags: tagList.length > 0 ? tagList : undefined,
      variables: variables.length > 0 ? variables : undefined,
    };

    try {
      if (isEditMode) {
        const updated = await updatePrompt(Number(id), requestData);
        setPrompt(updated);
      } else {
        await createPrompt(requestData);
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode || !confirm('Are you sure you want to archive this prompt?')) return;

    try {
      await deletePrompt(Number(id));
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Library
          </button>
          <div className="h-6 w-px bg-gray-200" />
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Prompt' : 'New Prompt'}
          </h2>
          {prompt && (
            <div className="flex items-center gap-2">
              <StatusBadge status={prompt.status} />
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                v{prompt.version}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditMode && (
            <button
              onClick={handleDelete}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
            >
              Archive
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !name || !templateBody}
            className="rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-2 text-sm font-medium text-white shadow-sm hover:from-indigo-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          <svg className="h-5 w-5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Metadata (edit mode) */}
      {prompt && (
        <div className="flex gap-6 rounded-lg bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 px-5 py-3 text-sm">
          <span className="flex items-center gap-1.5 text-gray-500">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {prompt.author}
          </span>
          <span className="flex items-center gap-1.5 text-gray-500">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Created {new Date(prompt.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1.5 text-gray-500">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Updated {new Date(prompt.updatedAt).toLocaleDateString()}
          </span>
        </div>
      )}

      {/* Form */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column - main form */}
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter prompt name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of what this prompt does"
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Template Body + Live Preview side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <div className="lg:col-span-3 rounded-xl bg-white border border-gray-200 shadow-sm p-5 flex flex-col">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Template Body
              </label>
              <textarea
                value={templateBody}
                onChange={(e) => setTemplateBody(e.target.value)}
                placeholder="Enter your prompt template. Use {{variable_name}} for placeholders."
                rows={12}
                className="w-full flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            {/* Live Preview */}
            <div className="lg:col-span-2">
              <LivePreview
                templateBody={templateBody}
                testValues={testValues}
              />
            </div>
          </div>

          {/* Auto-detected Variables */}
          <VariablesPanel
            templateBody={templateBody}
            variables={variables}
            onChange={setVariables}
            testValues={testValues}
            onTestValuesChange={setTestValues}
          />
        </div>

        {/* Right column - metadata */}
        <div className="space-y-5">
          <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PromptType)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                {PROMPT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Comma-separated tags"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Version History (edit mode only) */}
          {prompt && (
            <VersionHistory
              promptId={Number(id)}
              currentVersion={prompt.version}
              currentTemplateBody={templateBody}
              onRollback={loadPrompt}
            />
          )}
        </div>
      </div>
    </div>
  );
}
