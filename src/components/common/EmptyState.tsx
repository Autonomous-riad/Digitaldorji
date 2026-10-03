import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  titleEn,
  titleBn,
  descriptionEn,
  descriptionBn,
  actionText,
  actionHref,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`text-center py-12 px-4 rounded-2xl bg-cream-50 border border-cream-300 shadow-sm max-w-md mx-auto my-6 ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-cream-200 text-purple-950 flex items-center justify-center mx-auto mb-4 shadow-inner">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="font-bold text-lg text-purple-950">
        {titleBn} <span className="text-purple-950/70 font-normal text-sm">/ {titleEn}</span>
      </h3>
      <p className="text-purple-950/80 text-sm mt-1.5 leading-relaxed">
        {descriptionBn}
      </p>
      <p className="text-purple-950/60 text-xs mt-0.5 font-light">
        {descriptionEn}
      </p>

      {(actionText && (onAction || actionHref)) && (
        <div className="mt-6">
          {actionHref ? (
            <a
              href={actionHref}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-purple-950 hover:bg-purple-900 text-cream-50 font-medium text-sm transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-purple-950 focus-visible:ring-offset-2"
            >
              {actionText}
            </a>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-purple-950 hover:bg-purple-900 text-cream-50 font-medium text-sm transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-purple-950 focus-visible:ring-offset-2 cursor-pointer"
            >
              {actionText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
