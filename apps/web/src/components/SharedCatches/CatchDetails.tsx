import React, { useState } from "react";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Calendar,
  MapPin,
  Scale,
  Ruler,
} from "lucide-react";
import ImageCarousel from "./ImageCarousel";
import CommentsSection from "./CommentsSection";

interface SharedCatch {
  id: string;
  title: string;
  description: string;
  images: string[];
  weight: number;
  length: number | null; // Will be added later
  fishType: string;
  bait: string;
  location: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    avatar: string | null;
  };
  likes: number;
  isLiked: boolean;
  comments: Array<{
    id: string;
    content: string;
    user: {
      id: string;
      username: string;
      avatar: string | null;
    };
    createdAt: string;
  }>;
}

interface CatchDetailsProps {
  catch: SharedCatch;
}

const CatchDetails = ({ catch: catchData }: CatchDetailsProps) => {
  const [isLiked, setIsLiked] = useState(catchData.isLiked);
  const [likes, setLikes] = useState(catchData.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-lg">
      {/* Images Carousel */}
      <ImageCarousel images={catchData.images} />

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-2">
              {catchData.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(catchData.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{catchData.location}</span>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-gray-600 overflow-hidden">
              {catchData.user.avatar ? (
                <Image
                  src={catchData.user.avatar}
                  alt={catchData.user.username}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {catchData.user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="text-white font-medium">
                {catchData.user.username}
              </p>
              <p className="text-gray-400 text-sm">Angler</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 mb-6 leading-relaxed">
          {catchData.description}
        </p>

        {/* Catch Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <Scale className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-gray-300 text-sm">Weight</p>
            <p className="text-white font-bold text-lg">{catchData.weight}kg</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <Ruler className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-gray-300 text-sm">Length</p>
            <p className="text-white font-bold text-lg">
              {catchData.length ? `${catchData.length}cm` : "N/A"}
            </p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <p className="text-gray-300 text-sm">Fish Type</p>
            <p className="text-white font-bold text-lg">{catchData.fishType}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <p className="text-gray-300 text-sm">Bait</p>
            <p className="text-white font-bold text-lg">{catchData.bait}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6 py-4 border-t border-gray-700/50">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isLiked
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            <span className="font-medium">{likes}</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 rounded-lg transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">{catchData.comments.length}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <CommentsSection comments={catchData.comments} />
    </div>
  );
};

export default CatchDetails;
