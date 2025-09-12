interface BrowserWrapperProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function BrowserWrapper({
  children,
  title = "Fisherman's Notes",
  className = "",
}: BrowserWrapperProps) {
  return (
    <div
      className={`bg-gray-800 rounded-lg shadow-2xl overflow-hidden ${className}`}
    >
      {/* Browser Header */}
      <div className="bg-gray-700 px-4 py-3 flex items-center space-x-2">
        {/* Browser Controls */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>

        {/* Address Bar */}
        <div className="flex-1 mx-4">
          <div className="bg-gray-600 rounded-md px-3 py-1 flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-sm"></div>
            </div>
            <span className="text-gray-300 text-sm font-medium">{title}</span>
          </div>
        </div>

        {/* Browser Actions */}
        <div className="flex space-x-2">
          <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
            <div className="w-3 h-3 border border-gray-400 rounded-sm"></div>
          </div>
          <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
            <div className="w-3 h-3 border border-gray-400 rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Browser Content */}
      <div className="bg-white">{children}</div>
    </div>
  );
}
