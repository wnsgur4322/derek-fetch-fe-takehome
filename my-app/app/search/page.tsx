"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import MatchingCartModal from "@/app/components/MatchingCart";
import { pages } from "next/dist/build/templates/app-page";

export default function Search() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [favorites, setFavorites] = useState<Dog[]>([]);
  const [total, setTotal] = useState(0); // total number of results
  const [page, setPage] = useState(1); // current page
  const [pageSize, setPageSize] = useState(25); // page size
  const [sortField, setSortField] = useState<"breed" | "name" | "age">("breed"); // default sorting field
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // default sorting order
  const [ageMin, setAgeMin] = useState<number | undefined>(undefined);
  const [ageMax, setAgeMax] = useState<number | undefined>(undefined);

  const [zipCode, setZipCode] = useState<number | undefined>(undefined); // temp until fix dogs/search API
  const [city, setCity] = useState(""); // New state for city
  const [state, setState] = useState(""); // New state for state
  // const [zipCodes, setZipCodes] = useState<string[]>([]); // Zip codes fetched based on city and state

  const router = useRouter();

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await axios.get(
          "https://frontend-take-home-service.fetch.com/dogs/breeds",
          { withCredentials: true }
        );
        setBreeds(response.data);
      } catch (error) {
        console.error("Failed to fetch breeds", error);
      }
    };

    fetchBreeds();
  }, []);

  // const fetchZipCodes = async () => {
  //   if (!city && !state) {
  //     setZipCodes([]);
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       "https://frontend-take-home-service.fetch.com/locations/search",
  //       {
  //         city,
  //         states: state ? [state] : undefined,
  //       },
  //       { withCredentials: true }
  //     );
  //     const fetchedZipCodes = response.data.results.map(
  //       (location: { zip_code: string }) => location.zip_code
  //     );
  //     setZipCodes(fetchedZipCodes);
  //   } catch (error) {
  //     console.error("Failed to fetch zip codes", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchZipCodes();
  // }, [city, state]);

  const fetchDogs = async (breed = "", page = 1, pageSize = 25) => {
    try {
      // fetch dog IDs from the search API
      const from = (page - 1) * pageSize; // calculate the starting index

      // create query parameters
      let queryParams = `size=${pageSize}&from=${from}&sort=${sortField}:${sortOrder}`;
      if (breed) queryParams += `&breeds=${breed}`;
      if (zipCode) queryParams += `&zipCodes=${zipCode}`;
      if (ageMin !== undefined) queryParams += `&ageMin=${ageMin}`;
      if (ageMax !== undefined) queryParams += `&ageMax=${ageMax}`;
      // if (zipCodes.length > 0) queryParams += `&zipCodes=${zipCodes.join(",")}`; commenting until fix dogs/search API

      // fetching dog ids
      const searchResponse = await axios.get(
        `https://frontend-take-home-service.fetch.com/dogs/search?${queryParams}`,
        { withCredentials: true }
      );
  
      const dogIds = searchResponse.data.resultIds as string[];
      setTotal(searchResponse.data.total); // get total number of results
  
      // fetch detailed dog data using the dog IDs
      if (dogIds.length > 0) {
        const dogsResponse = await axios.post<Dog[]>(
          "https://frontend-take-home-service.fetch.com/dogs",
          dogIds, // send the list of dog IDs as request body
          { withCredentials: true }
        );
        setDogs(dogsResponse.data); // get dog meta data
      } else {
        setDogs([]); // No dogs found
      }
    } catch (error) {
      console.error("Failed to fetch dogs", error);
    }
  };
  

  useEffect(() => {
    fetchDogs(selectedBreed, page, pageSize);
  }, [page, pageSize]);

  const toggleFavorite = (dog: Dog) => {
    setFavorites((prev) =>
      prev.some((fav) => fav.id === dog.id)
        ? prev.filter((fav) => fav.id !== dog.id)
        : [...prev, dog]
    );
  };

  const handleMatch = async () => {
    try {
      const response = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs/match",
        favorites.map((dog) => dog.id),
        { withCredentials: true }
      );
      const matchId = response.data.match;
  
      // Redirect to the match page with the match ID
      router.push(`/match?matchId=${matchId}`);
    } catch (error) {
      console.error("Failed to match", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search Dogs</h1>
        <div className="flex flex-wrap md:flex-row gap-4 mb-2 items-center bg-background p-4 rounded-md shadow-md">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1" htmlFor="breed">
              Breed
            </label>
            <select
              value={selectedBreed}
              onChange={(e) => setSelectedBreed(e.target.value)}
              className="p-2 rounded border text-black focus:ring focus:ring-blue-500"
            >
              <option value="">All Breeds</option>
              {breeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1" htmlFor="sortField">
            Sort By
            </label>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as "breed" | "name" | "age")}
              className="p-2 rounded border text-black focus:ring focus:ring-blue-500"
            >
              <option value="breed">Breed</option>
              <option value="name">Name</option>
              <option value="age">Age</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1" htmlFor="sortOrder">
              Sort Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="p-2 rounded border text-black focus:ring focus:ring-blue-500"
            >
              <option value="asc">Sort: A-Z</option>
              <option value="desc">Sort: Z-A</option>
            </select>
          </div>
          {/* <div className="flex flex-col">
            <label className="text-sm font-medium mb-1" htmlFor="city">
              City
            </label>
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="p-2 rounded border text-black focus:ring focus:ring-blue-500 appearance-none placeholder-gray-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1" htmlFor="state">
              State
            </label>
            <input
              type="text"
              placeholder="State (e.g., CA)"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="p-2 rounded border text-black focus:ring focus:ring-blue-500 appearance-none placeholder-gray-500"
            />
          </div> */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1" htmlFor="zipCode">
              Zip Code
            </label>
            <input
              type="number"
              placeholder="Zip Code"
              value={zipCode !== undefined ? zipCode : ""}
              onChange={(e) => {
                const value = e.target.value;
                setZipCode(value === "" ? undefined : Number(value));
              }}
              className="p-2 rounded border text-black focus:ring focus:ring-blue-500 appearance-none placeholder-gray-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1" htmlFor="minAge">
              Min Age
            </label>
            <input
              type="number"
              placeholder="Min Age"
              min={0}
              value={ageMin !== undefined ? ageMin : ""}
              onChange={(e) => {
                const value = e.target.value;
                setAgeMin(value === "" ? undefined : Number(value));
              }}
              className="p-2 rounded border text-black focus:ring focus:ring-blue-500 appearance-none placeholder-gray-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1" htmlFor="maxAge">
              Max Age
            </label>
            <input
              type="number"
              placeholder="Max Age"
              min={0}
              value={ageMax !== undefined ? ageMax : ""}
              onChange={(e) => {
                const value = e.target.value;
                setAgeMax(value === "" ? undefined : Number(value));
              }}
              className="p-2 rounded border text-black focus:ring focus:ring-blue-500 appearance-none placeholder-gray-500"
            />
          </div>
          {/* Search Button */}
          <div className="flex flex-col justify-end">
          <label className="text-sm font-medium mb-1 text-background" htmlFor="maxAge">
              Search
            </label>
            <button
              onClick={() => fetchDogs(selectedBreed, page, pageSize)}
              className="bg-highlight text-white py-2 px-4 rounded-md shadow-md hover:bg-highlight hover:opacity-90 focus:outline-none focus:ring focus:ring-blue-500"
            >
              Search
            </button>
          </div>
        </div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm">
          Showing {pageSize} results per page (Total: {total} results)
        </p>
        <div className="flex space-x-2">
          {[10, 25, 50].map((size) => (
            <button
              key={size}
              onClick={() => {
                setPageSize(size); // Update pageSize
                setPage(1); // Reset to page 1 when changing page size
              }}
              className={`px-3 py-1 rounded ${
                pageSize === size
                  ? "bg-background text-white hover:opacity-90"
                  : "bg-gray-200 text-black hover:bg-background hover:text-white"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {dogs.map((dog) => (
          <div key={dog.id} className="max-w-full rounded overflow-hidden shadow-xl bg-background">
            <img src={dog.img} alt={dog.name} className="w-full h-60 object-cover" />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2 text-white">{dog.name}</div>
              <p className="text-gray-300 text-base">
                Breed: {dog.breed} <br />
                Age: {dog.age} <br />
                Zip Code: {dog.zip_code}
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <button
                onClick={() => toggleFavorite(dog)}
                className={`flex items-center justify-center w-full rounded-md px-4 py-2 font-semibold shadow ${
                  favorites.includes(dog)
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-highlight text-white hover:bg-white hover:text-highlight"
                }`}
              >
                {favorites.some((fav) => fav.id === dog.id)
                  ? "Unfavorite"
                  : "Favorite"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1 || totalPages === 0}
          className={`px-4 py-2 rounded ${
            page === 1 || totalPages === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-highlight text-white hover:opacity-90"
          }`}
        >
          Previous
        </button>
        <p className="text-center">
          Page {page} of {totalPages}
        </p>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || totalPages === 0}
          className={`px-4 py-2 rounded ${
            page === totalPages || totalPages === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-highlight text-white hover:opacity-90"
          }`}
        >
          Next
        </button>
      </div>

      {/* Shopping Cart Modal */}
      <MatchingCartModal
        favorites={favorites}
        onRemoveFavorite={(id) =>
          setFavorites((prev) => prev.filter((dog) => dog.id !== id))
        }
        onFindMatch={handleMatch}
        isMatchDisabled={favorites.length === 0}
      />
    </div>
  );
}