interface MessageAlertProps {
  type: "error" | "success";
  message: string;
  className?: string;
}

export default function MessageAlert({
  type,
  message,
  className = "",
}: MessageAlertProps) {
  if (!message) return null;

  const baseClasses = "rounded-xl p-4 mb-6";
  const typeClasses = {
    error: "bg-red-500/10 border border-red-500/30",
    success: "bg-green-500/10 border border-green-500/30",
  };
  const textClasses = {
    error: "text-red-400",
    success: "text-green-400",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      <p className={textClasses[type]}>{message}</p>
    </div>
  );
}
