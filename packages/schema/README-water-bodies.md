# Water Bodies Data Collection Script

This script collects water body data from OpenStreetMap using the Overpass API and stores it in the database.

## Features

- **Overpass API Integration**: Fetches real water body data from OpenStreetMap
- **Fallback to Sample Data**: Uses sample data when Overpass API doesn't return results
- **Multiple Water Types**: Supports lakes, rivers, streams, marinas, etc.
- **Error Handling**: Robust error handling and logging
- **Database Integration**: Stores data in the WaterBody table

## Usage

### Test Data Collection (without saving to database)

```bash
npm run test-water-bodies
```

### Seed Database with Water Bodies

```bash
npm run seed-water-bodies
```

### Direct Script Execution

```bash
# Test mode
npx tsx seedWaterBodies.ts test

# Seed mode
npx tsx seedWaterBodies.ts seed
```

## Configuration

### Overpass Query

The script uses a custom Overpass query to fetch water bodies from Belarus:

```overpass
[out:json][timeout:25];
(
  node["natural"="water"]["name"](51.0,23.0,56.5,33.0);
  way["natural"="water"]["name"](51.0,23.0,56.5,33.0);
  relation["natural"="water"]["name"](51.0,23.0,56.5,33.0);
  node["waterway"="river"]["name"](51.0,23.0,56.5,33.0);
  way["waterway"="river"]["name"](51.0,23.0,56.5,33.0);
  node["waterway"="stream"]["name"](51.0,23.0,56.5,33.0);
  way["waterway"="stream"]["name"](51.0,23.0,56.5,33.0);
  node["leisure"="marina"]["name"](51.0,23.0,56.5,33.0);
  way["leisure"="marina"]["name"](51.0,23.0,56.5,33.0);
);
out center;
```

### Bounding Box

- **Area**: Belarus
- **Coordinates**: 51.0,23.0,56.5,33.0 (south,west,north,east)

### Sample Data

When Overpass API doesn't return results, the script uses sample data:

1. **Lake Naroch** (lake) - Minsk Region
2. **Svisloch River** (river) - Minsk Region
3. **Berezina River** (river) - Gomel Region
4. **Lake Braslav** (lake) - Vitebsk Region
5. **Neman River** (river) - Grodno Region

## Database Schema

The script inserts data into the `WaterBody` table:

```sql
CREATE TABLE WaterBody (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  country TEXT NOT NULL,
  region TEXT,
  geometry JSONB,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

- **API Failures**: Falls back to sample data
- **Rate Limiting**: Includes delays between requests
- **Invalid Data**: Skips invalid entries and continues
- **Database Errors**: Logs errors and continues processing

## Output

The script provides detailed logging:

- Number of elements fetched from Overpass API
- Sample data preview
- Processing progress
- Success/error counts
- Final summary

## Customization

To modify the script for different regions:

1. Update the bounding box coordinates in `overpassQuery`
2. Modify the `country` field in the database insert
3. Adjust the sample data if needed
4. Update the water type detection logic if required
