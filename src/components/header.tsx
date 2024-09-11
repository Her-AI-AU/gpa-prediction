"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export const Header = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (requiresAuth(pathname)) {
      alert("Please log in first.");
      router.push("/login");
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  const requiresAuth = (path) => {
    const authRequiredPaths = ["/subjects", "/predict"];
    return authRequiredPaths.some(authPath => path.startsWith(authPath));
  };

  return (
    <header className="relative z-50 border-b bg-white">
      <div className="container mx-auto flex h-20 items-center py-5">
        <Link className="mr-12" href="/">
          <Image
            className="py-0"
            width={80}
            height={80}
            src="/static/herai.png"
            alt="Logo"
          />
        </Link>
        <nav
          className="justify-center flex-grow flex nav-primary"
          aria-label="Nav Menu"
        >
          <ul id="menu-nav-menu" className="lg:flex lg:items-center lg:gap-16">
            <li className="menu-item">
              <Link href="/subjects" onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  alert("Please log in first.");
                  router.push("/login");
                }
              }}>Subjects</Link>
            </li>
            <li className="menu-item">
              <Link href="/predict" onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  alert("Please log in first.");
                  router.push("/login");
                }
              }}>Predict</Link>
            </li>
          </ul>
        </nav>
        <nav className="justify-end flex-grow flex nav-primary">
          <ul className="lg:flex lg:items-center lg:gap-16">
            {user ? (
              <>
                <li className="menu-item">
                  <span>Welcome, {user.name}</span>
                </li>
                <li className="menu-item">
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="menu-item">
                  <Link href="/login">Login</Link>
                </li>
                <li className="menu-item">
                  <Link href="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};