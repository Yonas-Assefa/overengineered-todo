import React from 'react';

export const TaskSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="p-4 bg-[#1E1F25] rounded-xl flex items-start gap-3">
        {/* Checkbox skeleton */}
        <div className="w-5 h-5 rounded-full bg-[#25262C]"></div>

        <div className="flex-1 min-w-0">
          <div className="space-y-2">
            {/* Title skeleton */}
            <div className="h-5 bg-[#25262C] rounded-lg w-3/4"></div>
            {/* Date skeleton */}
            <div className="h-4 bg-[#25262C] rounded-lg w-20"></div>
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#25262C] rounded-lg"></div>
          <div className="w-8 h-8 bg-[#25262C] rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}; 