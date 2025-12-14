'use client'

export default function SocialProof() {
    const testimonials = [
        {
            name: 'Anna K.',
            location: 'Gdańsk Wrzeszcz',
            text: 'Dzięki Pedro oszczędzam minimum 200 zł miesięcznie. Najlepsza aplikacja dla tych, którzy lubią okazje!',
            rating: 5,
        },
        {
            name: 'Tomasz M.',
            location: 'Gdańsk Oliwa',
            text: 'Wreszcie aplikacja, która pokazuje tylko to co mnie interesuje. Żadnego spamu, same konkretne promki.',
            rating: 5,
        },
        {
            name: 'Magda S.',
            location: 'Sopot',
            text: 'Pedro to must-have dla każdego, kto mieszka w Trójmieście. Polecam w ciemno!',
            rating: 5,
        },
    ]

    return (
        <section id="opinie" className="bg-white py-section">
            <div className="container-pedro">
                {/* Section Heading */}
                <div className="text-center mb-16">
                    <h2 className="font-headline text-h2 text-pedro-dark mb-4">
                        Zaufali nam
                    </h2>
                    <p className="text-body text-gray-600">
                        Zobacz, co mówią nasi użytkownicy
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="card-brutal min-h-[280px] flex flex-col scroll-reveal revealed"
                            style={{ animationDelay: `${index * 0.15}s` }}
                        >
                            {/* Rating Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i} className="text-pedro-lime text-2xl">★</span>
                                ))}
                            </div>

                            {/* Testimonial Text */}
                            <p className="text-gray-700 mb-6 flex-grow leading-relaxed">
                                "{testimonial.text}"
                            </p>

                            {/* Author */}
                            <div className="mt-auto pt-4 border-t-2 border-gray-100">
                                <p className="font-bold text-pedro-dark">{testimonial.name}</p>
                                <p className="text-sm text-gray-500">{testimonial.location}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Partner Logos Placeholder */}
                <div className="mt-16 text-center">
                    <p className="text-sm text-gray-500 mb-8 uppercase tracking-wider">
                        Partnerzy PEDRO
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-300">
                        {['Pizza Hut', 'McDonald\'s', 'Żabka'].map((partner) => (
                            <div
                                key={partner}
                                className="text-2xl font-bold text-pedro-dark px-8 py-4 bg-gray-100 rounded-card"
                            >
                                {partner}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
