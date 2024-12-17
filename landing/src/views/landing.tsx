import { Button } from "@/components/ui/button";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

import gameplay1 from "@/resources/gameplay1.png"
import { FlipWords } from "@/components/ui/flip-words";
import BoxReveal from "@/components/ui/box-reveal";

const products = [
    {
        title: "Gameplay",
        thumbnail: gameplay1,
    }, {
        title: "Gameplay",
        thumbnail: gameplay1,
    }, {
        title: "Gameplay",
        thumbnail: gameplay1,
    },
]

const LandingButton = ({ text, className }: { text: string, className?: string }) => {
    return (
        <Button
            className={`
            px-8 py-4 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]
            transition duration-200
            hover:bg-white/90
            text-2xl
            h-fit
            w-full
            ${className}
            `}
        >{text}</Button>
    )
}

export const Header = () => {
    const words = [
        "frictionless", "convenient", "easy", "fun", "ergonomic",
        "real-time", "relaxing", "snappy", "seamless",
        "performant", "responsive", "intuitive"
    ]
    return (
        <div className="flex flex-col items-start gap-8 ml-4">
            <div className="flex flex-col items-start justify-start gap-4">
                <h1 className="text-5xl font-bold text-foreground text-start">
                    <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                        <span>Welcome to the <br /></span>
                    </BoxReveal>
                    <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                        <span className="text-7xl">Resource Game</span>
                    </BoxReveal>
                </h1>


                <p className="text-2xl text-start text-neutral-600">
                    <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                        <span>A Splendor-inspired game built for <FlipWords words={words} /></span>
                    </BoxReveal>

                    <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                        <span>web multiplayer.</span>
                    </BoxReveal>
                </p>

            </div>

            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                <div className="flex flex-col items-start justify-center gap-4 mt-4 mb-4 mr-4">
                    <LandingButton className="" text="Create Game" />
                    <div className="flex flex-row items-center justify-center gap-4">
                        <LandingButton className="" text="Tutorial" />
                        <LandingButton className="" text="Card Gallery" />
                        <LandingButton className="" text="Dev Blog" />
                    </div>
                </div>
            </BoxReveal>
        </div >
    );
};


function Landing() {
    return (
        <div className="flex flex-row w-screen h-screen overflow-hidden">
            <div className="flex-1 flex flex-col w-full h-full items-center justify-center px-4">
                <Header />
            </div>
            <div className="flex-1">
                <HeroParallax products={products} />
            </div>
        </div>

    )
}

export default Landing
