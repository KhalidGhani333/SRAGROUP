import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useConsent, type ConsentCategories } from "@/lib/consent";
import { useT } from "@/i18n/useT";
import { LocalizedLink } from "./LocalizedLink";

export function CookieConsent() {
  const { t } = useT();
  const { ready, hasDecided, preferencesOpen, acceptAll, rejectAll, openPreferences } =
    useConsent();
  const showBanner = ready && !hasDecided && !preferencesOpen;

  return (
    <>
      {showBanner && (
        <section
          role="region"
          aria-label={t("consent.bannerLabel")}
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-offwhite/10 bg-charcoal text-offwhite shadow-2xl"
        >
          <div className="site-container flex flex-col gap-5 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="font-display text-lg font-semibold">{t("consent.title")}</p>
              <p className="mt-1 text-sm leading-6 text-offwhite/70">
                {t("consent.text")}{" "}
                <LocalizedLink page="cookies" className="underline underline-offset-4">
                  {t("consent.policy")}
                </LocalizedLink>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                className="rounded-none border-offwhite/30 bg-transparent text-offwhite hover:bg-offwhite/10 hover:text-offwhite"
                onClick={openPreferences}
              >
                {t("consent.customize")}
              </Button>
              <Button
                variant="outline"
                className="rounded-none border-offwhite/30 bg-transparent text-offwhite hover:bg-offwhite/10 hover:text-offwhite"
                onClick={rejectAll}
              >
                {t("consent.reject")}
              </Button>
              <Button
                className="rounded-none bg-offwhite text-charcoal hover:bg-offwhite/90"
                onClick={acceptAll}
              >
                {t("consent.accept")}
              </Button>
            </div>
          </div>
        </section>
      )}
      <PreferencesDialog />
    </>
  );
}

function PreferencesDialog() {
  const { t } = useT();
  const { consent, preferencesOpen, closePreferences, save, acceptAll } = useConsent();
  const [choice, setChoice] = useState<ConsentCategories>({ analytics: false, marketing: false });

  useEffect(() => {
    if (preferencesOpen) {
      setChoice({ analytics: consent?.analytics ?? false, marketing: consent?.marketing ?? false });
    }
  }, [preferencesOpen, consent]);

  return (
    <Dialog.Root open={preferencesOpen} onOpenChange={(open) => !open && closePreferences()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-charcoal/70 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[70] max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-background p-6 shadow-2xl sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <Dialog.Title className="font-display text-2xl font-semibold">
              {t("consent.modalTitle")}
            </Dialog.Title>
            <Dialog.Close
              className="-mr-2 -mt-1 grid size-9 place-items-center text-muted-foreground hover:text-foreground"
              aria-label={t("common.close")}
            >
              <X className="size-5" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("consent.modalText")}
          </Dialog.Description>
          <div className="mt-6 divide-y divide-border border-y border-border">
            <Category
              title={t("consent.categories.necessary.title")}
              text={t("consent.categories.necessary.text")}
              checked
              disabled
              note={t("consent.alwaysOn")}
            />
            <Category
              title={t("consent.categories.analytics.title")}
              text={t("consent.categories.analytics.text")}
              checked={choice.analytics}
              onChange={(analytics) => setChoice((c) => ({ ...c, analytics }))}
            />
            <Category
              title={t("consent.categories.marketing.title")}
              text={t("consent.categories.marketing.text")}
              checked={choice.marketing}
              onChange={(marketing) => setChoice((c) => ({ ...c, marketing }))}
            />
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" className="rounded-none" onClick={() => save(choice)}>
              {t("consent.save")}
            </Button>
            <Button className="rounded-none" onClick={acceptAll}>
              {t("consent.accept")}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Category({
  title,
  text,
  checked,
  disabled,
  note,
  onChange,
}: {
  title: string;
  text: string;
  checked: boolean;
  disabled?: boolean;
  note?: string;
  onChange?: (value: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div>
        <label htmlFor={id} className="font-semibold">
          {title}
        </label>
        <p id={`${id}-text`} className="mt-1 text-sm leading-6 text-muted-foreground">
          {text}
        </p>
        {note && <p className="mt-1 text-xs font-semibold text-solar-ink">{note}</p>}
      </div>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled ?? false}
        {...(onChange ? { onCheckedChange: onChange } : {})}
        aria-describedby={`${id}-text`}
        className="mt-1"
      />
    </div>
  );
}
