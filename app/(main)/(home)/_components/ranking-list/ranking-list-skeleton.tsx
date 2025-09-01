const RankingListSkeleton = () => (
  <div className="space-y-4 px-4 py-4">
    {Array.from({ length: 3 }, (_, i) => (
      <div key={i} className="flex gap-3 p-3">
        <div className="h-[70px] w-[70px] animate-pulse rounded bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    ))}
  </div>
);

export default RankingListSkeleton;
