'use client'

import Image from 'next/image'
import { useState } from 'react'
import { logos, mascots, socialIcons } from '@/lib/assets'
import { smoothScrollTo } from '@/lib/utils'

export default function Footer() {
    const [showBubble, setShowBubble] = useState(false)

    const footerLinks = [
        { label: 'Regulamin', href: '#' },
        { label: 'Polityka Prywatności', href: '#' },
        { label: 'Kontakt', onClick: () => smoothScrollTo('kontakt') },
        { label: 'Dla Biznesu', onClick: () => smoothScrollTo('dla-biznesu') },
    ]

    return (
        <footer className="relative bg-pedro-dark border-t-4 border-pedro-lime py-12 overflow-hidden">
            <div className="container-pedro">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
                    {/* Column 1 - Logo & Description */}
                    <div className="space-y-4">
                        <button
                            onClick={() => smoothScrollTo('top')}
                            className="text-white font-headline text-3xl font-bold transition-all duration-300 hover:text-pedro-lime hover:rotate-6 inline-block"
                        >
                            PEDRO
                        </button>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Twój osobisty asystent promocji.<br />
                            Poluj na promki, oszczędzaj pieniądze.
                        </p>
                    </div>

                    {/* Column 2 - Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Linki</h3>
                        <div className="flex flex-col gap-3">
                            {footerLinks.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={link.onClick}
                                    className="text-gray-400 hover:text-pedro-lime transition-colors text-left text-sm"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Column 3 - Social */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Śledź nas</h3>
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
                <div className="border-t border-gray-700 pt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        Made with 🍕 in Gdańsk © {new Date().getFullYear()} PEDRO
                    </p>
                </div>
            </div>

            {/* Pedro Peeking - Bottom Right Corner */}
            <div
                className="absolute bottom-0 right-8 cursor-pointer"
                onMouseEnter={() => setShowBubble(true)}
                onMouseLeave={() => setShowBubble(false)}
            >
                <img
                    src={mascots.peeking}
                    alt="Pedro peeking"
                    width={120}
                    height={150}
                    className="animate-wave transition-transform hover:-translate-y-3"
                />

                {/* Speech Bubble */}
                {showBubble && (
                    <div className="absolute bottom-full right-0 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-white brutal-border rounded-button px-4 py-2 shadow-brutal-sm-lime">
                            <p className="text-sm font-bold text-pedro-dark whitespace-nowrap">
                                Do zobaczenia! 👋
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </footer>
    )
}
