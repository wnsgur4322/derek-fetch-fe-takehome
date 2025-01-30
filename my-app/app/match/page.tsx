"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { Dog } from "@/app/types";

function MatchContent() {
  const searchParams = useSearchParams();
  const matchId = searchParams.get("matchId"); // get the matchId from query params
  const [dog, setDog] = useState<Dog | null>(null);

   const router = useRouter();

  useEffect(() => {
    const fetchMatchedDog = async () => {
      if (!matchId) {
        console.error("Match ID is missing");
        alert("Error: Match ID is missing");
        router.push(`/search`); // redirect to search page if matchId is missing
        return
      }
      try {
        const response = await axios.post<Dog[]>(
          "https://frontend-take-home-service.fetch.com/dogs",
          [matchId],
          { withCredentials: true }
        );
        setDog(response.data[0]); // fetch dog info
      } catch (error) {
        console.error("Failed to fetch matched dog", error);
      }
    };

    fetchMatchedDog();
  }, [matchId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">🎉 Your Match 🎉</h1>
      {dog ? (
        <div key={dog.id} className="w-sm rounded overflow-hidden shadow-xl bg-background">
            <Fireworks autorun={{ speed: 3 }} />
            <img src={dog.img} alt={dog.name} className="w-full h-60 object-cover" />
            <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2 text-white">{dog.name}</div>
            <p className="text-gray-300 text-base">
                Breed: {dog.breed} <br />
                Age: {dog.age} <br />
                Zip Code: {dog.zip_code}
            </p>
            </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading match...</p>
      )}
    </div>
  );
}

export default function MatchPage() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <MatchContent />
      </Suspense>
    );
  }
