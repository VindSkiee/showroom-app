"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react"; // Tambahkan useEffect
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); // State untuk deteksi scroll

  // Efek untuk memantau posisi scroll
  useEffect(() => {
    const handleScroll = () => {
      // Jika scroll lebih dari 20px, set isScrolled menjadi true
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Jalankan sekali saat mount untuk mengecek posisi awal
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 transition-all duration-800 ease-in-out border-b",
        isScrolled 
          ? "bg-black/90 backdrop-blur-md border-white/10 shadow-lg" // Efek blur saat discroll
          : "bg-black border-transparent" // Solid black dan tanpa border bawah saat di puncak
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between sm:h-18">
          
          {/* Logo Section */}
          <Link 
            href="/" 
            className="flex shrink-0 items-center gap-2 overflow-hidden mr-4"
          >
            <Image
              src="/logo.jpg"
              alt="Toko Showroom Aneka Motor"
              width={120}
              height={40}
              className="h-8 w-auto shrink-0 sm:h-12"
              priority
            />
            <span className="flex flex-col">
              <span className="truncate text-xs font-bold text-white sm:text-base">
                ANEKA MOTOR
              </span>
              <span className="-mt-0.5 truncate text-[9px] font-medium text-white/50 sm:text-xs">
                PURWAKARTA
              </span>
            </span>
          </Link>
          
          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 sm:flex shrink-0">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:text-red-500 hover:border hover:border-red-500 transform transition-all duration-500 hover:scale-105"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex shrink-0 items-center justify-center rounded-lg p-2 text-white/70 hover:bg-white/10 sm:hidden"
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          >
            {mobileOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 9h16.5m-16.5 6.75h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-black/90 backdrop-blur-md">
          <Container>
            <nav className="flex flex-col gap-1 py-3">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-red-500"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}