import React, { useRef } from "react";
import { Camera, X, Upload } from "lucide-react";

interface PhotoUploadProps {
  selectedFiles: File[];
  fileErrors: string[];
  isUploading: boolean;
  uploadProgress: number;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: (index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  disabled?: boolean;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  selectedFiles,
  fileErrors,
  isUploading,
  uploadProgress,
  onFileChange,
  onFileRemove,
  onDragOver,
  onDragLeave,
  onDrop,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Photos
        </label>

        {/* Drag and Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            selectedFiles.length > 0
              ? "border-blue-400/50 bg-blue-500/10"
              : "border-gray-600/50 hover:border-gray-500/50 hover:bg-gray-800/30"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={onFileChange}
            disabled={disabled}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          {selectedFiles.length === 0 ? (
            <div>
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-blue-400 hover:text-blue-300">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB each
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-sm font-medium text-white">
                {selectedFiles.length} file
                {selectedFiles.length !== 1 ? "s" : ""} selected
              </p>
              <p className="text-xs text-gray-400">
                Click to add more or drag and drop
              </p>
            </div>
          )}
        </div>

        {/* File Errors */}
        {fileErrors.length > 0 && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-sm font-medium text-red-400 mb-2">
              File validation errors:
            </p>
            <ul className="text-xs text-red-300 space-y-1">
              {fileErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-300">
                  Uploading photos...
                </p>
                <div className="mt-2 bg-gray-700/50 rounded-full h-2">
                  <div
                    className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-blue-400 mt-1">
                  {uploadProgress}% complete
                </p>
              </div>
            </div>
          </div>
        )}

        {/* File Preview Grid */}
        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative group bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden"
                >
                  <div className="aspect-square bg-gray-700/30 flex items-center justify-center">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        URL.revokeObjectURL(e.currentTarget.src);
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <p
                      className="text-xs text-gray-300 truncate"
                      title={file.name}
                    >
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onFileRemove(index)}
                    disabled={disabled}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove file"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
