"use client";

/**
 * Calculate distance and duration between two places using the Google Maps
 * Distance Matrix Service.  Requires the google.maps script to be loaded.
 *
 * @param {string} origin  – place name / address
 * @param {string} destination – place name / address
 * @returns {Promise<{distance_km: number, duration_min: number}>}
 */
export function calculateDistance(origin, destination) {
  return new Promise((resolve, reject) => {
    if (!window.google?.maps) {
      return reject(new Error("Google Maps not loaded"));
    }

    const service = new window.google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status !== "OK") {
          return reject(new Error(`Distance Matrix failed: ${status}`));
        }

        const element = response.rows[0]?.elements[0];
        if (!element || element.status !== "OK") {
          return reject(
            new Error(`No route found: ${element?.status || "UNKNOWN"}`)
          );
        }

        resolve({
          distance_km: parseFloat((element.distance.value / 1000).toFixed(1)),
          duration_min: Math.round(element.duration.value / 60),
        });
      }
    );
  });
}
