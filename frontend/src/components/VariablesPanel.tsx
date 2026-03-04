import { useMemo } from 'react';
import type { VariableDefinition } from '../types/prompt';

interface VariablesPanelProps {
  templateBody: string;
  variables: VariableDefinition[];
  onChange: (variables: VariableDefinition[]) => void;
}

function extractVariableNames(template: string): string[] {
  const regex = /\{\{(\w+)\}\}/g;
  const names = new Set<string>();
  let match;
  while ((match = regex.exec(template)) !== null) {
    names.add(match[1]);
  }
  return Array.from(names);
}

export default function VariablesPanel({ templateBody, variables, onChange }: VariablesPanelProps) {
  const detectedNames = useMemo(() => extractVariableNames(templateBody), [templateBody]);

  const mergedVariables = useMemo(() => {
    const existingByName = new Map(variables.map((v) => [v.name, v]));
    return detectedNames.map((name) => existingByName.get(name) ?? { name, required: false });
  }, [detectedNames, variables]);

  if (detectedNames.length === 0) return null;

  const updateVariable = (index: number, field: keyof VariableDefinition, value: string | boolean) => {
    const updated = mergedVariables.map((v, i) =>
      i === index ? { ...v, [field]: value } : v,
    );
    onChange(updated);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Detected Variables ({detectedNames.length})
      </label>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Variable</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Description</th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-500">Default Value</th>
              <th className="px-4 py-2 text-center text-xs font-medium uppercase text-gray-500">Required</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {mergedVariables.map((variable, index) => (
              <tr key={variable.name}>
                <td className="px-4 py-2 text-sm font-mono text-gray-900 whitespace-nowrap">
                  {`{{${variable.name}}}`}
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={variable.description ?? ''}
                    onChange={(e) => updateVariable(index, 'description', e.target.value)}
                    placeholder="Describe this variable"
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={variable.defaultValue ?? ''}
                    onChange={(e) => updateVariable(index, 'defaultValue', e.target.value)}
                    placeholder="Default"
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={variable.required}
                    onChange={(e) => updateVariable(index, 'required', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
