import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Get users
  const user1 = await prisma.user.findFirst({
    where: { email: "dev@email.com" },
  });

  const user2 = await prisma.user.findFirst({
    where: { email: "dev2@email.com" },
  });

  if (!user1 || !user2) {
    return;
  }

  // Create some shared catches
  const catches = [
    {
      userId: user1.id,
      species: "Trout",
      weight: 2.5,
      bait: "Worm",
      location: "Mountain Lake",
      comments: "Caught this beautiful trout early morning!",
      isShared: true,
      photoUrls: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500",
      ],
    },
    {
      userId: user2.id,
      species: "Bass",
      weight: 3.2,
      bait: "Artificial Lure",
      location: "River Bend",
      comments: "Great catch with my new lure!",
      isShared: true,
      photoUrls: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500",
      ],
    },
    {
      userId: user1.id,
      species: "Pike",
      weight: 4.1,
      bait: "Live Fish",
      location: "Deep Lake",
      comments: "This pike put up quite a fight!",
      isShared: true,
      photoUrls: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500",
      ],
    },
  ];

  for (const catchData of catches) {
    const existingCatch = await prisma.catch.findFirst({
      where: {
        userId: catchData.userId,
        species: catchData.species,
        weight: catchData.weight,
      },
    });

    if (!existingCatch) {
      const newCatch = await prisma.catch.create({
        data: catchData,
      });
    } else {
    }
  }

  // Add some likes and comments
  const allCatches = await prisma.catch.findMany({
    where: { isShared: true },
  });

  if (allCatches.length > 0) {
    // User2 likes User1's catches
    for (const catchItem of allCatches.filter((c) => c.userId === user1.id)) {
      const existingLike = await prisma.catchLike.findFirst({
        where: {
          userId: user2.id,
          catchId: catchItem.id,
        },
      });

      if (!existingLike) {
        await prisma.catchLike.create({
          data: {
            userId: user2.id,
            catchId: catchItem.id,
          },
        });
      }
    }

    // Add some comments
    const commentData = [
      {
        userId: user2.id,
        catchId: allCatches[0].id,
        content: "Nice catch! What bait did you use?",
      },
      {
        userId: user1.id,
        catchId: allCatches[1].id,
        content: "Great job! That's a beautiful bass.",
      },
    ];

    for (const comment of commentData) {
      const existingComment = await prisma.catchComment.findFirst({
        where: {
          userId: comment.userId,
          catchId: comment.catchId,
          content: comment.content,
        },
      });

      if (!existingComment) {
        await prisma.catchComment.create({
          data: comment,
        });
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
