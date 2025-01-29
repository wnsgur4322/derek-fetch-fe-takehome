"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = () => {
    // After logging out, redirect the user to the login page
    router.push("/");
  };

  return (
    <header className="bg-primary py-4 px-8 flex justify-between items-center">
      <div className="text-xl font-bold">Derek's Fetch Doggo Finder</div>
      <nav className="flex space-x-4">
        {pathname === "/search" ? (
          <button
            onClick={handleSignOut}
            className="hover:text-highlight focus:outline-none"
          >
            Sign Out
          </button>
        ) : (
          <Link href="/" className="hover:text-highlight">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
