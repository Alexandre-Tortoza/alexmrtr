import { createAsciiArt } from "../../ascii-art/asciiArt";
import gsap from "gsap";

export interface PhotoData {
  id: string;
  title: string;
  description: string;
  src: string;
}

export interface PhotoCardHandle {
  el: HTMLElement;
  destroy: () => void;
}

export function createPhotoCard(
  photo: PhotoData,
  top: number,
  left: number,
  width: number,
  height: number,
): PhotoCardHandle {
  const template = document.getElementById(
    "photo-card-template",
  ) as HTMLTemplateElement | null;
  if (!template) throw new Error("photo-card-template not found");

  const card = template.content.firstElementChild!.cloneNode(
    true,
  ) as HTMLElement;
  card.dataset.id = photo.id;
  card.dataset.src = photo.src;

  const img = card.querySelector<HTMLImageElement>(".photo-img")!;
  img.src = photo.src;
  img.alt = photo.title;

  const titleEl = card.querySelector<HTMLElement>(".vcard-title")!;
  const descEl = card.querySelector<HTMLElement>(".vcard-desc")!;
  if (titleEl) titleEl.textContent = photo.title;
  if (descEl) descEl.textContent = photo.description;

  card.style.top = `${top}px`;
  card.style.left = `${left}px`;
  card.style.width = `${width}px`;
  card.style.height = `${height}px`;

  const canvas = card.querySelector<HTMLCanvasElement>(".photo-ascii")!;
  const skeleton = card.querySelector<HTMLElement>(".vcard-skeleton")!;
  const shine = card.querySelector<HTMLElement>(".vcard-shine")!;

  let cleanupAscii: (() => void) | null = null;
  let destroyed = false;

  const unlock = () => {
    if (destroyed) return;
    localStorage.setItem(`photo-unlocked-${photo.id}`, "true");

    gsap.to(canvas, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        if (cleanupAscii) cleanupAscii();
      },
    });
    gsap.to(shine, { opacity: 0, duration: 0.8, ease: "power2.inOut" });
    gsap.to(img, { opacity: 1, duration: 0.8, ease: "power2.inOut" });
  };

  const isUnlocked =
    localStorage.getItem(`photo-unlocked-${photo.id}`) === "true";

  if (isUnlocked) {
    skeleton.remove();
    gsap.set(canvas, { opacity: 0, visibility: "hidden" });
    gsap.set(shine, { opacity: 0 });
    gsap.set(img, { opacity: 1 });
  } else {
    createAsciiArt(canvas, photo.src, {
      fontSize: 24,
      artStyle: "classic",
      colorMode: "fullcolor",
      brightness: 0,
      contrast: 0,
    })
      .then((cleanup) => {
        if (destroyed) {
          cleanup();
          return;
        }
        cleanupAscii = cleanup;
        gsap.to(skeleton, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => skeleton.remove(),
        });
      })
      .catch(() => {
        if (!destroyed) skeleton.remove();
      });

    card.addEventListener(
      "click",
      () => {
        if (
          localStorage.getItem(`photo-unlocked-${photo.id}`) !== "true"
        ) {
          unlock();
        }
      },
      { once: true },
    );
  }

  return {
    el: card,
    destroy: () => {
      destroyed = true;
      if (cleanupAscii) cleanupAscii();
      card.remove();
    },
  };
}
