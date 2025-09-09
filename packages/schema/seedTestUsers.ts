import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function seedTestUsers() {
  try {
    // Get Belarus country (since it's the only one with data)
    const belarus = await prisma.country.findUnique({
      where: { name: "Belarus" },
    });
    if (!belarus) {
      throw new Error(
        "Belarus country not found. Please run seedCountries first."
      );
    }

    // Get Belarus fish species for catches
    const fishes = await prisma.fish.findMany({
      where: { countryId: belarus.id },
    });
    if (fishes.length === 0) {
      throw new Error(
        "No Belarus fish species found. Please run seedFish first."
      );
    }

    // Get Belarus baits for catches
    const baits = await prisma.bait.findMany({
      where: { countryId: belarus.id },
    });
    if (baits.length === 0) {
      throw new Error("No Belarus baits found. Please run seedBaits first.");
    }

    // Get Belarus water bodies for spots
    const waterBodies = await prisma.waterBody.findMany({
      where: { countryId: belarus.id },
    });
    if (waterBodies.length === 0) {
      throw new Error(
        "No Belarus water bodies found. Please run seedWaterBodies first."
      );
    }

    const users = [];
    const spots = [];
    const events = [];
    const catches = [];
    const likes = [];
    const comments = [];

    // Generate 50 test users (all assigned to Belarus)
    const hashedPassword = await bcrypt.hash("12345678", 10);

    for (let i = 3; i <= 52; i++) {
      const user = {
        name: `User${i}`,
        username: `User${i}`,
        email: `dev${i}@email.com`,
        password: hashedPassword,
        subscription: "premium",
        countryId: belarus.id,
      };
      users.push(user);
    }

    await prisma.user.createMany({
      data: users,
    });

    // Fetch the created users to get their actual IDs
    const createdUsers = await prisma.user.findMany({
      where: {
        email: {
          startsWith: "dev",
        },
      },
    });

    // Generate spots for each user (2-3 per user)
    for (const user of createdUsers) {
      const spotCount = Math.floor(Math.random() * 2) + 2; // 2-3 spots

      for (let j = 0; j < spotCount; j++) {
        const waterBody =
          waterBodies[Math.floor(Math.random() * waterBodies.length)];
        const spot = {
          name: `${user.username}'s Spot ${j + 1}`,
          latitude: waterBody.latitude + (Math.random() - 0.5) * 0.01, // Small variation
          longitude: waterBody.longitude + (Math.random() - 0.5) * 0.01,
          notes: `Great fishing spot discovered by ${user.username}. ${j === 0 ? "Prime location with deep water." : j === 1 ? "Shallow area perfect for beginners." : "Hidden gem with excellent structure."}`,
          isFavorite: Math.random() > 0.5,
          mapImageUrl: null,
          coordinates: [
            {
              lat: waterBody.latitude + (Math.random() - 0.5) * 0.01,
              lng: waterBody.longitude + (Math.random() - 0.5) * 0.01,
              name: `Marker ${j + 1}`,
            },
          ],
          userId: user.id,
          createdAt: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
          ), // Random date within last 30 days
        };
        spots.push(spot);
      }
    }

    await prisma.spot.createMany({
      data: spots,
    });

    // Generate events for each user (2-3 per user)
    for (const user of createdUsers) {
      const eventCount = Math.floor(Math.random() * 2) + 2; // 2-3 events
      const userSpots = spots.filter((spot) => spot.userId === user.id);

      for (let j = 0; j < eventCount; j++) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
        startDate.setHours(
          6 + Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 60),
          0,
          0
        ); // Random time 6 AM - 6 PM

        const endDate = new Date(startDate);
        endDate.setHours(
          startDate.getHours() + Math.floor(Math.random() * 8) + 2
        ); // 2-10 hours duration

        const event = {
          title: `${user.username}'s Fishing Trip ${j + 1}`,
          notes: `Fishing session at ${userSpots[j % userSpots.length]?.name || "Unknown Spot"}. ${j === 0 ? "Early morning session with great results." : j === 1 ? "Afternoon fishing with friends." : "Evening session with perfect weather."}`,
          startAt: startDate,
          endAt: endDate,
          locationType: "spot",
          locationText:
            userSpots[j % userSpots.length]?.name || "Unknown Location",
          spotId: userSpots[j % userSpots.length]?.id || null,
          selectedMarkerIndexes: [0],
          userId: user.id,
          createdAt: new Date(
            startDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ), // Created 0-7 days before event
        };
        events.push(event);
      }
    }

    await prisma.fishEvent.createMany({
      data: events,
    });

    // Fetch the created events to get their actual IDs
    const createdEvents = await prisma.fishEvent.findMany({
      where: {
        userId: {
          in: createdUsers.map((u) => u.id),
        },
      },
    });

    // Use existing fish images from public/fishes directory
    const fishImages = [
      "/fishes/asp.png",
      "/fishes/bream.png",
      "/fishes/carp.png",
      "/fishes/crucian.png",
      "/fishes/eel.png",
      "/fishes/gudgeon.png",
      "/fishes/perch.png",
      "/fishes/pike.png",
      "/fishes/roach.png",
      "/fishes/trout.png",
      "/fishes/zander.png",
    ];

    // Generate catches for each user (2-3 per user)
    for (const user of createdUsers) {
      const catchCount = Math.floor(Math.random() * 2) + 2; // 2-3 catches
      const userEvents = createdEvents.filter(
        (event) => event.userId === user.id
      );

      for (let j = 0; j < catchCount; j++) {
        const fish = fishes[Math.floor(Math.random() * fishes.length)];
        const bait = baits[Math.floor(Math.random() * baits.length)];
        const event = userEvents[j % userEvents.length];

        const catchDate = new Date(event.startAt);
        catchDate.setHours(
          event.startAt.getHours() +
            Math.floor(
              Math.random() *
                (event.endAt.getHours() - event.startAt.getHours())
            )
        );

        // Select unique fish images for each catch
        const numImages = Math.floor(Math.random() * 3) + 1; // 1-3 images
        const selectedImages = [];
        const availableImages = [...fishImages]; // Create a copy to avoid modifying original array

        for (let i = 0; i < numImages && availableImages.length > 0; i++) {
          // Select random fish image from available images
          const randomIndex = Math.floor(
            Math.random() * availableImages.length
          );
          const selectedImage = availableImages[randomIndex];
          selectedImages.push(selectedImage);

          // Remove selected image to ensure uniqueness within this catch
          availableImages.splice(randomIndex, 1);
        }

        const catchData = {
          species: fish.commonName,
          weight: Math.round((Math.random() * 5 + 0.5) * 10) / 10, // 0.5-5.5 kg
          bait: bait.commonName,
          comments: `Caught this ${fish.commonName} using ${bait.commonName}. ${j === 0 ? "Great fight!" : j === 1 ? "Perfect weather conditions." : "Amazing catch!"}`,
          photoUrls: selectedImages,
          isShared: true, // All catches are shared
          location: event.spotId
            ? spots.find((s) => s.id === event.spotId)?.name ||
              "Unknown Location"
            : "Unknown Location",
          spotId: event.spotId || null,
          userId: user.id,
          eventId: event.id,
          createdAt: catchDate,
        };
        catches.push(catchData);
      }
    }

    await prisma.catch.createMany({
      data: catches,
    });

    // Fetch the created catches to get their actual IDs
    const createdCatches = await prisma.catch.findMany({
      where: {
        userId: {
          in: createdUsers.map((u) => u.id),
        },
      },
    });

    // Generate likes and comments for shared catches
    const sharedCatches = createdCatches.filter((c) => c.isShared);

    for (const catchData of sharedCatches) {
      // Generate 3-8 likes per catch from random users
      const likeCount = Math.floor(Math.random() * 6) + 3;
      const likers = createdUsers
        .filter((u) => u.id !== catchData.userId)
        .sort(() => 0.5 - Math.random())
        .slice(0, likeCount);

      for (const liker of likers) {
        likes.push({
          userId: liker.id,
          catchId: catchData.id,
          createdAt: new Date(
            catchData.createdAt.getTime() +
              Math.random() * 7 * 24 * 60 * 60 * 1000
          ), // Within 7 days of catch
        });
      }

      // Generate 2-5 comments per catch from random users
      const commentCount = Math.floor(Math.random() * 4) + 2;
      const commenters = createdUsers
        .filter((u) => u.id !== catchData.userId)
        .sort(() => 0.5 - Math.random())
        .slice(0, commentCount);

      const commentTexts = [
        "Nice catch! 🎣",
        "What a beauty!",
        "Great fishing spot!",
        "Amazing! What bait did you use?",
        "Perfect weather for fishing!",
        "That's a monster!",
        "Well done! 👏",
        "Incredible catch!",
        "What a fight that must have been!",
        "Beautiful fish!",
      ];

      for (let k = 0; k < commentCount; k++) {
        comments.push({
          content:
            commentTexts[Math.floor(Math.random() * commentTexts.length)],
          userId: commenters[k].id,
          catchId: catchData.id,
          createdAt: new Date(
            catchData.createdAt.getTime() +
              Math.random() * 7 * 24 * 60 * 60 * 1000
          ), // Within 7 days of catch
        });
      }
    }

    await prisma.catchLike.createMany({
      data: likes,
    });

    await prisma.catchComment.createMany({
      data: comments,
    });
  } catch (error) {
    console.error("Error seeding test users:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedTestUsers();
