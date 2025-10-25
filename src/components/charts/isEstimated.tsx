/**
 * Checks if a data point is marked as estimated.
 *
 * This works with two formats of chart data:
 * 1. An object containing a `raw` object with an `estimate` property
 * 2. An object containing a `raw` array where the 3rd element (index 2) indicates estimation
 *
 * @param point - The chart point object
 * @returns true if the point is estimated, false otherwise
 */
export function isEstimated(point: object | (object & { raw: unknown })) {
  return (
    // Case 1: raw is an object containing an `estimate` boolean
    ("raw" in point &&
      typeof point.raw === "object" &&
      "estimate" in point.raw! &&
      point.raw.estimate) ||
    // Case 2: raw is an array and the 3rd element is truthy
    ("raw" in point && Array.isArray(point.raw) && point.raw[2])
  );
}
