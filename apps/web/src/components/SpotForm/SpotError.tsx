import { AlertCircle } from "lucide-react";

interface SpotErrorProps {
  error: string;
}

export default function SpotError({ error }: SpotErrorProps) {
  return (
    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
      <div className="flex items-center space-x-2">
        <AlertCircle className="w-5 h-5 text-red-400" />
        <p className="text-red-400">{error}</p>
      </div>
    </div>
  );
}
