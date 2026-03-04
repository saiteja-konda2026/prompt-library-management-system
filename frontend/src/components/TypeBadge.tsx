import type { PromptType } from '../types/prompt';

const typeStyles: Record<PromptType, string> = {
  SYSTEM: 'bg-purple-100 text-purple-800',
  USER: 'bg-blue-100 text-blue-800',
  STARTER: 'bg-orange-100 text-orange-800',
  FOLLOW_UP: 'bg-teal-100 text-teal-800',
};

const typeLabels: Record<PromptType, string> = {
  SYSTEM: 'System',
  USER: 'User',
  STARTER: 'Starter',
  FOLLOW_UP: 'Follow-up',
};

export default function TypeBadge({ type }: { type: PromptType }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeStyles[type]}`}>
      {typeLabels[type]}
    </span>
  );
}
