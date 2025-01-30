"use client";

import React, { useState } from "react";

interface MatchingCartModalProps {
  favorites: Dog[];
  onRemoveFavorite: (id: string) => void;
  onFindMatch: () => void;
  isMatchDisabled: boolean;
}

export default function MatchingCartModal({
  favorites,
  onRemoveFavorite,
  onFindMatch,
  isMatchDisabled,
}: MatchingCartModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Cart Icon */}
      <div
        className="fixed bottom-7 right-7 bg-highlight text-2xl text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-white hover:text-highlight"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        🛒 {favorites.length > 0 && <span className="ml-2">{favorites.length}</span>}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-11/12 md:w-1/3 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Selected Favorites</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>
            {favorites.length === 0 ? (
              <p className="text-gray-600">No favorites selected</p>
            ) : (
              <ul className="space-y-2 overflow-y-auto" style={{ maxHeight: "300px" }} >
                
                {favorites.map((dog) => (
                  <li
                    key={dog.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-semibold">{dog.name}</p>
                      <p className="text-sm text-gray-400">breed: {dog.breed}</p>
                      <p className="text-sm text-gray-400">age: {dog.age}</p>
                      <p className="text-sm text-gray-400">zip code: {dog.zip_code}</p>
                    </div>
                    <button
                      onClick={() => onRemoveFavorite(dog.id)}
                      className="text-red-500 hover:underline mr-2"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {favorites.length > 0 && (
              <button
                onClick={onFindMatch}
                disabled={isMatchDisabled}
                className={`mt-4 w-full py-2 px-4 rounded ${
                  isMatchDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                Find Match
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
