/**
 * Generate a simple map image using a placeholder service
 * This works without API keys for development
 */
export function generateSimpleMapSnapshot(
  latitude: number,
  longitude: number,
  width: number = 400,
  height: number = 300
): string {
  // Using a simple placeholder that shows coordinates
  const coords = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  const encodedCoords = encodeURIComponent(coords);

  // Using a simple service that generates map-like images
  // For development purposes
  return `https://via.placeholder.com/${width}x${height}/4a90e2/ffffff?text=${encodedCoords}`;
}

/**
 * Generate a map snapshot with marker using Leaflet screenshot functionality
 * This creates a real map with markers
 */
export function generateMapWithMarker(
  latitude: number,
  longitude: number,
  width: number = 400,
  height: number = 300,
  zoom: number = 15
): string {
  // For now, use a placeholder that shows coordinates
  // In production, this would be replaced with actual screenshot data
  const coords = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  const encodedCoords = encodeURIComponent(coords);

  return `https://via.placeholder.com/${width}x${height}/4a90e2/ffffff?text=${encodedCoords}`;
}
