import { useState } from 'react';
import { SidebarTrigger } from "@/common/components/ui/sidebar";
import { UserProfile } from "@/features/authentication/components/LogInButton";
import GoogleLogin from "@/features/authentication/components/GoogleLogin";
import { IconButton } from "@/common/components/ui/icon-button";
import { SearchIcon, XIcon } from "lucide-react";

export const AppHeader = () => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    return (
        <header className="bg-background border-b border-border px-3 py-3 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
            <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-4">
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="text-foreground hover:text-primary" />
                    <GoogleLogin />
                </div>
                <div className="flex md:hidden items-center gap-2">
                    <IconButton
                        onClick={() => setIsSearchVisible(!isSearchVisible)}
                        className="text-white hover:text-primary"
                    >
                        {isSearchVisible ? <XIcon className="h-5 w-5" /> : <SearchIcon className="h-5 w-5" />}
                    </IconButton>
                    <UserProfile />
                </div>
            </div>

            <div className="hidden md:flex items-center">
                <UserProfile />
            </div>
        </header>
    );
};