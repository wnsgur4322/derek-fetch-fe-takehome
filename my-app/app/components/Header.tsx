"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // call the logout API
      await axios.post("https://frontend-take-home-service.fetch.com/auth/logout", null, {
        withCredentials: true,
      });
      // redirect the user to the login page
      router.push("/");
    } catch (error) {
      console.error("Failed to log out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <header className="bg-primary py-4 px-8 flex justify-between items-center">
      <div className="text-xl font-bold">Derek Doggo Finder</div>
      <nav className="flex space-x-4">
        {pathname === "/" ? (
          <Link href="/" className="hover:text-highlight">
            Login
          </Link>
        ) : (
          <button
            onClick={handleSignOut}
            className="hover:text-highlight focus:outline-none"
          >
            Sign Out
          </button>
        )}
      </nav>
    </header>
  );
}
