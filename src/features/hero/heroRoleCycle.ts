import gsap from "gsap";

const ROLES = ["Desenvolvedor", "Front-end", "Back-end", "Web Designer", "Fullstack"];
const PRIMARY = "#1ea7b6";
const INTERVAL = 3.5;

export function cycleHeroRole(el: HTMLElement) {
  let index = 0;

  function flickerAndSwap() {
    const nextIndex = (index + 1) % ROLES.length;
    const nextWord = ROLES[nextIndex];

    const tl = gsap.timeline({
      onComplete: () => {
        el.textContent = nextWord;
        gsap.set(el, { color: "", opacity: 1 });
        index = nextIndex;
        gsap.delayedCall(INTERVAL, flickerAndSwap);
      },
    });

    tl
      .to(el, { opacity: 0.15, color: PRIMARY, duration: 0.06 })
      .to(el, { opacity: 1, color: PRIMARY, duration: 0.06 })
      .to(el, { opacity: 0.15, color: PRIMARY, duration: 0.08 })
      .to(el, { opacity: 1, color: PRIMARY, duration: 0.08 })
      .to(el, { opacity: 0.15, color: PRIMARY, duration: 0.1 })
      .to(el, { opacity: 1, color: PRIMARY, duration: 0.1 })
      .to(el, { opacity: 0, duration: 0.2 });
  }

  gsap.delayedCall(4, flickerAndSwap);
}
