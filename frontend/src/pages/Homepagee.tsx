const Homepage = () => {
  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center gap-6">
      <button
        type="button"
        className="btn bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700"
      >
        Create Room
      </button>

      <button
        type="button"
        className="btn bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700"
      >
        Join Room
      </button>
    </div>
  );
};

export default Homepage;
