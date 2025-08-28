import Image from "next/image";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

const certificatesSlide = {
  slides: [
    {
      images: [
        {
          title: "title",
          path: "/cou.png",
          link: "https://www.coursera.org/account/accomplishments/certificate/IL0HCJJUBT3V",
        },
        {
          title: "title",
          path: "/web.png",
          link: "https://10minuteschool.com/en/certificate/624d5be672f9f/?srsltid=AfmBOooTLcJJlScqpm0ZmX1RDL7iShYoWraFzn61Oc_BqAHmG2cokeFo",
        },
        {
          title: "title",
          path: "/cou3.png",
          link:"https://www.coursera.org/account/accomplishments/verify/7X8X1F2QG6QI",
        },
        {
          title: "title",
          path: "/ml.png",
          link: "https://www.kaggle.com/learn/certification/rafidsiddique/intro-to-machine-learning",
        },
      ],
    },
    {
      images: [
        {
          title: "title",
          path: "/cou1.png",
          link: "https://www.coursera.org/account/accomplishments/certificate/7X8X1F2QG6QI",
        },
        {
          title: "title",
          path: "/freelan.png",
          link: "https://10minuteschool.com/skills/instructors/joyeta-banerjee/?srsltid=AfmBOopZb7pj0rO2iOIZj2mWEczupaQlSMGKLooi4kgiNY9o0UYJ1xcX",
        },
        {
          title: "title",
          path: "/ml2.png",
          link: "https://www.kaggle.com/learn/certification/rafidsiddique/intermediate-machine-learning",
        },
        {
          title: "title",
          path: "/gra.png",
          link: "https://ghoorilearning.com/",
        },
      ],
    },
  ],
};

const CertificatesSlider = () => {
  return (
    <Swiper
      spaceBetween={10}
      pagination={{
        clickable: true,
      }}
      modules={[Pagination]}
      className="h-[280px] sm:h-[480px]"
    >
      {certificatesSlide.slides.map((slide, i) => (
        <SwiperSlide key={i}>
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            {slide.images.map((image, imageI) => (
              <div
                className="relative rounded-lg overflow-hidden flex items-center justify-center group"
                key={imageI}
              >
                <div className="flex items-center justify-center relative overflow-hidden group">
                  {/* image */}
                  <Image
                    src={image.path}
                    alt={image.title}
                    width={300}
                    height={200}
                  />

                  {/* overlay gradient */}
                  <div
                    className="absolute inset-0 bg-gradient-to-l from-transparent via-[#e838cc] to-[#4a22bd] opacity-0 group-hover:opacity-80 transition-all duration-700"
                    aria-hidden
                  />

                  {/* title */}
                  <div className="absolute bottom-0 translate-y-full group-hover:-translate-y-10 group-hover:xl:-translate-y-20 transition-all duration-300">
                    <Link
                      href={image.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center gap-x-2 text-[13px] tracking-[0.2em]"
                    >
                      {/* title part 1 */}
                      <div className="delay-100">SEE</div>
                      {/* title part 2 */}
                      <div className="translate-y-[500%] group-hover:translate-y-0 transition-all duration-300 delay-150">
                        CERFICAIES
                      </div>
                      {/* icon */}
                      <div className="text-xl translate-y-[500%] group-hover:translate-y-0 transition-all duration-300 delay-150">
                        <BsArrowRight aria-hidden />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CertificatesSlider;
