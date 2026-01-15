import { SidebarTrigger } from "@/common/components/ui/sidebar";
import { UserProfile } from "@/features/authentication/components/LogInButton";
import ConfigurationButton from "@/common/components/ui/configurationButton";

export const AppHeader = () => {
  return (
    <header className="bg-background border-b border-border px-4 h-14 flex items-center justify-between w-full shrink-0">
      <div className="flex-1 flex justify-start items-center">
        <SidebarTrigger className="text-foreground hover:text-interface" />
      </div>

      <p className="font-display text-xs md:text-sm uppercase tracking-widest text-muted-foreground text-center truncate px-2">
        Biblioteca Pública Central Dr. Julián Padrón
      </p>

      <div className="flex-1 flex justify-end items-center gap-2">
        <UserProfile />
        <ConfigurationButton />
      </div>
    </header>
  );
};