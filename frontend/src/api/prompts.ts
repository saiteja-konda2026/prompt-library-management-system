import type { Prompt, PromptPage, PromptType, PromptStatus, PromptVersion, VariableDefinition } from '../types/prompt';

export interface FetchPromptsParams {
  type?: PromptType;
  status?: PromptStatus;
  tags?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface PromptUpsertRequest {
  name: string;
  type: PromptType;
  templateBody: string;
  description?: string;
  status?: PromptStatus;
  tags?: string[];
  variables?: VariableDefinition[];
  author?: string;
}

export async function fetchPrompts(params: FetchPromptsParams = {}): Promise<PromptPage> {
  const searchParams = new URLSearchParams();

  if (params.type) searchParams.set('type', params.type);
  if (params.status) searchParams.set('status', params.status);
  if (params.tags) searchParams.set('tags', params.tags);
  if (params.search) searchParams.set('search', params.search);
  if (params.page !== undefined) searchParams.set('page', String(params.page));
  if (params.size !== undefined) searchParams.set('size', String(params.size));

  const query = searchParams.toString();
  const url = `/api/prompts${query ? `?${query}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch prompts: ${response.status}`);
  }
  return response.json();
}

export async function fetchPromptById(id: number): Promise<Prompt> {
  const response = await fetch(`/api/prompts/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch prompt: ${response.status}`);
  }
  return response.json();
}

export async function createPrompt(data: PromptUpsertRequest): Promise<Prompt> {
  const response = await fetch('/api/prompts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || `Failed to create prompt: ${response.status}`);
  }
  return response.json();
}

export async function updatePrompt(id: number, data: PromptUpsertRequest): Promise<Prompt> {
  const response = await fetch(`/api/prompts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || `Failed to update prompt: ${response.status}`);
  }
  return response.json();
}

export async function deletePrompt(id: number): Promise<void> {
  const response = await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || `Failed to delete prompt: ${response.status}`);
  }
}

export async function fetchVersionHistory(id: number): Promise<PromptVersion[]> {
  const response = await fetch(`/api/prompts/${id}/versions`);
  if (!response.ok) {
    throw new Error(`Failed to fetch version history: ${response.status}`);
  }
  return response.json();
}

export async function rollbackToVersion(id: number, versionId: number): Promise<void> {
  const response = await fetch(`/api/prompts/${id}/rollback/${versionId}`, { method: 'POST' });
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || `Failed to rollback: ${response.status}`);
  }
}
