'use client'

import { useState } from 'react'

export default function FAQ() {
    const faqs = [
        {
            question: 'Jak działa PEDRO?',
            answer: 'PEDRO automatycznie znajduje najlepsze promocje w Twojej okolicy. Wystarczy otworzyć aplikację, a Pedro pokaże Ci aktualne okazje w pobliskich sklepach i lokalach.'
        },
        {
            question: 'Czy aplikacja jest darmowa?',
            answer: 'Tak! PEDRO jest całkowicie darmowy dla użytkowników. Zarabiamy na partnerstwach z lokalnymi biznesami.'
        },
        {
            question: 'Jak dodać kupon do portfela?',
            answer: 'Wystarczy kliknąć "Użyj" przy wybranej promocji. Kupon automatycznie pojawi się w Twoim portfelu i będzie gotowy do zeskanowania przy kasie.'
        },
        {
            question: 'Czy mogę korzystać offline?',
            answer: 'Zapisane kupony możesz używać offline. Do przeglądania nowych promocji potrzebne jest połączenie z internetem.'
        },
        {
            question: 'Jak mogę dodać swoją firmę?',
            answer: 'Kliknij "Dodaj swoją firmę" w sekcji dla biznesu lub skontaktuj się z nami. Proces dodawania promocji jest prosty i zajmuje około 2 minut.'
        },
        {
            question: 'Czy PEDRO jest dostępne poza Trójmiastem?',
            answer: 'Obecnie skupiamy się na Gdańsku, Gdyni i Sopocie. Jednak już niedługo rozszerzamy działalność na inne miasta w Polsce!'
        },
    ]

    return (
        <section id="faq" className="bg-pedro-light py-section">
            <div className="container-pedro max-w-3xl">
                {/* Section Heading */}
                <div className="text-center mb-16">
                    <h2 className="font-headline text-h2 text-pedro-dark mb-4">
                        Często zadawane pytania
                    </h2>
                    <p className="text-body text-gray-600">
                        Wszystko, co musisz wiedzieć o PEDRO
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

// FAQ Accordion Item
interface FAQItemProps {
    question: string
    answer: string
}

function FAQItem({ question, answer }: FAQItemProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <details
            className="brutal-border rounded-card bg-white shadow-brutal-purple hover:shadow-brutal-lime transition-all duration-300 group"
            onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
        >
            <summary className="cursor-pointer p-6 font-bold text-lg text-pedro-dark list-none flex justify-between items-center">
                <span>{question}</span>
                <span className={`text-pedro-lime text-3xl font-bold transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                    +
                </span>
            </summary>
            <div className="px-6 pb-6 text-gray-700 leading-relaxed">
                {answer}
            </div>
        </details>
    )
}
