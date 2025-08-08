"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Bell,
  LogOut,
  User,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { getInitials } from "@/lib/utils";

export default function Header() {
  const { data: session } = useSession();
  // const [theme, setTheme] = useState("light");
  // const [notifications] = useState(3);

  // const toggleTheme = () => {
  //   setTheme(theme === "light" ? "dark" : "light");
  //   document.documentElement.classList.toggle("dark");
  // };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center flex-1 max-w-md">
        {/* <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search patients, appointments..."
            className="pl-9 bg-gray-50 border-0 focus-visible:ring-1"
          />
        </div> */}
      </div>

      <div className="flex items-center space-x-4">
        {/* <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="relative"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button> */}

        {/* <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {notifications}
            </Badge>
          )}
        </Button> */}

        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-600 text-white">
              {session?.user?.name ? getInitials(session.user.name) : "DR"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col">
            <p className="text-sm font-medium">{session?.user?.name || "Doctor"}</p>
            <p className="text-xs text-gray-500">{session?.user?.role || "DOCTOR"}</p>
          </div>
          
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
