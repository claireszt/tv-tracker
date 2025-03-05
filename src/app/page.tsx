export default function Home() {
  return (
    <div className="text-center p-m">
      <h1 className="text-4xl font-heading text-light-text">Welcome to TV Tracker</h1>
      <a
        href="/search"
        className="inline-block mt-4 px-m py-s bg-primary text-white rounded-1 hover:bg-button-primary-hover transition-all"
      >
        Search for a Show
      </a>
    </div>
  );
}
