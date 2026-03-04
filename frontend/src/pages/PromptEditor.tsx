import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { Prompt, PromptType, VariableDefinition } from '../types/prompt';
import { fetchPromptById, createPrompt, updatePrompt, deletePrompt } from '../api/prompts';
import StatusBadge from '../components/StatusBadge';
import VariablesPanel from '../components/VariablesPanel';
import LivePreview from '../components/LivePreview';
import VersionHistory from '../components/VersionHistory';
import ConfirmDialog from '../components/ConfirmDialog';

const PROMPT_TYPES: PromptType[] = ['SYSTEM', 'USER', 'STARTER', 'FOLLOW_UP'];

export default function PromptEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = id !== undefined;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [cloning, setCloning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<Prompt | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<PromptType>('USER');
  const [templateBody, setTemplateBody] = useState('');
  const [tags, setTags] = useState('');
  const [variables, setVariables] = useState<VariableDefinition[]>([]);
  const [testValues, setTestValues] = useState<Record<string, string>>({});
  const [confirmAction, setConfirmAction] = useState<'archive' | 'saveDraft' | 'save' | 'clone' | null>(null);
  const isArchived = prompt?.status === 'ARCHIVED';

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

  // Show success message passed via navigation state (e.g. after cloning)
  useEffect(() => {
    const state = location.state as { success?: string } | null;
    if (state?.success) {
      showSuccess(state.success);
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSave = async (status?: 'ACTIVE') => {
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
      status: status || undefined,
      tags: tagList.length > 0 ? tagList : undefined,
      variables: variables.length > 0 ? variables : undefined,
    };

    try {
      if (isEditMode) {
        const updated = await updatePrompt(Number(id), requestData);
        setPrompt(updated);
        showSuccess(status === 'ACTIVE' ? 'Prompt published successfully' : 'Prompt saved successfully');
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
    try {
      await deletePrompt(Number(id));
      navigate('/', { state: { success: 'Prompt archived successfully' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleClone = async () => {
    setCloning(true);
    setError(null);

    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const cloned = await createPrompt({
        name: name + ' copy',
        type,
        templateBody,
        description: description || undefined,
        tags: tagList.length > 0 ? tagList : undefined,
        variables: variables.length > 0 ? variables : undefined,
      });
      navigate(`/prompts/${cloned.id}`, { state: { success: `Prompt cloned as "${name} copy"` } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clone prompt');
    } finally {
      setCloning(false);
    }
  };

  const handleConfirm = () => {
    const action = confirmAction;
    setConfirmAction(null);
    if (action === 'archive') handleDelete();
    else if (action === 'saveDraft') handleSave();
    else if (action === 'save') handleSave(isEditMode && prompt?.status === 'DRAFT' ? 'ACTIVE' : undefined);
    else if (action === 'clone') handleClone();
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
            {isArchived ? 'View Prompt' : isEditMode ? 'Edit Prompt' : 'New Prompt'}
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
          {isArchived && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Read Only
            </span>
          )}
          {isEditMode && (
            <button
              onClick={() => setConfirmAction('clone')}
              disabled={cloning}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              {cloning ? 'Cloning...' : 'Clone'}
            </button>
          )}
          {isEditMode && prompt?.status === 'ACTIVE' && (
            <button
              onClick={() => setConfirmAction('archive')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Archive
            </button>
          )}
          {isEditMode && prompt?.status === 'DRAFT' && (
            <button
              onClick={() => setConfirmAction('saveDraft')}
              disabled={saving || !name || !templateBody}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 hover:border-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {saving ? 'Saving...' : 'Save as Draft'}
            </button>
          )}
          {!isArchived && (
            <button
              onClick={() => setConfirmAction('save')}
              disabled={saving || !name || !templateBody}
              className="rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-2 text-sm font-medium text-white shadow-sm hover:from-indigo-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
      </div>

      {/* Success */}
      {success && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">
          <svg className="h-5 w-5 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {success}
        </div>
      )}

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

      {/* Name + Description + Settings */}
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Name + Description */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter prompt name"
                readOnly={isArchived}
                className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors ${isArchived ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of what this prompt does"
                rows={2}
                readOnly={isArchived}
                className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors ${isArchived ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'}`}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-gray-200" />

          {/* Right: Type + Tags */}
          <div className="lg:w-64 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PromptType)}
                disabled={isArchived}
                className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors ${isArchived ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'}`}
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
                readOnly={isArchived}
                className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors ${isArchived ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Template Body + Live Preview — 50/50 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Template Body */}
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5 flex flex-col">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Template Body <span className="text-red-500">*</span>
          </label>
          <textarea
            value={templateBody}
            onChange={(e) => setTemplateBody(e.target.value)}
            placeholder="Enter your prompt template. Use {{variable_name}} for placeholders."
            rows={14}
            readOnly={isArchived}
            className={`w-full flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm transition-colors ${isArchived ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'}`}
          />
        </div>

        {/* Live Preview */}
        <LivePreview
          templateBody={templateBody}
          testValues={testValues}
        />
      </div>

      {/* Variables Panel + Version History — side by side */}
      <div className={`grid grid-cols-1 gap-5 ${prompt ? 'lg:grid-cols-10' : ''}`}>
        <div className={prompt ? 'lg:col-span-7' : ''}>
          <VariablesPanel
            templateBody={templateBody}
            variables={variables}
            onChange={setVariables}
            testValues={testValues}
            onTestValuesChange={setTestValues}
            readOnly={isArchived}
          />
        </div>

        {prompt && (
          <div className="lg:col-span-3">
            <VersionHistory
              promptId={Number(id)}
              currentVersion={prompt.version}
              currentTemplateBody={templateBody}
              onRollback={loadPrompt}
              readOnly={isArchived}
            />
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmAction === 'clone'}
        title="Clone Prompt"
        message={`This will create a new prompt named "${name} copy" with the same content. You'll be redirected to the new prompt.`}
        confirmLabel="Clone"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
      <ConfirmDialog
        open={confirmAction === 'archive'}
        title="Archive Prompt"
        message="Are you sure you want to archive this prompt? It will no longer be available for use but can still be viewed."
        confirmLabel="Archive"
        confirmClassName="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
      <ConfirmDialog
        open={confirmAction === 'saveDraft'}
        title="Save as Draft"
        message="This will save the current changes while keeping the prompt in draft status. You can continue editing it later."
        confirmLabel="Save as Draft"
        confirmClassName="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition-colors"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
      <ConfirmDialog
        open={confirmAction === 'save'}
        title={isEditMode && prompt?.status === 'DRAFT' ? 'Publish Prompt' : 'Save Changes'}
        message={isEditMode && prompt?.status === 'DRAFT'
          ? 'This will mark the prompt as active and make it available for use. This action cannot be undone.'
          : 'Are you sure you want to save the changes? A new version will be created.'}
        confirmLabel="Save"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
