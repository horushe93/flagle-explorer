/**
 * @license
 * Geo Calculation Algorithm
 * Copyright (c) 2025 horushe93
 * 
 * This work is licensed under the Creative Commons Attribution-NonCommercial 4.0
 * International License. To view a copy of this license, visit:
 * http://creativecommons.org/licenses/by-nc/4.0/
 * 
 * Requirements:
 * - Attribution — You must give appropriate credit, provide a link to the license,
 *   and indicate if changes were made.
 * - NonCommercial — You may not use the material for commercial purposes.
 */

import { GeoPoint } from './types';

/**
 * Calculate the distance between two geographical points in kilometers
 * @param point1 First geographical point
 * @param point2 Second geographical point
 */
export function calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
  if (point1.lat === point2.lat && point1.lon === point2.lon) {
    return 0;
  }
  const R = 6371000;
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLon = (point2.lon - point1.lon) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c / 1000;
}

/**
 * Calculate the bearing between two points and return it as an emoji
 * @param point1 Starting point coordinates
 * @param point2 Target point coordinates
 * @returns An emoji representing the direction
 */
export function calculateOrientationEmoji(point1: GeoPoint, point2: GeoPoint): string {
  const orientation = calculateOrientation(point1, point2);
  console.log('orientation:', orientation);
  
  // Return a circle marker if points are identical
  if (orientation === 0 || (point1.lat === point2.lat && point1.lon === point2.lon)) {
    return '🟢';
  }
  
  // Divide 360 degrees into 8 directions, each spanning 45 degrees
  // North: 337.5-22.5, Northeast: 22.5-67.5, East: 67.5-112.5, Southeast: 112.5-157.5
  // South: 157.5-202.5, Southwest: 202.5-247.5, West: 247.5-292.5, Northwest: 292.5-337.5
  if (orientation >= 337.5 || orientation < 22.5) {
    return '⬆️';  // North
  } else if (orientation >= 22.5 && orientation < 67.5) {
    return '↗️';  // Northeast
  } else if (orientation >= 67.5 && orientation < 112.5) {
    return '➡️';  // East
  } else if (orientation >= 112.5 && orientation < 157.5) {
    return '↘️';  // Southeast
  } else if (orientation >= 157.5 && orientation < 202.5) {
    return '⬇️';  // South
  } else if (orientation >= 202.5 && orientation < 247.5) {
    return '↙️';  // Southwest
  } else if (orientation >= 247.5 && orientation < 292.5) {
    return '⬅️';  // West
  } else {
    return '↖️';  // Northwest
  }
}

/**
 * Calculate the bearing angle between two geographical points in degrees
 * - Returns a value between 0-360 degrees, where 0 is North, 90 is East, 180 is South, and 270 is West
 * @param point1 Starting point coordinates
 * @param point2 Target point coordinates
 * @returns Bearing angle in degrees
 */
export function calculateOrientation(point1: GeoPoint, point2: GeoPoint): number {
  if (point1.lat === point2.lat && point1.lon === point2.lon) {
    return 0;
  }
  
  const lat1 = point1.lat * Math.PI / 180;
  const lat2 = point2.lat * Math.PI / 180;
  const dLon = (point2.lon - point1.lon) * Math.PI / 180;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - 
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
            
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
}

/**
 * Calculate the proximity percentage between two points. The closer the points,
 * the higher the percentage. The farther apart, the lower the percentage.
 * @param point1 First geographical point
 * @param point2 Second geographical point
 */
export function calculateGeoClosingPercent(point1: GeoPoint, point2: GeoPoint): number {
  // Calculate actual distance between points (km)
  const distance = calculateDistance(point1, point2);
  
  // The maximum distance between two points on Earth is between territories
  // of New Zealand and Spain, approximately 20,000 kilometers (20,037 km precisely)
  const MAX_DISTANCE = (20 * 1000);
  
  // Return 0% if distance exceeds maximum reference distance
  if (distance >= MAX_DISTANCE) {
    return 1;
  }
  
  // Return 100% if points are at the same location
  if (distance === 0) {
    return 100;
  }
  
  // Use linear interpolation to calculate percentage
  // Closer distance results in higher percentage
  const percent = ((MAX_DISTANCE - distance) / MAX_DISTANCE) * 100;
  
  // Ensure return value is between 0-100 and rounded to 2 decimal places
  return Math.max(0, Math.min(100, Number(percent.toFixed(2))));
}