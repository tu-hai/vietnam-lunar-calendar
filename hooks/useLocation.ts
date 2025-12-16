import { useState, useEffect } from "react";
import * as Location from "expo-location";

export const useLocation = () => {
  const [location, setLocation] = useState<string>("Đang tải...");
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Request location permission
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission denied, using default location");
          setLocation("Đà Nẵng, Việt Nam");
          setCoordinates({ latitude: 16.0544, longitude: 108.2022 }); // Da Nang coordinates
          return;
        }

        // Get current position
        let currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;
        setCoordinates({ latitude, longitude });

        // Reverse geocode to get city name
        let reverseGeocode = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (reverseGeocode.length > 0) {
          const city = reverseGeocode[0].city || reverseGeocode[0].region || reverseGeocode[0].country || "Đà Nẵng";
          setLocation(city);
        }
      } catch (error) {
        console.log("Error getting location:", error);
        // Fallback to Da Nang
        setLocation("Đà Nẵng, Việt Nam");
        setCoordinates({ latitude: 16.0544, longitude: 108.2022 });
      }
    })();
  }, []);

  return { location, coordinates };
};
