import { MenuIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { NAV_LINKS } from "@/data/constants";
import { Button } from "./ui/button";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

export function MobileNav() {
    return (
        <div className="block md:hidden">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost">
                        <MenuIcon /> Menu
                    </Button>
                </PopoverTrigger>

                <PopoverContent side="bottom" className="w-60 mr-6">
                    <ul className="flex flex-col items-start gap-4">
                        {
                            NAV_LINKS.map((link) => (
                                <li key={link.label}>
                                    <a className="text-foreground/50 hover:text-foreground font-medium" href={link.href}>
                                        {link.label}
                                    </a>
                                </li>
                            ))
                        }
                        <div className="flex flex-col gap-4">
                            <Button variant={'outline'} asChild>
                                <a href="#contacto">Contactarme</a>
                            </Button>

                            <AnimatedThemeToggler className="h-9 w-9 inline-flex items-center justify-center rounded-md border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 [&_svg]:size-4" />
                        </div>
                    </ul>
                </PopoverContent>
            </Popover>
        </div>
    )
}
