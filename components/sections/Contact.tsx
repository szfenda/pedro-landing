'use client'

import { socialIcons } from '@/lib/assets'
import Image from 'next/image'

export default function Contact() {
    return (
        <section id="kontakt" className="bg-white py-section">
            <div className="container-pedro max-w-2xl">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-h2 text-pedro-dark mb-4">
                        Skontaktuj się
                    </h2>
                    <p className="text-body text-gray-600">
                        Masz pytania? Chętnie pomożemy!
                    </p>
                </div>

                {/* Contact Info */}
                <div className="text-center mb-12 space-y-4">
                    <p className="text-lg text-pedro-dark">
                        📧 <a href="mailto:kontakt@pedro.app" className="font-bold hover:text-pedro-purple transition-colors">kontakt@pedro.app</a>
                    </p>

                    {/* Social Links */}
                    <div className="flex gap-6 justify-center mt-8">
                        <a href="#" aria-label="Instagram" className="transition-transform hover:scale-110 hover:rotate-6">
                            <img
                                src={socialIcons.instagram}
                                alt="Instagram"
                                width={40}
                                height={40}
                                className="opacity-70 hover:opacity-100 transition-opacity"
                            />
                        </a>
                        <a href="#" aria-label="TikTok" className="transition-transform hover:scale-110 hover:rotate-6">
                            <img
                                src={socialIcons.tiktok}
                                alt="TikTok"
                                width={40}
                                height={40}
                                className="opacity-70 hover:opacity-100 transition-opacity"
                            />
                        </a>
                        <a href="#" aria-label="Facebook" className="transition-transform hover:scale-110 hover:rotate-6">
                            <img
                                src={socialIcons.facebook}
                                alt="Facebook"
                                width={40}
                                height={40}
                                className="opacity-70 hover:opacity-100 transition-opacity"
                            />
                        </a>
                    </div>
                </div>

                {/* Contact Form */}
                <form className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-bold text-pedro-dark mb-2">
                            Imię
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="input-brutal"
                            placeholder="Twoje imię"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-pedro-dark mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="input-brutal"
                            placeholder="twoj@email.pl"
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-bold text-pedro-dark mb-2">
                            Wiadomość
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows={5}
                            className="input-brutal resize-none"
                            placeholder="Twoja wiadomość..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-brutal btn-brutal-lime w-full text-lg"
                    >
                        Wyślij wiadomość
                    </button>
                </form>
            </div>
        </section>
    )
}
