'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { logos, mascots, socialIcons } from '@/lib/assets'
import { smoothScrollTo } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n-context'
import { COOKIE_CONSENT_KEY, disableAnalytics } from '@/lib/analytics'

export default function Footer() {
    const [showBubble, setShowBubble] = useState(false)
    const { t } = useTranslation()
    const pathname = usePathname()
    // Poza stroną główną (regulamin, /promocje/) sekcje są na stronie głównej → /#sekcja
    const isHome = pathname === '/'
    // Wejście na /#sekcja z innej strony: przewiń po załadowaniu (animacje zmieniają wysokość sekcji)
    useEffect(() => {
        if (!isHome) return
        const id = window.location.hash.slice(1)
        if (!id) return
        const timer = window.setTimeout(() => smoothScrollTo(id), 400)
        return () => window.clearTimeout(timer)
    }, [isHome])
    const goToSection = (id: string) => {
        if (isHome) smoothScrollTo(id)
        else window.location.href = id === 'top' ? '/' : `/#${id}`
    }

    const footerLinks = [
        // T-079: strony SEO z promocjami
        { label: t('footer.promos'), href: '/promocje/' },
        { label: t('footer.terms'), href: '/legal/regulamin' },
        { label: t('footer.privacy'), href: '/legal/polityka-prywatnosci' },
        { label: t('cookies.settings'), onClick: () => {
            // Ponowny wybór: usuwamy decyzję i ciasteczka GA, po przeładowaniu GA nie startuje bez nowej zgody
            try {
                localStorage.removeItem(COOKIE_CONSENT_KEY)
            } catch {
                // ignorujemy
            }
            disableAnalytics()
            window.location.reload()
        }},
        { label: t('footer.contact'), onClick: () => goToSection('kontakt') },
        { label: t('footer.forBusiness'), onClick: () => goToSection('dla-biznesu') },
    ]

    return (
        <footer className="relative bg-pedro-dark border-t-4 border-pedro-lime pt-12 pb-32 md:pb-12 overflow-hidden">
            <div className="container-pedro">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
                    {/* Column 1 - Logo & Description */}
                    <div className="space-y-4">
                        <button
                            onClick={() => goToSection('top')}
                            className="text-white font-headline text-3xl font-bold transition-all duration-300 hover:text-pedro-lime hover:rotate-6 inline-block"
                        >
                            PEDRO
                        </button>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {t('footer.description1')}<br />
                            {t('footer.description2')}
                        </p>
                    </div>

                    {/* Column 2 - Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4">{t('footer.links')}</h3>
                        <div className="flex flex-col gap-3">
                            {footerLinks.map((link, index) => (
                                link.href ? (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        className="text-gray-400 hover:text-pedro-lime transition-colors text-left text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                ) : (
                                    <button
                                        key={index}
                                        onClick={link.onClick}
                                        className="text-gray-400 hover:text-pedro-lime transition-colors text-left text-sm"
                                    >
                                        {link.label}
                                    </button>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Column 3 - Social */}
                    <div>
                        <h3 className="text-white font-bold mb-4">{t('footer.followUs')}</h3>
                        <div className="flex gap-4">
                            <a
                                href="#"
                                aria-label="Instagram"
                                className="transition-all duration-300 hover:scale-110 hover:rotate-6"
                            >
                                <img
                                    src={socialIcons.instagram}
                                    alt="Instagram"
                                    width={32}
                                    height={32}
                                    className="opacity-70 hover:opacity-100 transition-opacity"
                                />
                            </a>
                            <a
                                href="#"
                                aria-label="TikTok"
                                className="transition-all duration-300 hover:scale-110 hover:rotate-6"
                            >
                                <img
                                    src={socialIcons.tiktok}
                                    alt="TikTok"
                                    width={32}
                                    height={32}
                                    className="opacity-70 hover:opacity-100 transition-opacity"
                                />
                            </a>
                            <a
                                href="#"
                                aria-label="Facebook"
                                className="transition-all duration-300 hover:scale-110 hover:rotate-6"
                            >
                                <img
                                    src={socialIcons.facebook}
                                    alt="Facebook"
                                    width={32}
                                    height={32}
                                    className="opacity-70 hover:opacity-100 transition-opacity"
                                />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 pt-8 text-center px-20 md:px-0">
                    <p className="text-gray-400 text-sm">
                        {t('footer.madeWith')}
                    </p>
                    {/* T-078: informacja o ochronie bazy promocji (regulamin §8) */}
                    <p className="text-gray-400 text-sm mt-2">
                        © {new Date().getFullYear()} PEDRO · {t('footer.dbProtected')} ·{' '}
                        <Link href="/legal/regulamin/#baza-promocji" className="underline hover:text-pedro-lime transition-colors">
                            {t('footer.terms')}
                        </Link>
                    </p>
                </div>
            </div>

            {/* Pedro Peeking - Bottom Right Corner */}
            <div
                className="absolute bottom-0 right-4 md:right-8 cursor-pointer"
                onMouseEnter={() => setShowBubble(true)}
                onMouseLeave={() => setShowBubble(false)}
            >
                <img
                    src={mascots.peeking}
                    alt="Pedro peeking"
                    width={120}
                    height={150}
                    className="animate-wave transition-transform hover:-translate-y-3 w-16 h-20 md:w-[120px] md:h-[150px]"
                />

                {/* Speech Bubble */}
                {showBubble && (
                    <div className="absolute bottom-full right-0 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white brutal-border rounded-button px-4 py-2 shadow-brutal-sm-lime">
                            <p className="text-sm font-bold text-pedro-dark whitespace-nowrap">
                                {t('footer.pedroBubble')}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </footer>
    )
}
