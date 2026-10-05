import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useCallback, useState, type KeyboardEvent } from "react";
import { useT } from "@/i18n/useT";

/** Bento tiles: the first image spans 2×2; a lone image in the last row stretches full width. */
function tileClass(i: number, total: number) {
  if (i === 0) return "sm:col-span-2 lg:row-span-2";
  const rest = total - 3;
  if (i === total - 1 && i >= 3 && rest % 3 === 1) return "sm:col-span-2 lg:col-span-3 [&_img]:lg:aspect-[3/1]";
  if (i >= total - 2 && i >= 3 && rest % 3 === 2) return "lg:[&:last-child]:col-span-2";
  return "";
}

/**
 * Image gallery grid with a keyboard-accessible lightbox:
 * Enter/Space opens, ← → navigate, Esc closes and focus returns to the thumbnail.
 */
export function Gallery({ images, name }: { images: string[]; name: string }) {
  const { t } = useT();
  const [index, setIndex] = useState<number | null>(null);
  const total = images.length;
  const go = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + total) % total)),
    [total],
  );
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };
  const current = index === null ? undefined : images[index];

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((src, i) => (
          <li key={src} className={tileClass(i, images.length)}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group block h-full w-full overflow-hidden bg-muted focus-visible:outline-offset-4"
              aria-label={t("project.openImage", { index: i + 1, total })}
            >
              <img
                src={src}
                alt={t("project.imageAlt", { name, index: i + 1 })}
                loading="lazy"
                decoding="async"
                width={1600}
                height={1067}
                className="aspect-[3/2] h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      <Dialog.Root open={index !== null} onOpenChange={(open) => !open && setIndex(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-charcoal/95" />
          <Dialog.Content
            onKeyDown={onKeyDown}
            className="fixed inset-0 z-[80] flex flex-col text-offwhite outline-none"
            aria-describedby={undefined}
          >
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <Dialog.Title className="truncate text-sm font-semibold">
                {t("project.lightboxLabel", { name })}
              </Dialog.Title>
              <div className="flex items-center gap-4">
                <span className="text-sm tabular-nums text-offwhite/60" aria-live="polite">
                  {index !== null && t("project.counter", { index: index + 1, total })}
                </span>
                <Dialog.Close
                  className="grid size-11 place-items-center hover:bg-offwhite/10"
                  aria-label={t("common.close")}
                >
                  <X className="size-6" aria-hidden />
                </Dialog.Close>
              </div>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20">
              {current && index !== null && (
                <img
                  key={current}
                  src={current}
                  alt={t("project.imageAlt", { name, index: index + 1 })}
                  className="max-h-full max-w-full object-contain animate-in fade-in-0 duration-300"
                />
              )}
              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label={t("common.previous")}
                    className="absolute left-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center bg-charcoal/60 hover:bg-offwhite/15 sm:left-4"
                  >
                    <ArrowLeft className="size-6" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label={t("common.next")}
                    className="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center bg-charcoal/60 hover:bg-offwhite/15 sm:right-4"
                  >
                    <ArrowRight className="size-6" aria-hidden />
                  </button>
                </>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
