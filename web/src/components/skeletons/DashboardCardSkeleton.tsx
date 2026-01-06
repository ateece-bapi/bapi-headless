export default function DashboardCardSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 animate-pulse">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 bg-neutral-200 rounded-lg flex-shrink-0"></div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="h-5 bg-neutral-200 rounded w-32 mb-3"></div>
          <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
}
