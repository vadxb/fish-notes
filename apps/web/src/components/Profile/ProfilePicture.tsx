import { User, Camera } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatar?: string;
  subscription: "free" | "premium";
  premiumExpiresAt?: string;
  createdAt: string;
  updatedAt?: string;
}

interface ProfilePictureProps {
  profile: UserProfile;
  isSubmitting: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
  onImageClick: () => void;
}

export default function ProfilePicture({
  profile,
  isSubmitting,
  fileInputRef,
  onAvatarUpload,
  onRemoveAvatar,
  onImageClick,
}: ProfilePictureProps) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gray-700/50 rounded-lg">
          <Camera className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Profile Picture</h3>
          <p className="text-sm text-gray-400">
            Upload or change your profile picture
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity border-2 border-gray-600"
              onClick={onImageClick}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center border-2 border-gray-600">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onAvatarUpload}
            className="hidden"
            id="avatar-upload"
          />
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <label
                htmlFor="avatar-upload"
                className="inline-flex items-center px-3 py-2 bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-600/50 cursor-pointer transition-all duration-200"
              >
                <Camera className="w-4 h-4 mr-2" />
                {profile.avatar ? "Change" : "Upload"}
              </label>
              {profile.avatar && (
                <button
                  onClick={onRemoveAvatar}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-3 py-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/30 hover:text-red-300 disabled:opacity-50 transition-all duration-200"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
