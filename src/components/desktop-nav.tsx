import { Button } from "./ui/button"
import { NAV_LINKS } from "@/data/constants"

export function DesktopNav() {
    return (
        <div className="hidden md:flex grow justify-between items-center gap-4">
            <ul className="flex grow justify-center items-center gap-[clamp(14px,3vw,32px)]">
                {
                    NAV_LINKS.map((link) => (
                        <li key={link.label}>
                            <a
                                className="font-mono text-[0.72rem] tracking-[0.14em] uppercase text-muted-foreground transition-colors hover:text-accent"
                                href={link.href}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))
                }
            </ul>

            <Button variant="outline" size="sm" className="font-mono text-[0.72rem] tracking-[0.1em] uppercase" asChild>
                <a href="#contacto">Contactarme</a>
            </Button>
        </div>
    )
}
