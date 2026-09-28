# Third-party components

This document records source-delivered components used by the editorial cinematic prototype. No paid component or paid registry code is included.

| Component | Source library | Source URL | Status | Dependencies | Used in | Modified |
| --- | --- | --- | --- | --- | --- | --- |
| Circular Gallery | React Bits | https://www.reactbits.dev/components/circular-gallery | Free, open source (MIT + Commons Clause) | `react`, `ogl` | Chapter IV, “Just the two of us” | Yes. Reduced to an image-only wedding gallery; removed remote demo data, labels, font loading, wheel capture, and continuous decorative deformation. V2 enlarges the desktop arc and supplies an art-directed, natural-flow four-image composition for tablet, mobile, and reduced motion. |

The upstream React Bits license is preserved in comments beside the adapted implementation. React Bits Pro was not used.

## Motion infrastructure

- Guests uses a local TypeScript adaptation of [Sotnichenko Infinite Canvas 3D](https://framer.com/m/Sotnichenko-InfiniteCanvas3D-06fB3Q.js@rg6UcAMMltj7dfL4TFh9), supplied by the user. The source's seeded placement, perspective projection, wrapped space, depth fading and inertia are retained. Framer property controls, sample images and its fullscreen viewer are replaced with typed props, wedding configuration and the existing image lightbox. No Framer runtime or new dependency is installed. All supplied guest photos participate in the scene. Vertical touch scrolling stays native; depth buttons and keyboard controls support navigation. A pause control and a full photo grid are available, and reduced-motion users receive the grid. Animation stops when offscreen or when the document is hidden.

- Lenis `1.3.26` provides root smooth scrolling only inside `/prototype/editorial-cinematic`. It shares GSAP's ticker, updates ScrollTrigger from Lenis scroll events, keeps touch scrolling native, honors `prefers-reduced-motion`, and is destroyed when the prototype unmounts.

## Investigated or removed

- React Bits Scroll Stack was not integrated because the current free source depends on Lenis. This prototype explicitly uses native scrolling and forbids global smooth-scroll systems, so Chapter V uses an original GSAP portrait stack.
- React Bits Masonry was removed in V2. The regular column rhythm read as a generic gallery, so Chapter VI now uses a custom semantic CSS composition with one scoped GSAP timeline and no additional dependency.
- OriginKit was not used. The prototype did not need an additional delivery after the stable GSAP mask reveal and restrained typographic decompression were in place.

## Intentional mobile differences

- The ceremony becomes a vertical editorial sequence below 900px instead of retaining the desktop pinned horizontal track.
- The portrait stack becomes a natural-flow, varied image sequence below 900px instead of a pinned stack.
- Circular Gallery never captures vertical wheel/touch scrolling; tablet, mobile, and reduced-motion users receive a static four-image composition.
- Celebration becomes a deliberately uneven 12-column editorial composition below 900px; it has no masonry dependency.
