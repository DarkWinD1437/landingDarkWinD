import { MenuIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { NAV_LINKS } from "@/data/constants";
import { Button } from "./ui/button";

export function MobileNav() {
    return (
        <div className="block md:hidden">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="font-mono uppercase text-xs tracking-[0.1em]">
                        <MenuIcon /> Menu
                    </Button>
                </PopoverTrigger>

                <PopoverContent side="bottom" className="w-[calc(100vw-2rem)] mr-4 sm:w-64 sm:mr-6 border-border bg-popover">
                    <ul className="flex flex-col items-start gap-4">
                        {
                            NAV_LINKS.map((link) => (
                                <li key={link.label}>
                                    <a
                                        className="font-mono text-xs tracking-[0.12em] uppercase text-muted-foreground transition-colors hover:text-accent"
                                        href={link.href}
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))
                        }
                        <Button variant="outline" size="sm" className="font-mono text-[0.72rem] tracking-[0.1em] uppercase" asChild>
                            <a href="#contacto">Contactarme</a>
                        </Button>
                    </ul>
                </PopoverContent>
            </Popover>
        </div>
    )
}
