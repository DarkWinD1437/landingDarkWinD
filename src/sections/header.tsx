import { DesktopNav } from "@/components/desktop-nav";
import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";


export function Header() {
    return (
        <header
        className="sticky top-0 flex justify-center z-50 w-full border-b border-border bg-background/50 px-8"
      >
        <div className="container flex h-16 justify-between items-center gap-4">
          <a className="flex-grow-[1] inline-flex items-center gap-1" href="/">
            <div className="size-6">
                <Logo className="size-full" />
                </div>
            <span className="inline-block text-lg font-bold">Darwin Vigabriel</span>
          </a>

        <DesktopNav />
        <MobileNav />
        </div>
      </header>
    )
}
