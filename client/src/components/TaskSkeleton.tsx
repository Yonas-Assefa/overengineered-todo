export const TaskSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="p-4 bg-[#1E1F25] rounded-xl flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-[#25262C]"></div>

        <div className="flex-1 min-w-0">
          <div className="space-y-2">
            <div className="h-5 bg-[#25262C] rounded-lg w-3/4"></div>
            <div className="h-4 bg-[#25262C] rounded-lg w-20"></div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#25262C] rounded-lg"></div>
          <div className="w-8 h-8 bg-[#25262C] rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}; 