function PageState({ loading, error, empty, onRetry }) {
  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 bg-[#00e054] rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20">
        <p className="text-[#e05050] text-sm mb-3">{error}</p>
        <button
          onClick={onRetry}
          className="text-[#99aabb] text-xs uppercase font-semibold border border-[#2c3440] px-4 py-2 rounded-full hover:text-white hover:border-white transition-all"
        >
          Try again
        </button>
      </div>
    );

  if (empty)
    return (
      <div className="text-center py-20">
        <p className="text-[#556] text-sm">No films found.</p>
      </div>
    );

  return null;
}

export default PageState;
