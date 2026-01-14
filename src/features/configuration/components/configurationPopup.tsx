import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/common/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/common/components/ui/drawer";
import { Button } from "@/common/components/ui/button";
import { Switch } from "@/common/components/ui/switch";
import { Slider } from "@/common/components/ui/slider";
import { Label } from "@/common/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/common/components/ui/select";
import { Moon, Sun, Monitor, Type, RotateCcw } from "lucide-react";
import { cn } from "@/common/lib/utils";
import { useIsMobile } from "@/common/hooks/use-mobile";

interface ConfigurationPopupProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type Theme = "light" | "dark" | "auto";

export const ConfigurationPopup = ({
    open,
    onOpenChange,
}: ConfigurationPopupProps) => {
    const isMobile = useIsMobile();

    // Local state for configuration
    const [interfaceColor, setInterfaceColor] = useState<string>("blue");
    const [theme, setTheme] = useState<Theme>("light");
    const [fontSize, setFontSize] = useState<number>(16);
    const [dyslexic, setDyslexic] = useState<boolean>(false);
    const [language, setLanguage] = useState<string>("English (US)");

    const handleReset = () => {
        setInterfaceColor("blue");
        setTheme("light");
        setFontSize(16);
        setDyslexic(false);
        setLanguage("English (US)");
    };

    const handleSave = () => {
        console.log("Configuration Saved:", {
            interfaceColor,
            theme,
            fontSize,
            dyslexic,
            language,
        });
        onOpenChange(false);
    };

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Configuration</DrawerTitle>
                    </DrawerHeader>
                    <ConfigurationForm
                        interfaceColor={interfaceColor}
                        setInterfaceColor={setInterfaceColor}
                        theme={theme}
                        setTheme={setTheme}
                        fontSize={fontSize}
                        setFontSize={setFontSize}
                        dyslexic={dyslexic}
                        setDyslexic={setDyslexic}
                        language={language}
                        setLanguage={setLanguage}
                        handleReset={handleReset}
                        handleSave={handleSave}
                        isMobile={true}
                    />
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden flex flex-col max-h-[85vh]">
                <DialogHeader className="px-6 py-4 border-b shrink-0">
                    <DialogTitle className="text-xl font-bold">Configuration</DialogTitle>
                </DialogHeader>
                <ConfigurationForm
                    interfaceColor={interfaceColor}
                    setInterfaceColor={setInterfaceColor}
                    theme={theme}
                    setTheme={setTheme}
                    fontSize={fontSize}
                    setFontSize={setFontSize}
                    dyslexic={dyslexic}
                    setDyslexic={setDyslexic}
                    language={language}
                    setLanguage={setLanguage}
                    handleReset={handleReset}
                    handleSave={handleSave}
                />
            </DialogContent>
        </Dialog>
    );
};

interface ConfigurationFormProps {
    interfaceColor: string;
    setInterfaceColor: (color: string) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    fontSize: number;
    setFontSize: (size: number) => void;
    dyslexic: boolean;
    setDyslexic: (dyslexic: boolean) => void;
    language: string;
    setLanguage: (lang: string) => void;
    handleReset: () => void;
    handleSave: () => void;
    isMobile?: boolean;
}

