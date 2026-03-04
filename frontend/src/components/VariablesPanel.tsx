import { useMemo } from 'react';
import type { VariableDefinition } from '../types/prompt';

interface VariablesPanelProps {
  templateBody: string;
  variables: VariableDefinition[];
  onChange: (variables: VariableDefinition[]) => void;
  testValues: Record<string, string>;
  onTestValuesChange: (values: Record<string, string>) => void;
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

export default function VariablesPanel({ templateBody, variables, onChange, testValues, onTestValuesChange }: VariablesPanelProps) {
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
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-200">
        <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <span className="text-sm font-semibold text-gray-900">
          Detected Variables
        </span>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
          {detectedNames.length}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Variable</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Description</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Default Value</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <span className="flex items-center gap-1">
                  Test Value
                  <span className="inline-block h-2 w-2 rounded-full bg-blue-400" title="Values used in Live Preview" />
                </span>
              </th>
              <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">Required</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {mergedVariables.map((variable, index) => (
              <tr key={variable.name} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-2.5">
                  <code className="rounded bg-indigo-50 px-2 py-0.5 text-sm font-mono text-indigo-700 border border-indigo-100">
                    {`{{${variable.name}}}`}
                  </code>
                </td>
                <td className="px-4 py-2.5">
                  <input
                    type="text"
                    value={variable.description ?? ''}
                    onChange={(e) => updateVariable(index, 'description', e.target.value)}
                    placeholder="Describe this variable"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-2.5">
                  <input
                    type="text"
                    value={variable.defaultValue ?? ''}
                    onChange={(e) => updateVariable(index, 'defaultValue', e.target.value)}
                    placeholder="Default"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-2.5">
                  <input
                    type="text"
                    value={testValues[variable.name] ?? ''}
                    onChange={(e) => onTestValuesChange({ ...testValues, [variable.name]: e.target.value })}
                    placeholder={variable.defaultValue || 'Test value'}
                    className="w-full rounded-md border border-blue-200 bg-blue-50/30 px-2 py-1 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </td>
                <td className="px-4 py-2.5 text-center">
                  <input
                    type="checkbox"
                    checked={variable.required}
                    onChange={(e) => updateVariable(index, 'required', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
