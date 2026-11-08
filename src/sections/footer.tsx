import GithubIcon from '@/components/icons/github-icon';
import LinkedinIcon from '@/components/icons/linkedin-icon';
import logo from '@/assets/favicon.ico';
import { Button } from '@/components/ui/button';
import { data } from '@/data/data';
import { NAV_LINKS } from '@/data/constants';
import { MailIcon } from 'lucide-react';

const SOCIAL_LINKS = [
    {
        id: 'linkedin-social-link',
        href: data.links.linkedin,
        icon: LinkedinIcon,
        label: 'LinkedIn'
    },
    {
        id: 'github-social-link',
        href: data.links.github,
        icon: GithubIcon,
        label: 'GitHub'
    }
]

export function Footer() {
    return (
        <footer data-build="PIE DE PÁGINA" className="border-t border-border px-8 pb-14 pt-10">
            <div className="mx-auto flex max-w-330 flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-1.5 border border-border px-2.5 py-1.5 font-mono text-sm font-bold tracking-[0.1em]">
                    <img src={logo} alt="" className="size-4" />
                    DarkWinD
                </div>
                <ul className="flex items-center gap-1">
                    <li>
                        <Button variant="ghost" size="icon" asChild className="hover:text-accent">
                            <a href={`mailto:${data.links.email}`} aria-label="Email">
                                <MailIcon className="size-5" />
                            </a>
                        </Button>
                    </li>
                    {SOCIAL_LINKS.map((link) => (
                        <li key={link.id}>
                            <Button variant="ghost" size="icon" asChild className="hover:text-accent">
                                <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                                    <link.icon />
                                </a>
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mx-auto mt-6 flex max-w-330 flex-wrap justify-between gap-4">
                <ul className="flex flex-wrap gap-x-5 gap-y-2 py-2">
                    {NAV_LINKS.map((link) => (
                        <li key={link.label}>
                            <a
                                className="font-mono text-xs uppercase tracking-[0.1em] text-faint transition-colors hover:text-accent"
                                href={link.href}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-2 py-2">
                    <MailIcon className="size-4 text-faint" />
                    <a
                        href={`mailto:${data.links.email}`}
                        className="font-mono text-xs text-faint transition-colors hover:text-accent"
                    >
                        {data.links.email}
                    </a>
                </div>
            </div>

            <div className="mx-auto mt-8 flex max-w-330 flex-wrap items-center justify-between gap-2 border-t border-border pt-6 font-mono text-[0.68rem] tracking-[0.08em] text-faint">
                <span>{data.name.toUpperCase()} — REGISTRO EN CURSO</span>
                <span>&copy; {new Date().getFullYear()}</span>
            </div>
        </footer>
    );
}
