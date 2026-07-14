import { useEffect, useState, useRef } from "react";

export interface Driver {
  id: string;
  name: string;
  status: "active" | "idle" | "delayed";
  position: [number, number];
}

const generateInitialFleet = (count: number, center: [number, number]): Driver[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `driver-${i}`,
    name: `Driver #${1000 + i}`,
    status: i % 15 === 0 ? "delayed" : i % 5 === 0 ? "idle" : "active",
    position: [
      center[0] + (Math.random() - 0.5) * 0.1,
      center[1] + (Math.random() - 0.5) * 0.1,
    ],
  }));
};

export function useFleetStream() {
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [fleet, setFleet] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fleetRef = useRef<Driver[]>([]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setCenter(userCoords);
          fleetRef.current = generateInitialFleet(500, userCoords);
          setIsLoading(false);
        },
        () => {
          const fallbackCoords: [number, number] = [51.5074, -0.1278]; 
          setCenter(fallbackCoords);
          fleetRef.current = generateInitialFleet(500, fallbackCoords);
          setIsLoading(false);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (isLoading || !center) return;

    const streamInterval = setInterval(() => {
      fleetRef.current = fleetRef.current.map((driver) => ({
        ...driver,
        position: [
          driver.position[0] + (Math.random() - 0.5) * 0.0004,
          driver.position[1] + (Math.random() - 0.5) * 0.0004,
        ],
      }));
    }, 100);

    const uiInterval = setInterval(() => {
      setFleet([...fleetRef.current]);
    }, 400);

    return () => {
      clearInterval(streamInterval);
      clearInterval(uiInterval);
    };
  }, [isLoading, center]);

  return { fleet, center, isLoading };
}
