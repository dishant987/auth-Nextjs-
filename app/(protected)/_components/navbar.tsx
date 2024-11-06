"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Menu, User, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("settings");
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useCurrentUser();

  const onClick = () => {
    signOut();
  };

  const navItems = [
    { name: "Server", href: "/server" },
    { name: "Client", href: "/client" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <nav className="bg-white p-3 m-3 shadow-lg  w-[97%] rounded-lg duration-500">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="#" className="text-2xl font-bold">
            <Image
              src="/auth.png"
              alt="Logo"
              width={50}
              height={50}
            
            />
          </Link>
          <ul className="hidden md:flex gap-8 justify-center items-center">
            {navItems.map((item) => (
              <li key={item.name} className="cursor-pointer">
                <Link href={item.href}>
                  <motion.div
                    className={`px-4 py-1 rounded-lg transition-colors duration-200 ${
                      activeLink === item.name.toLowerCase()
                        ? "bg-gray-700 text-white font-semibold"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveLink(item.name.toLowerCase())}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center space-x-4">
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setMenuOpen(!menuOpen)}
              className="hover:text-gray-600 transition-colors duration-200"
            >
              {menuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-gray-600 transition-colors duration-200"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image ?? undefined} alt="@user" />
                  <AvatarFallback className="text-lg">
                    {user?.name ? user.name[0] : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={onClick}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden flex flex-col items-center space-y-2 p-4 rounded-b-lg"
        >
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} passHref legacyBehavior>
              <motion.div
                className={`block w-full text-center transition-colors duration-200 py-2 ${
                  activeLink === item.name.toLowerCase()
                    ? "bg-gray-200 font-semibold"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  setActiveLink(item.name.toLowerCase());
                  setMenuOpen(false);
                }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
}
