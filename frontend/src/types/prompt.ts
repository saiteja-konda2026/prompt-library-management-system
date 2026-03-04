export type PromptType = 'SYSTEM' | 'USER' | 'STARTER' | 'FOLLOW_UP';

export type PromptStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface VariableDefinition {
  name: string;
  description?: string;
  defaultValue?: string;
  required: boolean;
}

export interface Prompt {
  id: number;
  name: string;
  description?: string;
  type: PromptType;
  templateBody: string;
  status: PromptStatus;
  version: number;
  tags: string[];
  variables: VariableDefinition[];
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromptVersion {
  version: number;
  name: string;
  description?: string;
  type: PromptType;
  templateBody: string;
  status: PromptStatus;
  tags: string[];
  variables: VariableDefinition[];
  author: string;
  createdAt: string;
}

export interface PromptPage {
  content: Prompt[];
  totalElements: number;
  totalPages: number;
  number: number;
}
