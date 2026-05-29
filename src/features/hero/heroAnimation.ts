import gsap from "gsap";

export function animateHero() {
  const subtitle = document.getElementById("hero-subtitle");
  const title = document.getElementById("hero-title");
  const quote = document.getElementById("hero-quote");
  const card = document.getElementById("hero-card");

  const tl = gsap.timeline({ defaults: { ease: "sine.out", duration: 1.4 } });

  if (subtitle) {
    tl.from(subtitle, { y: 25, opacity: 0 });
  }

  if (title) {
    tl.from(title, { y: 25, opacity: 0 }, "-=0.6");
  }

  if (quote) {
    tl.from(quote, { y: 20, opacity: 0, duration: 1.2 }, "-=0.5");
  }

  if (card) {
    tl.from(card, { y: 25, opacity: 0, scale: 0.94, duration: 2.8 }, 0);
  }
}
