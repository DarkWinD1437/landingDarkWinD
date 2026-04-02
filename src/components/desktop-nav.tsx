import { Button } from "./ui/button"
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler"
import { NAV_LINKS } from "@/data/constants"


export function DesktopNav() {
    return (
        <div className="hidden md:flex justify-between items-center gap-4">
            <ul className="flex flex-grow-[1] justify-center items-center gap-4">
                {
                    NAV_LINKS.map((link) => (
                        <li key={link.label}>
                            <a className="text-foreground/50 hover:text-foreground font-medium" href={link.href}>
                            {link.label}
                            </a>
                        </li>
                    ))
                }
            </ul>

            <div className="flex gap-4 items-center">
                <Button variant={'outline'} asChild>
                    <a href="#contacto">Contactarme</a>
                </Button>

                <AnimatedThemeToggler className="h-9 w-9 inline-flex items-center justify-center rounded-md border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 [&_svg]:size-4" />
            </div>
        </div>
    )
}
