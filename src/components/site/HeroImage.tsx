import { heroSources } from "@/components/site/images";

/** Eager hero images are discovered in server HTML, before React hydrates. */
export function HeroImage({
  src,
  className,
  sizes = "100vw",
}: {
  src: string;
  className: string;
  sizes?: string;
}) {
  const source = heroSources[src];
  return (
    <picture>
      {source?.avif && source.avifSmall && (
        <source
          type="image/avif"
          srcSet={`${source.avifSmall} 768w, ${source.avif} ${source.width}w`}
          sizes={sizes}
        />
      )}
      <img
        src={src}
        srcSet={source ? `${source.small} 768w, ${src} ${source.width}w` : undefined}
        sizes={source ? sizes : undefined}
        alt=""
        width={source?.width}
        height={source?.height}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className={className}
      />
    </picture>
  );
}
