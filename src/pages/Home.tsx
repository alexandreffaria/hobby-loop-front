export function Home() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">
        Welcome to HobbyLoop
      </h1>
      <p className="leading-relaxed text-gray-600">
        This is the Home page. Notice how fast you got here? That's client-side
        routing in action.
      </p>
    </div>
  );
}
