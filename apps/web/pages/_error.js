// Custom error page to prevent useContext issues during build
export default function Error({ statusCode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          {statusCode ? `Error ${statusCode}` : "An error occurred"}
        </h2>
        <p className="text-gray-300">Something went wrong on our end.</p>
      </div>
    </div>
  );
}
