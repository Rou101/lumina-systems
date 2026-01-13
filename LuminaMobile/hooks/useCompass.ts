import { useState, useEffect } from 'react';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';

type CompassData = {
    heading: number;    // Where phone is pointing (0-360)
    bearing: number;    // Where target is (0-360)
    delta: number;      // Difference (Rotation needed)
    distance: number;   // Meters to target
    error: string | null;
};

// Convert degrees to radians
const toRad = (deg: number) => (deg * Math.PI) / 180;
// Convert radians to degrees
const toDeg = (rad: number) => (rad * 180) / Math.PI;

export function useCompass(targetLat: number, targetLng: number): CompassData {
    const [heading, setHeading] = useState(0);
    const [bearing, setBearing] = useState(0);
    const [distance, setDistance] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let magSubscription: any;
        let locSubscription: any;

        const startTracking = async () => {
            // 1. Permissions
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Location permission denied');
                return;
            }

            // 2. Location Tracking
            locSubscription = await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 5 },
                (loc) => {
                    const { latitude: lat1, longitude: lon1 } = loc.coords;

                    // Calculate Bearing (Forward Azimuth)
                    const y = Math.sin(toRad(targetLng - lon1)) * Math.cos(toRad(targetLat));
                    const x = Math.cos(toRad(lat1)) * Math.sin(toRad(targetLat)) -
                        Math.sin(toRad(lat1)) * Math.cos(toRad(targetLat)) * Math.cos(toRad(targetLng - lon1));

                    let brng = toDeg(Math.atan2(y, x));
                    brng = (brng + 360) % 360; // Normalize to 0-360

                    setBearing(brng);

                    // Calculate Distance (Haversine simple approximation for short distances or standard)
                    // R = 6371e3 meters
                    const R = 6371e3;
                    const φ1 = toRad(lat1);
                    const φ2 = toRad(targetLat);
                    const Δφ = toRad(targetLat - lat1);
                    const Δλ = toRad(targetLng - lon1);

                    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                        Math.cos(φ1) * Math.cos(φ2) *
                        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    const d = R * c;

                    setDistance(Math.round(d));
                }
            );

            // 3. Magnetometer Tracking
            Magnetometer.setUpdateInterval(100);
            magSubscription = Magnetometer.addListener((data) => {
                // Simple Heading (assuming flat device for MVP)
                // Ideally use rotation matrix from DeviceMotion for AR, but Magnetometer is simpler for MVP Compass
                let { x, y } = data;
                // Heading Algo (Specific to certain device orientations, simplified here)
                let angle = Math.atan2(y, x);
                angle = angle * (180 / Math.PI);
                angle = angle + 90; // Calibration
                angle = (angle + 360) % 360;

                // Invert for UI rotation usually
                setHeading(Math.round(angle));
            });
        };

        startTracking();

        return () => {
            magSubscription?.remove();
            locSubscription?.remove();
        };
    }, [targetLat, targetLng]);

    // Delta: How much to rotate the arrow. 
    // If Bearing is 90 (East) and Heading is 0 (North), Arrow should rotate 90.
    // If Bearing is 90 and Heading is 90, Arrow should rotate 0 (straight ahead).
    const delta = (bearing - heading + 360) % 360;

    return { heading, bearing, delta, distance, error };
}
