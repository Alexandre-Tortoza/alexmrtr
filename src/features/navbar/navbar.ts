import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface NavbarHandlers {
  linkEnter: (this: HTMLAnchorElement) => void;
  linkLeave: (this: HTMLAnchorElement) => void;
}

export function initNavbar(): () => void {
  const navbar = document.getElementById("navbar");
  const container = document.getElementById("navbar-container");
  if (!navbar || !container) return () => {};

  const links = navbar.querySelectorAll<HTMLAnchorElement>(".navbar-link");
  const isIndex = window.location.pathname === "/";

  // Identify active link
  const activeLink = Array.from(links).find(link => {
    const href = link.getAttribute("href");
    if (href === "/" && window.location.pathname === "/") return true;
    return href !== "/" && window.location.pathname.startsWith(href || "");
  });

  // Set initial state for active link
  if (activeLink) {
    gsap.set(activeLink, {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(12px)",
      borderColor: "rgba(255, 255, 255, 0.05)",
    });
  }

  // Visibility Logic
  if (!isIndex) {
    gsap.set(navbar, { y: 0, opacity: 1 });
  } else {
    ScrollTrigger.create({
      onUpdate: (self) => {
        const scrollY = self.scroll();
        const direction = self.direction; // 1 = down, -1 = up
        const isHeroArea = scrollY < window.innerHeight * 0.8;

        if (direction === 1 && scrollY > 60) {
          gsap.to(navbar, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "expo.out",
            overwrite: "auto",
          });
        } else if (direction === -1 && (isHeroArea || scrollY < 60)) {
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
  }

  // Hover Effect: Swap backgrounds between buttons and container
  const onNavbarEnter = () => {
    gsap.to(container, {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(20px)",
      borderColor: "rgba(255, 255, 255, 0.08)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      duration: 0.4,
      ease: "power2.out",
    });

    // Remove background from active link when navbar is hovered
    if (activeLink) {
      gsap.to(activeLink, {
        backgroundColor: "rgba(255, 255, 255, 0)",
        backdropFilter: "blur(0px)",
        borderColor: "rgba(255, 255, 255, 0)",
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  const onNavbarLeave = () => {
    gsap.to(container, {
      backgroundColor: "rgba(255, 255, 255, 0)",
      backdropFilter: "blur(0px)",
      borderColor: "rgba(255, 255, 255, 0)",
      boxShadow: "none",
      duration: 0.4,
      ease: "power2.inOut",
    });

    // Restore background to active link when leaving navbar
    if (activeLink) {
      gsap.to(activeLink, {
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(255, 255, 255, 0.05)",
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  };

  container.addEventListener("mouseenter", onNavbarEnter);
  container.addEventListener("mouseleave", onNavbarLeave);

  const handlerMap = new Map<HTMLAnchorElement, NavbarHandlers>();

  links.forEach((link) => {
    const linkEnter = () => {
      // Individual link hover effects (scale, color, etc.)
      gsap.to(link, {
        y: -2,
        scale: 1.05,
        color: "#1ea7b6",
        duration: 0.3,
        ease: "back.out(1.5)",
        overwrite: "auto",
      });

      const line = link.querySelector(".navbar-line") as HTMLElement;
      if (line) {
        gsap.to(line, {
          width: "80%",
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    };

    const linkLeave = () => {
      gsap.to(link, {
        y: 0,
        scale: 1,
        color: "",
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });

      const line = link.querySelector(".navbar-line") as HTMLElement;
      if (line) {
        gsap.to(line, {
          width: "0%",
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
    container.removeEventListener("mouseenter", onNavbarEnter);
    container.removeEventListener("mouseleave", onNavbarLeave);

    links.forEach((link) => {
      const handlers = handlerMap.get(link);
      if (handlers) {
        link.removeEventListener("mouseenter", handlers.linkEnter);
        link.removeEventListener("mouseleave", handlers.linkLeave);
      }
    });
  };
}

