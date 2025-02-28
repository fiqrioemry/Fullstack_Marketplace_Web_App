import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselContent,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const HomeBanner = () => {
  const [api, setApi] = useState(null);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="px-2 md:px-0">
      <div>
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent>
            {[...Array(3)].map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex items-center justify-center">
                      <img
                        className="w-full h-full"
                        src="https://images.tokopedia.net/img/NsjrJu/2020/9/25/b1d2ed1e-ef80-4d7a-869f-a0394f0629be.jpg?ect=4g"
                        alt="banner"
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default HomeBanner;
