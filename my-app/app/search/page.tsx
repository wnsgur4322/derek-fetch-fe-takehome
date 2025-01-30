"use client";

import { useState, useEffect } from "react";
import axios from "axios";

// Define interfaces to algin with the API response
interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}
interface Location {
  zip_code: string
  latitude: number
  longitude: number
  city: string
  state: string
  county: string
}
interface Coordinates {
  lat: number;
  lon: number;
}


export default function Search() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [total, setTotal] = useState(0); // total number of results
  const [page, setPage] = useState(1); // current page
  const [pageSize, setPageSize] = useState(25); // page size
  const [sortField, setSortField] = useState<"breed" | "name" | "age">("breed"); // default sorting field
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // default sorting order
  const [zipCode, setZipCode] = useState("");
  const [ageMin, setAgeMin] = useState<number | undefined>(undefined);
  const [ageMax, setAgeMax] = useState<number | undefined>(undefined);

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

  const fetchDogs = async (breed = "", zipCode = "", ageMin?: number, ageMax?: number, page = 1, pageSize = 25, sortField = "breed", sort = "asc") => {
    try {
      // fetch dog IDs from the search API
      const from = (page - 1) * pageSize; // calculate the starting index

      // create query parameters
      let queryParams = `size=${pageSize}&from=${from}&sort=${sortField}:${sortOrder}`;
      if (breed) queryParams += `&breeds=${breed}`;
      if (zipCode) queryParams += `&zipCodes=${zipCode}`;
      if (ageMin !== undefined) queryParams += `&ageMin=${ageMin}`;
      if (ageMax !== undefined) queryParams += `&ageMax=${ageMax}`;

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
    fetchDogs(selectedBreed, zipCode, ageMin, ageMax, page, pageSize, sortField, sortOrder);
  }, [selectedBreed, zipCode, ageMin, ageMax, page, pageSize, sortField, sortOrder]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleMatch = async () => {
    try {
      const response = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs/match",
        favorites,
        { withCredentials: true }
      );
      alert(`Your match is dog ID: ${response.data.match}`);
    } catch (error) {
      console.error("Failed to match", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search Dogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        <div className="flex flex-col md:flex-row gap-4 mb-2 items-center bg-background p-4 rounded-md shadow-md">
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
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as "breed" | "name" | "age")}
            className="p-2 rounded border text-black focus:ring focus:ring-blue-500"
          >
            <option value="breed">Sort by Breed</option>
            <option value="name">Sort by Name</option>
            <option value="age">Sort by Age</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="p-2 rounded border text-black focus:ring focus:ring-blue-500"
          >
            <option value="asc">Sort: A-Z</option>
            <option value="desc">Sort: Z-A</option>
          </select>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-2 items-center bg-background p-4 rounded-md shadow-md">
          <input
            type="text"
            placeholder="Zip Code"
            value={zipCode}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) setZipCode(value); // Allow only numbers
            }}
            className="p-2 rounded border text-black focus:ring focus:ring-blue-500 placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="Min Age"
            value={ageMin}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) setAgeMin(Number(value)); // Allow only numbers
            }}
            className="p-2 rounded border text-black focus:ring focus:ring-blue-500 appearance-none placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="Max Age"
            value={ageMax}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) setAgeMax(Number(value)); // Allow only numbers
            }}
            className="p-2 rounded border text-black focus:ring focus:ring-blue-500 appearance-none placeholder-gray-500"
          />
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
                onClick={() => toggleFavorite(dog.id)}
                className={`flex items-center justify-center w-full rounded-md px-4 py-2 font-semibold shadow ${
                  favorites.includes(dog.id)
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-highlight text-white hover:bg-white hover:text-highlight"
                }`}
              >
                {favorites.includes(dog.id) ? "Unfavorite" : "Favorite"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${
            page === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-highlight text-white hover:opacity-90"
          }`}
        >
          Previous
        </button>
        <p className="text-center">
          Page {page} of {totalPages}
        </p>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded ${
            page === totalPages
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-highlight text-white hover:opacity-90"
          }`}
        >
          Next
        </button>
      </div>
      <div className="mt-4 flex items-center">
        <button
          disabled={favorites.length === 0}
          onClick={handleMatch}
          className={`m-auto w-full md:w-1/3 px-4 py-2 rounded ${
            favorites.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white hover:opacity-90"
          }`}
        >
          Find a Match
        </button>
      </div>
    </div>
  );
}