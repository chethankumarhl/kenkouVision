import { cn } from "@/lib/utils";

export function LoadingSpinner({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        className
      )}
      {...props}
    />
  );
}

export function LoadingDots({ className }) {
  return (
    <div className={cn("loading-dots", className)}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export function LoadingSkeleton({ className }) {
  return (
    <div className={cn("animate-pulse bg-gray-200 dark:bg-gray-700 rounded", className)} />
  );
}
