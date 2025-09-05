import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const medals = ["🥇", "🥈", "🥉"];

interface LeaderboardEntryProps {
  rank: number;
  username: string;
  avatar: string | null;
  stat: string;
  userId?: string;
}

const LeaderboardEntry = ({
  rank,
  username,
  avatar,
  stat,
  userId,
}: LeaderboardEntryProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (userId) {
      router.push(`/shared-catches?user=${userId}`);
    }
  };

  return (
    <div
      className={`flex items-center gap-2 bg-black/20 rounded-lg px-2 py-1 hover:bg-black/30 transition-colors duration-200 ${
        userId ? "cursor-pointer hover:shadow-lg" : ""
      }`}
      onClick={handleClick}
    >
      {rank <= 3 ? (
        <span className="text-xl">{medals[rank - 1]}</span>
      ) : (
        <span className="text-sm text-white/60 font-bold w-6 text-center">
          {rank}
        </span>
      )}
      <div className="w-8 h-8 rounded-full border-2 border-white shadow-md overflow-hidden">
        {avatar ? (
          <Image
            src={avatar}
            alt={username}
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <span className="text-white font-medium flex-1">{username}</span>
      <span className="text-white font-semibold">{stat}</span>
    </div>
  );
};

export default LeaderboardEntry;
