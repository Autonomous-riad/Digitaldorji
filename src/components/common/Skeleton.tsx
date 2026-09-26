import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', count = 1 }) => {
  if (count === 1) {
    return (
      <div
        className={`bg-purple-100/80 animate-pulse rounded-lg ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`bg-purple-100/80 animate-pulse rounded-lg ${className}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export const GarmentCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 space-y-4">
      <Skeleton className="w-full h-48 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="w-3/4 h-5" />
        <Skeleton className="w-1/2 h-4" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="w-20 h-6" />
        <Skeleton className="w-24 h-8 rounded-full" />
      </div>
    </div>
  );
};

export const OrderTimelineSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-purple-100">
        <div className="space-y-2">
          <Skeleton className="w-36 h-6" />
          <Skeleton className="w-24 h-4" />
        </div>
        <Skeleton className="w-28 h-8 rounded-full" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4].map(step => (
          <div key={step} className="flex gap-4 items-start">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="w-1/3 h-4" />
              <Skeleton className="w-2/3 h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
      <div className="p-4 border-b border-purple-100 bg-purple-50/50 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-purple-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-purple-100 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <Skeleton className="w-28 h-4" />
        <Skeleton className="w-16 h-4" />
      </div>
      <div className="flex gap-4 items-center">
        <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="w-3/4 h-4" />
          <Skeleton className="w-1/2 h-3" />
        </div>
      </div>
      <Skeleton className="w-full h-2 rounded-full" />
    </div>
  );
};

export const SkeletonStat: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="w-20 h-3" />
        <Skeleton className="w-8 h-8 rounded-xl" />
      </div>
      <Skeleton className="w-16 h-7" />
      <Skeleton className="w-24 h-3" />
    </div>
  );
};

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
};
