'use client';

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  count?: number | null;
}

interface SubcategoryQuickFilterProps {
  subcategories: Subcategory[];
  activeSubcategories: string[];
  onChange: (subcategories: string[]) => void;
}

export default function SubcategoryQuickFilter({
  subcategories,
  activeSubcategories,
  onChange,
}: SubcategoryQuickFilterProps) {
  if (subcategories.length === 0) {
    return null;
  }

  const toggleSubcategory = (slug: string) => {
    if (activeSubcategories.includes(slug)) {
      onChange(activeSubcategories.filter((s) => s !== slug));
    } else {
      onChange([...activeSubcategories, slug]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-neutral-700">Quick Filter:</span>

      {subcategories.map((sub) => {
        const isActive = activeSubcategories.includes(sub.slug);

        return (
          <button
            key={sub.id}
            onClick={() => toggleSubcategory(sub.slug)}
            className={`
              rounded-full px-4 py-2 text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? 'bg-primary-500 text-white shadow-md hover:bg-primary-600'
                  : 'border border-neutral-300 bg-white text-neutral-700 hover:border-primary-300 hover:bg-primary-50'
              }
            `}
            aria-pressed={isActive}
          >
            {sub.name}
            {sub.count !== null && sub.count !== undefined && (
              <span className={`ml-2 text-xs ${isActive ? 'opacity-90' : 'opacity-75'}`}>
                ({sub.count})
              </span>
            )}
          </button>
        );
      })}

      {activeSubcategories.length > 0 && (
        <button
          onClick={() => onChange([])}
          className="ml-2 text-sm text-primary-600 hover:text-primary-700 hover:underline"
        >
          Clear
        </button>
      )}
    </div>
  );
}
