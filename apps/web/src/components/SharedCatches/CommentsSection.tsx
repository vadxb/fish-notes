import React, { useState } from "react";
import Image from "next/image";
import { MessageCircle, Send } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    username: string;
    avatar: string | null;
  };
  createdAt: string;
}

interface CommentsSectionProps {
  comments: Comment[];
}

const CommentsSection = ({ comments }: CommentsSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // TODO: Submit comment to API
      console.log("New comment:", newComment);
      setNewComment("");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="border-t border-gray-700/50">
      {/* Comments Header */}
      <div className="p-6">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="font-medium">
            {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
          </span>
        </button>
      </div>

      {showComments && (
        <div className="px-6 pb-6">
          {/* Add Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">U</span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Comment</span>
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-gray-600 overflow-hidden flex-shrink-0">
                    {comment.user.avatar ? (
                      <Image
                        src={comment.user.avatar}
                        alt={comment.user.username}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {comment.user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium text-sm">
                        {comment.user.username}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
