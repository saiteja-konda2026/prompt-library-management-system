import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Prompt, PromptType, VariableDefinition } from '../types/prompt';
import { fetchPromptById, createPrompt, updatePrompt, deletePrompt } from '../api/prompts';
import StatusBadge from '../components/StatusBadge';
import VariablesPanel from '../components/VariablesPanel';
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
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            &larr; Back to Library
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Prompt' : 'New Prompt'}
          </h2>
          {prompt && (
            <div className="flex items-center gap-2">
              <StatusBadge status={prompt.status} />
              <span className="text-sm text-gray-500">v{prompt.version}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditMode && (
            <button
              onClick={handleDelete}
              className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Archive
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !name || !templateBody}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Metadata (edit mode) */}
      {prompt && (
        <div className="flex gap-4 text-sm text-gray-500">
          <span>Author: {prompt.author}</span>
          <span>Created: {new Date(prompt.createdAt).toLocaleDateString()}</span>
          <span>Updated: {new Date(prompt.updatedAt).toLocaleDateString()}</span>
        </div>
      )}

      {/* Form */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column - main form */}
        <div className="space-y-4 lg:col-span-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter prompt name"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of what this prompt does"
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template Body</label>
            <textarea
              value={templateBody}
              onChange={(e) => setTemplateBody(e.target.value)}
              placeholder="Enter your prompt template. Use {{variable_name}} for placeholders."
              rows={12}
              className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Auto-detected Variables */}
          <VariablesPanel
            templateBody={templateBody}
            variables={variables}
            onChange={setVariables}
          />
        </div>

        {/* Right column - metadata */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PromptType)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
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
