import { Timer } from "lucide-react";
import RecentCardPage from "./recent-card-page";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";

export default function RecentPagesCarousel() {
  return (
    <>
    <div className="w-full max-w-screen m-10">
        <div className="flex items-center gap-1 pl-4">
            <Timer className="w-4 h-4"/>
            <span className="text-sm font-semibold">Recent Pages</span>
        </div>
        <Carousel className="w-full pt-3">
            <CarouselContent className="-ml-1">
                {Array.from({ length: 10 }).map((_, index) => (
                    <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/6">
                        <RecentCardPage index={index} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    </div>
        
    </>
  );
}
