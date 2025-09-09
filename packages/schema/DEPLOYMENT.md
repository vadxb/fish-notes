# Fresh Deployment Guide

This guide helps you deploy the Fish Notes project to Vercel from scratch.

## Prerequisites

1. **Database Setup**: Ensure your database is set up and accessible
2. **Environment Variables**: Configure your `.env` file with database connection
3. **Prisma Schema**: The schema is already aligned to the final version

## Fresh Deployment Steps

### 1. Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (creates all tables)
npx prisma db push
```

### 2. Seed Initial Data

```bash
# Run the fresh deployment seed (includes everything)
npm run seed-fresh
```

This will create:

- Belarus as the only country
- Fish species native to Belarus
- Baits commonly used in Belarus
- Water bodies in Belarus
- 2 default users (dev@email.com, dev2@email.com)
- All users assigned to Belarus

### 3. Verify Deployment

- Login with `dev@email.com` / `12345678`
- Login with `dev2@email.com` / `12345678`
- Check that all data is properly loaded

## Future Data Additions

You can add more data using individual seed scripts:

### Add More Countries

```bash
npm run seed-countries
```

### Add More Fish Species

```bash
npm run seed-fish
```

### Add More Baits

```bash
npm run seed-baits
```

### Add More Water Bodies

```bash
npm run seed-water-bodies
```

### Add Test Users (for development)

```bash
npm run seed-test-users
```

## Available Scripts

| Script                      | Description                     |
| --------------------------- | ------------------------------- |
| `npm run seed-fresh`        | Complete fresh deployment seed  |
| `npm run seed-countries`    | Seed countries only             |
| `npm run seed-fish`         | Seed fish species only          |
| `npm run seed-baits`        | Seed baits only                 |
| `npm run seed-water-bodies` | Seed water bodies only          |
| `npm run seed-test-users`   | Seed test users for development |

## Database Schema

The current schema includes:

- **User** model with theme support
- **Country** model (Belarus only)
- **Fish** model with country relationship
- **Bait** model with country relationship
- **WaterBody** model with country relationship
- **Spot** model with coordinates and favorites
- **Catch** model with photos and sharing
- **FishEvent** model for competitions
- **Like** and **Comment** models for social features

## Environment Variables

Ensure these are set in your Vercel environment:

```
DATABASE_URL=your_database_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_vercel_app_url
```

## Troubleshooting

### If seeding fails:

1. Check database connection
2. Ensure Prisma client is generated
3. Verify environment variables
4. Check database permissions

### If users can't login:

1. Verify users were created: `npx prisma studio`
2. Check password hashing
3. Verify authentication configuration

### If data is missing:

1. Run individual seed scripts
2. Check country relationships
3. Verify foreign key constraints
