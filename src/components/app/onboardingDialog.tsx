import React, { useState } from "react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./onboardingDialog.css";

const OLJEPLAN_LINK = "https://mdg.no/oljeplan";

type Slide = {
  title: string;
  body: React.ReactNode;
  icon: string;
  alt: string;
};

const slides: Slide[] = [
  {
    title: "Fas ut oljen – bli en klimahelt!",
    body: "Norsk olje og gass har gitt oss enorm rikdom, men har nå blitt et stort problem: Den bidrar enormt til klimaproblemet, den stjeler kompetanse og strøm fra annet næringsliv og gjør norsk økonomi veldig sårbar når våre største kunder kutter ut fossil energi.",
    icon: "/offshore-platform-removebg.png",
    alt: "Offshore platform",
  },
  {
    title: "Klimautvalget 2050",
    body: (
      <>
        Klimautvalget 2050 har derfor anbefalt Norge å lage en «strategi for
        sluttfasen av norsk petroleumsvirksomhet», og{" "}
        <a href={OLJEPLAN_LINK} target="_blank" rel="noreferrer">
          MDG har laget en slik plan
        </a>{" "}
        som faser ut feltene på norsk sokkel innen 2040. Vi starter naturlig nok
        med de feltene som slipper ut mest og produserer minst.
      </>
    ),
    icon: "/arild-hermstad.png",
    alt: "MDG partileder Arild Hermstad",
  },
  {
    title: "Din oppgave",
    body: "Ingen regjeringer har giddet diskutere hvordan utfasing av olje- og gassproduksjon kan skje på en smart måte, noe som er veldig dumt. Men nå har du sjansen! Velg hvilke felter du vil fase ut i hvilken periode, og se hva som skjer med utslippene.",
    icon: "/chart-removebg.png",
    alt: "Chart",
  },
  {
    title: "Er du klar?",
    body: "Har du det som skal til for å lage utfasingsplanen Norge trenger?",
    icon: "/calendar-removebg.png",
    alt: "Calendar",
  },
];

const OnboardingDialog = ({
  open,
  onClose,
  storageKey = "onboarding_seen_v1",
  themeClassName = "ob-theme-brand",
}: {
  open: boolean;
  onClose: () => void;
  storageKey?: string;
  themeClassName?: string; // e.g. "ob-theme-brand" or "ob-theme-neutral"
}) => {
  const [swiper, setSwiper] = useState<any>(null);
  const [index, setIndex] = useState(0);

  if (!open) return null;

  return (
    <div className="ob-overlay" role="dialog" aria-modal="true">
      <div className={"ob-wrap" + (themeClassName ? ` ${themeClassName}` : "")}>
        <button
          className="ob-skip"
          onClick={() => {
            try {
              if (storageKey) localStorage.setItem(storageKey, "1");
            } catch {}
            onClose();
          }}
          aria-label="Hopp over"
        >
          Hopp over
        </button>
        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          onSwiper={(s) => {
            setSwiper(s);
            setIndex(s?.activeIndex ?? 0);
          }}
          onSlideChange={(s) => setIndex(s.activeIndex ?? 0)}
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <section
                className="ob-slide"
                aria-label={`${slide.title} (${i + 1} av ${slides.length})`}
              >
                <div className="ob-center">
                  <h2 className="ob-title">{slide.title}</h2>
                  <p className="ob-text">{slide.body}</p>
                  {slide.icon && (
                    <img
                      src={slide.icon}
                      alt={slide.alt ?? slide.title}
                      className="ob-icon"
                    />
                  )}
                </div>
              </section>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="ob-controls">
          <div className="ob-dots" role="tablist" aria-label="Sider">
            {slides.map((_, d) => (
              <button
                key={d}
                role="tab"
                aria-selected={d === index}
                aria-label={`Gå til side ${d + 1}`}
                onClick={() => swiper && swiper.slideTo(d)}
                className={`ob-dot ${d === index ? "is-active" : ""}`}
              />
            ))}
          </div>

          <div className="ob-nav">
            <button
              disabled={index === 0}
              onClick={() => swiper && swiper.slidePrev()}
              className="ob-btn ob-btn-secondary"
            >
              Tilbake
            </button>

            {index < slides.length - 1 ? (
              <button
                onClick={() => swiper && swiper.slideNext()}
                className="ob-btn ob-btn-primary"
              >
                Neste
              </button>
            ) : (
              <button
                onClick={() => {
                  try {
                    if (storageKey) localStorage.setItem(storageKey, "1");
                  } catch {}
                  onClose();
                }}
                className="ob-btn ob-btn-primary"
              >
                Jeg er klar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingDialog;
