'use client'

export default function SocialProof() {
    const testimonials = [
        {
            name: 'Ty, za 2 tygodnie',
            location: 'Gdańsk',
            text: 'Pedro? Brzmi ciekawie. Dam mu szansę.',
            rating: 5,
        },
        {
            name: 'ktoś z Trójmiasta (już niedługo)',
            location: 'Gdynia',
            text: 'W końcu aplikacja, która pokazuje promocje, a nie spam.',
            rating: 5,
        },
        {
            name: 'przyszły użytkownik PEDRO',
            location: 'Sopot',
            text: 'Czemu nikt wcześniej na to nie wpadł?',
            rating: 5,
        },
    ]

    const dreamPartners = [
        '🍕 Twoja ulubiona pizzeria',
        '☕ Kawiarnia z najlepszą flat white', 
        '🧘 Studio, do którego chodzisz po pracy',
        '🍔 Burgerownia, którą znasz z Instagrama'
    ]

    return (
        <section id="opinie" className="bg-white py-section">
            <div className="container-pedro">
                {/* Section Heading */}
                <div className="text-center mb-16">
                    <h2 className="font-headline text-h2 text-pedro-dark mb-4">
                        Tak będą o nas mówić
                    </h2>
                    <p className="text-body text-gray-600">
                        Gdy tylko wystartujemy na serio 🚀
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

                {/* Dream Partners Section */}
                <div className="mt-16 text-center">
                    <h3 className="font-headline text-h3 text-pedro-dark mb-4">
                        Partnerzy? Jeszcze o nich marzymy 😎
                    </h3>
                    <p className="text-body text-gray-600 mb-8">
                        PEDRO dopiero startuje... ale dokładnie te miejsca chcemy tu widzieć 👇
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {dreamPartners.map((partner, index) => (
                            <div
                                key={index}
                                className="text-xl font-bold text-pedro-dark px-6 py-4 bg-gray-100 rounded-card hover:transform hover:-translate-y-2 hover:shadow-brutal-sm-lime transition-all duration-250 min-h-[120px] flex items-center justify-center text-center"
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
