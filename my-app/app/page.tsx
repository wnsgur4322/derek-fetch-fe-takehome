"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // start loading
    try {
      await axios.post(
        "https://frontend-take-home-service.fetch.com/auth/login",
        { name, email },
        { withCredentials: true }
      );
      router.push("/search");
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div style={{ minHeight: "88vh" }} className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#2B2E4A] p-6 rounded shadow-md space-y-4"
      >
        <h1 className="text-xl font-bold text-white text-center">Hello again!</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded text-black placeholder-gray-500"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded text-black placeholder-gray-500"
          required
        />
        <button
          type="submit"
          disabled={loading} // disable the button while loading
          className={`w-4/5 py-3 rounded mx-auto flex items-center justify-center ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-highlight hover:opacity-90"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
}
