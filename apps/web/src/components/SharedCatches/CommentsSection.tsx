import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MessageCircle, Send, Edit2, Trash2, Check, X } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    username: string;
    avatar: string | null;
  };
  createdAt: string;
  updatedAt?: string;
}

interface CommentsSectionProps {
  comments: Comment[];
  catchId: string;
  currentUserId?: string;
  onCommentsUpdate?: (comments: Comment[]) => void;
}

const CommentsSection = ({
  comments: initialComments,
  catchId,
  currentUserId,
  onCommentsUpdate,
}: CommentsSectionProps) => {
  const [comments, setComments] = useState(initialComments);

  // Reset comments when catch changes
  useEffect(() => {
    setComments(initialComments);
  }, [catchId, initialComments]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Use the passed currentUserId or fallback to Dev user ID
  const userId = currentUserId || "cmfay435q0000z55h4mwyfb33";

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/catches/${catchId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedComments = [...comments, data.comment];
        setComments(updatedComments);
        onCommentsUpdate?.(updatedComments);
        setNewComment("");
      } else {
        console.error("Failed to create comment");
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = (commentId: string, currentContent: string) => {
    setEditingComment(commentId);
    setEditContent(currentContent);
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim() || isEditing) return;

    setIsEditing(true);
    try {
      const response = await fetch(
        `/api/catches/${catchId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: editContent }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const updatedComments = comments.map((comment) =>
          comment.id === commentId ? data.comment : comment
        );
        setComments(updatedComments);
        onCommentsUpdate?.(updatedComments);
        setEditingComment(null);
        setEditContent("");
      } else {
        console.error("Failed to update comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (isDeleting) return;

    setIsDeleting(commentId);
    try {
      const response = await fetch(
        `/api/catches/${catchId}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const updatedComments = comments.filter(
          (comment) => comment.id !== commentId
        );
        setComments(updatedComments);
        onCommentsUpdate?.(updatedComments);
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent("");
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
                    disabled={!newComment.trim() || isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send
                      className={`w-4 h-4 ${isSubmitting ? "animate-pulse" : ""}`}
                    />
                    <span>{isSubmitting ? "Posting..." : "Comment"}</span>
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
                <div key={comment.id} className="flex gap-3 group">
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
                        {comment.updatedAt &&
                          comment.updatedAt !== comment.createdAt && (
                            <span className="text-gray-500"> (edited)</span>
                          )}
                      </span>
                    </div>

                    {editingComment === comment.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none text-sm"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveEdit(comment.id)}
                            disabled={!editContent.trim() || isEditing}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            <span>{isEditing ? "Saving..." : "Save"}</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={isEditing}
                            className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <X className="w-3 h-3" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <p className="text-gray-300 text-sm leading-relaxed flex-1">
                          {comment.content}
                        </p>
                        {comment.user.id === userId && (
                          <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() =>
                                handleEditComment(comment.id, comment.content)
                              }
                              className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                              title="Edit comment"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              disabled={isDeleting === comment.id}
                              className="p-1 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete comment"
                            >
                              <Trash2
                                className={`w-3 h-3 ${isDeleting === comment.id ? "animate-pulse" : ""}`}
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
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
