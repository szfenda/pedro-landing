'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n-context'

export default function FAQ() {
    const { t } = useTranslation()

    const faqs = [
        { question: t('faq.questions.q1.question'), answer: t('faq.questions.q1.answer') },
        { question: t('faq.questions.q2.question'), answer: t('faq.questions.q2.answer') },
        { question: t('faq.questions.q3.question'), answer: t('faq.questions.q3.answer') },
        { question: t('faq.questions.q4.question'), answer: t('faq.questions.q4.answer') },
        { question: t('faq.questions.q5.question'), answer: t('faq.questions.q5.answer') },
        { question: t('faq.questions.q6.question'), answer: t('faq.questions.q6.answer') },
    ]

    return (
        <section id="faq" className="bg-pedro-light py-section">
            <div className="container-pedro max-w-3xl">
                {/* Section Heading */}
                <div className="text-center mb-16">
                    <h2 className="font-headline text-h2 text-pedro-dark mb-4">
                        {t('faq.title')}
                    </h2>
                    <p className="text-body text-gray-600">
                        {t('faq.subtitle')}
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