const ConfigurationForm = ({
    interfaceColor,
    setInterfaceColor,
    theme,
    setTheme,
    fontSize,
    setFontSize,
    dyslexic,
    setDyslexic,
    language,
    setLanguage,
    handleReset,
    handleSave,
    isMobile = false,
}: ConfigurationFormProps) => {
    const colors = [
        { name: "blue", class: "bg-blue-600" },
        { name: "purple", class: "bg-purple-600" },
        { name: "red", class: "bg-red-600" },
        { name: "teal", class: "bg-teal-600" },
    ];

    return (
        <>
            <div className={cn("p-6 space-y-6 flex-1 overflow-y-auto", isMobile && "pb-4")}>
                {/* Interface Color */}
                <section className="space-y-4">
                    <Label className="uppercase text-muted-foreground tracking-wider text-xs font-semibold">
                        Interface Color
                    </Label>
                    <div className="flex space-x-4">
                        {colors.map((color) => (
                            <button
                                key={color.name}
                                onClick={() => setInterfaceColor(color.name)}
                                className={cn(
                                    "w-10 h-10 rounded-full transition-all ring-offset-2 ring-offset-background",
                                    color.class,
                                    interfaceColor === color.name
                                        ? "ring-2 ring-foreground"
                                        : "hover:ring-2 ring-transparent"
                                )}
                                aria-label={`Select ${color.name} theme`}
                            />
                        ))}
                    </div>
                </section>

                {/* Display Theme */}
                <section className="space-y-4">
                    <Label className="uppercase text-muted-foreground tracking-wider text-xs font-semibold">
                        Display Theme
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                        <Button
                            variant="outline"
                            className={cn(
                                "flex flex-col items-center justify-center p-3 h-auto gap-2 hover:bg-accent/50",
                                theme === "light" && "border-primary bg-primary/5 text-primary hover:bg-primary/10"
                            )}
                            onClick={() => setTheme("light")}
                        >
                            <Sun className="w-6 h-6" />
                            <span className="text-xs font-medium">Light</span>
                        </Button>
                        <Button
                            variant="outline"
                            className={cn(
                                "flex flex-col items-center justify-center p-3 h-auto gap-2 hover:bg-accent/50",
                                theme === "dark" && "border-primary bg-primary/5 text-primary hover:bg-primary/10"
                            )}
                            onClick={() => setTheme("dark")}
                        >
                            <Moon className="w-6 h-6" />
                            <span className="text-xs font-medium">Dark</span>
                        </Button>
                        <Button
                            variant="outline"
                            className={cn(
                                "flex flex-col items-center justify-center p-3 h-auto gap-2 hover:bg-accent/50",
                                theme === "auto" && "border-primary bg-primary/5 text-primary hover:bg-primary/10"
                            )}
                            onClick={() => setTheme("auto")}
                        >
                            <Monitor className="w-6 h-6" />
                            <span className="text-xs font-medium">Auto</span>
                        </Button>
                    </div>
                </section>

                {/* Font Settings */}
                <section className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label className="uppercase text-muted-foreground tracking-wider text-xs font-semibold">
                                Font Size
                            </Label>
                            <span className="text-xs font-bold text-primary">
                                {fontSize}px
                            </span>
                        </div>
                        <div className="px-2">
                            <Slider
                                value={[fontSize]}
                                onValueChange={(value) => setFontSize(value[0])}
                                max={24}
                                min={12}
                                step={1}
                                className="cursor-pointer"
                            />
                            <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-medium px-0.5">
                                <span className="text-xs">A</span>
                                <span className="text-base">A</span>
                                <span className="text-lg">A</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-accent/30 rounded-xl">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Type className="w-4 h-4 text-primary" />
                                <p className="text-sm font-semibold text-foreground">
                                    Dyslexic Friendly Font
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Optimized font for better readability
                            </p>
                        </div>
                        <Switch
                            checked={dyslexic}
                            onCheckedChange={setDyslexic}
                        />
                    </div>
                </section>

                {/* Language */}
                <section className="space-y-4">
                    <Label className="uppercase text-muted-foreground tracking-wider text-xs font-semibold">
                        Language
                    </Label>
                    <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-full text-base">
                            <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="English (US)">English (US)</SelectItem>
                            <SelectItem value="Español (Venezuela)">
                                Español (Venezuela)
                            </SelectItem>
                            <SelectItem value="Português">Português</SelectItem>
                            <SelectItem value="Français">Français</SelectItem>
                        </SelectContent>
                    </Select>
                </section>
            </div>

            <div className={cn("px-6 py-4 bg-muted/40 border-t flex justify-end gap-3 shrink-0", isMobile && "pb-8")}>
                <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                </Button>
                <Button onClick={handleSave}>
                    Save Changes
                </Button>
            </div>
        </>
    );
};
