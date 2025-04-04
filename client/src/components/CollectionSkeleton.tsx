export const CollectionSkeleton = () => {
  return (
    <div className="group relative p-6 bg-[#1E1F25] rounded-2xl h-[200px] animate-pulse">
      <div className="flex flex-col gap-4">
        {/* Icon and Title skeleton */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#25262C] rounded-xl"></div>
          <div className="h-6 w-32 bg-[#25262C] rounded-lg"></div>
        </div>

        {/* Task count skeleton */}
        <div className="h-4 w-20 bg-[#25262C] rounded-lg"></div>

        {/* Progress bar skeleton */}
        <div className="relative w-full h-1 bg-[#25262C] rounded-full"></div>
      </div>
    </div>
  );
}; 