import { Settings } from "lucide-react";
import { ConfigurationPopup } from "@/features/configuration/components/configurationPopup";
import { useState } from "react";

const ConfigurationButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Configuration"
                onClick={() => setOpen(true)}
            >
                <Settings className="h-5 w-5 transition-transform duration-500 ease-in-out hover:rotate-[60deg]" />
            </button>
            <ConfigurationPopup open={open} onOpenChange={setOpen} />
        </>
    );
};

export default ConfigurationButton;
