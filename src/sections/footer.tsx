import GithubIcon from '@/components/icons/github-icon';
import LinkedinIcon from '@/components/icons/linkedin-icon';
import { Logo } from '@/components/logo';
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
        <footer id="contacto" className="py-12 px-8 border-t">
            <div className="flex w-full justify-between items-center gap-4 flex-wrap">
                <div className="inline-flex items-center gap-2">
                    <div className="size-6">
                        <Logo className="size-full" />
                    </div>
                    <span className="inline-block text-lg font-bold">{data.name}</span>
                </div>
                <ul className="flex items-center gap-2">
                    <li>
                        <Button variant="ghost" size="icon" asChild>
                            <a href={`mailto:${data.links.email}`} aria-label="Email">
                                <MailIcon className="size-5" />
                            </a>
                        </Button>
                    </li>
                    {SOCIAL_LINKS.map((link) => (
                        <li key={link.id}>
                            <Button variant="ghost" size="icon" asChild>
                                <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                                    <link.icon />
                                </a>
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex gap-4 justify-between flex-wrap mt-4">
                <ul className="flex py-4 justify-self-start gap-4 flex-wrap">
                    {NAV_LINKS.map((link) => (
                        <li key={link.label}>
                            <a className="text-foreground/50 hover:text-foreground font-medium" href={link.href}>
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="py-4 flex items-center gap-2">
                    <MailIcon className="size-4 text-muted-foreground" />
                    <a
                        href={`mailto:${data.links.email}`}
                        className="text-foreground/60 hover:text-foreground font-medium text-sm"
                    >
                        {data.links.email}
                    </a>
                </div>
            </div>

            <small className="text-muted-foreground">
                &copy; {new Date().getFullYear()} {data.name}. Todos los derechos reservados.
            </small>
        </footer>
    );
}
