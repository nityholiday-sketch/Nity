import Image from "next/image";

const services = [
    {
        number: "01",
        title: "Travel Plan",
        description: "Every journey begins with thoughtful planning. Our tours are carefully designed to match your preferences, pace, and comfort. From religious chalks to scenic viewpoints, we ensure a smooth and memorable travel experience, every time."
    },
    {
        number: "02",
        title: "Accommodation",
        description: "We believe comfort and good food are the heart of every great journey. That's why we choose clean, cozy hotels with the best amenities. And with meals prepared by our own Maharaj, you'll enjoy homestyle food that feels familiar, comforting, and delicious—no matter how far you are from home."
    }
]

export function WhatWeProvide() {
    return (
        <section className="bg-secondary py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">What Services We Provide</h2>
                        {services.map(service => (
                            <div key={service.number}>
                                <h3 className="font-headline text-2xl font-bold text-primary mb-2">{service.number}. {service.title}</h3>
                                <p className="text-muted-foreground">{service.description}</p>
                            </div>
                        ))}
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-4">
                            <Image src="https://picsum.photos/400/300?random=21" alt="Comfortable hotel room" width={400} height={300} className="rounded-lg shadow-md" data-ai-hint="hotel room" />
                            <Image src="https://picsum.photos/400/300?random=22" alt="Travel map and essentials" width={400} height={300} className="rounded-lg shadow-md" data-ai-hint="travel map" />
                        </div>
                        <div className="grid gap-4 mt-8">
                            <Image src="https://picsum.photos/400/300?random=23" alt="Chef preparing a meal" width={400} height={300} className="rounded-lg shadow-md" data-ai-hint="chef cooking" />
                            <Image src="https://picsum.photos/400/300?random=24" alt="Delicious Indian thali" width={400} height={300} className="rounded-lg shadow-md" data-ai-hint="indian food" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
