import { useEffect, useState } from "react";
import { DesktopNav } from "@/components/desktop-nav";
import { MobileNav } from "@/components/mobile-nav";
import { cn } from "@/lib/utils";
import logo from "@/assets/favicon.ico";

export function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={cn(
                "sticky top-0 z-100 flex w-full justify-center border-b px-8 transition-colors duration-300",
                scrolled ? "border-border bg-background/85 backdrop-blur-md" : "border-transparent bg-transparent"
            )}
        >
            <div className="container flex h-16 items-center justify-between gap-4">
                <a
                    href="/"
                    className="inline-flex items-center gap-1.5 border border-border px-2.5 py-1.5 font-mono text-sm font-bold tracking-[0.1em] transition-colors hover:border-accent"
                >
                    <img src={logo} alt="" className="size-4" />
                    DarkWinD
                </a>

                <DesktopNav />
                <MobileNav />
            </div>
        </header>
    )
}
