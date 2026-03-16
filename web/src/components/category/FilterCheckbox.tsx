'use client';

interface FilterCheckboxProps {
  label: string;
  count?: number | null;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function FilterCheckbox({ label, count, checked, onChange }: FilterCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-2 hover:bg-neutral-50 rounded px-2 -mx-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-neutral-300 text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
      />
      <span className="flex-1 text-sm text-neutral-700">{label}</span>
      {count !== null && count !== undefined && (
        <span className="text-xs text-neutral-500">({count})</span>
      )}
    </label>
  );
}
