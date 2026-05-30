import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface NavbarHandlers {
  linkEnter: (this: HTMLAnchorElement) => void;
  linkLeave: (this: HTMLAnchorElement) => void;
}

export function initNavbar(): () => void {
  const navbar = document.getElementById("navbar");
  if (!navbar) return () => {};

  const links = navbar.querySelectorAll<HTMLAnchorElement>(".navbar-link");

  ScrollTrigger.create({
    onUpdate: (self) => {
      const scrollY = self.scroll();
      const direction = self.direction; // 1 = down, -1 = up
      const isHeroArea = scrollY < window.innerHeight * 0.8;

      // Mostra ao scrollar para baixo (após 60px)
      if (direction === 1 && scrollY > 60) {
        gsap.to(navbar, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "expo.out",
          overwrite: "auto",
        });
      }
      // Esconde ao scrollar para cima APENAS se estiver na área do Hero ou muito no topo
      else if (direction === -1 && (isHeroArea || scrollY < 60)) {
        gsap.to(navbar, {
          y: "-120%",
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      }
    },
  });

  const handlerMap = new Map<HTMLAnchorElement, NavbarHandlers>();

  links.forEach((link) => {
    const linkEnter = () => {
      links.forEach((other) => {
        if (other !== link) {
          gsap.to(other, {
            opacity: 0.4,
            scale: 0.95,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });

      gsap.to(link, {
        y: -3,
        scale: 1.05,
        color: "#1ea7b6",
        textShadow: "0 0 20px rgba(30,167,182,0.4)",
        duration: 0.3,
        ease: "back.out(1.5)",
        overwrite: "auto",
      });

      const line = link.querySelector(".navbar-line") as HTMLElement;
      if (line) {
        gsap.to(line, {
          scaleX: 1,
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    };

    const linkLeave = () => {
      links.forEach((other) => {
        gsap.to(other, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      gsap.to(link, {
        y: 0,
        scale: 1,
        color: "",
        textShadow: "none",
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });

      const line = link.querySelector(".navbar-line") as HTMLElement;
      if (line) {
        gsap.to(line, {
          scaleX: 0,
          duration: 0.3,
          ease: "power2.in",
          overwrite: "auto",
        });
      }
    };

    link.addEventListener("mouseenter", linkEnter);
    link.addEventListener("mouseleave", linkLeave);

    handlerMap.set(link, { linkEnter, linkLeave });
  });

  return () => {
    ScrollTrigger.getAll().forEach((st) => st.kill());

    links.forEach((link) => {
      const handlers = handlerMap.get(link);
      if (handlers) {
        link.removeEventListener("mouseenter", handlers.linkEnter);
        link.removeEventListener("mouseleave", handlers.linkLeave);
      }
    });
  };
}
