import { zodResolver } from "@hookform/resolvers/zod";
import { useRouterState } from "@tanstack/react-router";
import { Building2, CheckCircle2, Loader2, MessageSquare, Paperclip, Sun, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { Trans } from "react-i18next";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitLead } from "@/lib/submitLead";
import { parseDivisionParam, type LeadDivision } from "@/i18n/routes";
import { useT } from "@/i18n/useT";
import { accent } from "./accent";
import { LocalizedLink } from "./LocalizedLink";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const divisions: LeadDivision[] = ["construction", "solar", "general"];
const projectTypes = ["industrial", "commercial", "residential"] as const;
const installationTypes = ["roof", "ground", "park"] as const;
const timelines = ["asap", "3to6", "6to12", "over12", "unknown"] as const;

const isPositiveNumber = (v: string) => {
  const n = Number(
    v
      .replace(/\s/g, "")
      .replace(/\.(?=\d{3}\b)/g, "")
      .replace(",", "."),
  );
  return Number.isFinite(n) && n > 0;
};

// Error messages are translation keys under contact.form.errors, so the schema is language-neutral.
const required = z.string().trim().min(1, "required");
const leadSchema = z
  .object({
    division: z.string().refine((v) => divisions.includes(v as LeadDivision), "required"),
    projectType: z.string(),
    area: z.string().trim(),
    installationType: z.string(),
    sizingMode: z.enum(["power", "bill"]),
    power: z.string().trim(),
    bill: z.string().trim(),
    location: z.string().trim(),
    timeline: z.string(),
    subject: z.string().trim(),
    firstName: required,
    lastName: required,
    company: required,
    role: z.string().trim(),
    email: required.email("email"),
    phone: required.regex(/^\+?[0-9\s().-]{6,20}$/, "phone"),
    message: required,
    gdpr: z.boolean().refine((v) => v, "gdpr"),
    marketing: z.boolean(),
  })
  .superRefine((d, ctx) => {
    const need = (path: keyof typeof d, ok: boolean, message = "required") => {
      if (!ok) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message });
    };
    const number = (path: "area" | "power" | "bill") => {
      const v = d[path];
      need(path, v !== "" && isPositiveNumber(v), v === "" ? "required" : "number");
    };
    if (d.division === "construction") {
      need("projectType", d.projectType !== "");
      number("area");
    }
    if (d.division === "solar") {
      need("installationType", d.installationType !== "");
      number(d.sizingMode);
    }
    if (d.division === "construction" || d.division === "solar") {
      need("location", d.location !== "");
      need("timeline", d.timeline !== "");
    }
    if (d.division === "general") need("subject", d.subject !== "");
  });

type LeadForm = z.infer<typeof leadSchema>;

const emptyForm: LeadForm = {
  division: "",
  projectType: "",
  area: "",
  installationType: "",
  sizingMode: "power",
  power: "",
  bill: "",
  location: "",
  timeline: "",
  subject: "",
  firstName: "",
  lastName: "",
  company: "",
  role: "",
  email: "",
  phone: "",
  message: "",
  gdpr: false,
  marketing: false,
};

const divisionIcons: Record<LeadDivision, LucideIcon> = {
  construction: Building2,
  solar: Sun,
  general: MessageSquare,
};

export function QuoteForm() {
  const { t, lang } = useT();
  const location = useRouterState({ select: (s) => s.location });
  const preselected = parseDivisionParam((location.search as Record<string, unknown>)["division"]);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, submitCount },
  } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
    defaultValues: { ...emptyForm, division: preselected ?? "" },
    mode: "onTouched",
  });

  useEffect(() => {
    if (preselected) setValue("division", preselected, { shouldValidate: false });
  }, [preselected, setValue]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const division = watch("division") as LeadDivision | "";
  const sizingMode = watch("sizingMode");
  const err = (key?: FieldError) =>
    key?.message ? t(`contact.form.errors.${key.message}`) : undefined;

  const onSubmit = async (data: LeadForm) => {
    if (fileError) return;
    const d = data.division as LeadDivision;
    const details: Record<string, string> =
      d === "construction"
        ? {
            projectType: data.projectType,
            area: data.area,
            location: data.location,
            timeline: data.timeline,
          }
        : d === "solar"
          ? {
              installationType: data.installationType,
              [data.sizingMode === "power" ? "powerKwp" : "annualBillEur"]: data[data.sizingMode],
              location: data.location,
              timeline: data.timeline,
            }
          : { subject: data.subject };
    const result = await submitLead({
      division: d,
      details,
      contact: {
        firstName: data.firstName,
        lastName: data.lastName,
        company: data.company,
        role: data.role,
        email: data.email,
        phone: data.phone,
      },
      message: data.message,
      ...(file ? { attachmentName: file.name } : {}),
      consent: { privacy: true, marketing: data.marketing },
      meta: { lang, page: location.href, submittedAt: new Date().toISOString() },
    });
    setStatus(result.ok ? "success" : "error");
  };

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="mt-12 border border-solar bg-solar/10 p-8 outline-none"
      >
        <CheckCircle2 className="size-9 text-solar-ink" aria-hidden />
        <h3 className="mt-5 text-2xl font-semibold">{t("contact.form.successTitle")}</h3>
        <p className="mt-2 text-muted-foreground">{t("contact.form.successText")}</p>
        <Button
          variant="outline"
          className="mt-6 rounded-none"
          onClick={() => {
            reset({ ...emptyForm, division: preselected ?? "" });
            setFile(null);
            setStatus("idle");
          }}
        >
          {t("contact.form.newRequest")}
        </Button>
      </div>
    );
  }

  const hasErrors = submitCount > 0 && (Object.keys(errors).length > 0 || fileError);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-10">
      <p className="text-xs text-muted-foreground">{t("contact.form.requiredNote")}</p>

      <Step number={1} title={t("contact.form.step1")}>
        <fieldset aria-describedby={errors.division ? "division-error" : undefined}>
          <legend className="mb-4 text-sm font-medium">{t("contact.form.step1Question")} *</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {divisions.map((d) => {
              const Icon = divisionIcons[d];
              const checkedStyle =
                d === "construction"
                  ? "has-[:checked]:border-construction has-[:checked]:bg-construction/10"
                  : d === "solar"
                    ? "has-[:checked]:border-solar has-[:checked]:bg-solar/10"
                    : "has-[:checked]:border-foreground has-[:checked]:bg-foreground/5";
              return (
                <label
                  key={d}
                  className={`relative flex cursor-pointer flex-col border-2 border-border bg-background p-5 transition-colors hover:border-foreground/40 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${checkedStyle}`}
                >
                  <input type="radio" value={d} className="sr-only" {...register("division")} />
                  <Icon
                    className={`size-7 ${accent[d === "general" ? "neutral" : d].text}`}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <span className="mt-6 font-display text-lg font-semibold">
                    {t(`common.divisions.${d}`)}
                  </span>
                  <span className="mt-1 text-xs leading-5 text-muted-foreground">
                    {t(`contact.form.divisionCards.${d}`)}
                  </span>
                </label>
              );
            })}
          </div>
          <ErrorText id="division-error" message={err(errors.division)} />
        </fieldset>
      </Step>

      {division && (
        <Step number={2} title={t("contact.form.step2")}>
          <div className="grid gap-5 sm:grid-cols-2">
            {division === "construction" && (
              <>
                <ChoiceGroup
                  label={t("contact.form.projectType")}
                  error={err(errors.projectType)}
                  options={projectTypes.map((v) => ({
                    value: v,
                    label: t(`contact.form.projectTypes.${v}`),
                  }))}
                  register={register("projectType")}
                />
                <Field label={t("contact.form.area")} required error={err(errors.area)}>
                  {(a) => (
                    <Input
                      {...a}
                      inputMode="decimal"
                      className="h-11 rounded-none"
                      {...register("area")}
                    />
                  )}
                </Field>
              </>
            )}
            {division === "solar" && (
              <>
                <ChoiceGroup
                  label={t("contact.form.installationType")}
                  error={err(errors.installationType)}
                  options={installationTypes.map((v) => ({
                    value: v,
                    label: t(`contact.form.installationTypes.${v}`),
                  }))}
                  register={register("installationType")}
                />
                <ChoiceGroup
                  label={t("contact.form.sizing")}
                  options={(["power", "bill"] as const).map((v) => ({
                    value: v,
                    label: t(`contact.form.sizingModes.${v}`),
                  }))}
                  register={register("sizingMode")}
                  span={1}
                />
                {sizingMode === "power" ? (
                  <Field
                    key="power"
                    label={t("contact.form.power")}
                    required
                    error={err(errors.power)}
                  >
                    {(a) => (
                      <Input
                        {...a}
                        inputMode="decimal"
                        className="h-11 rounded-none"
                        {...register("power")}
                      />
                    )}
                  </Field>
                ) : (
                  <Field
                    key="bill"
                    label={t("contact.form.bill")}
                    required
                    error={err(errors.bill)}
                  >
                    {(a) => (
                      <Input
                        {...a}
                        inputMode="decimal"
                        className="h-11 rounded-none"
                        {...register("bill")}
                      />
                    )}
                  </Field>
                )}
              </>
            )}
            {(division === "construction" || division === "solar") && (
              <>
                <Field label={t("contact.form.location")} required error={err(errors.location)}>
                  {(a) => (
                    <Input
                      {...a}
                      placeholder={t("contact.form.locationPlaceholder")}
                      autoComplete="address-level2"
                      className="h-11 rounded-none"
                      {...register("location")}
                    />
                  )}
                </Field>
                <Field label={t("contact.form.timeline")} required error={err(errors.timeline)}>
                  {(a) => (
                    <select
                      {...a}
                      className="h-11 w-full border border-input bg-transparent px-3 text-sm shadow-sm"
                      {...register("timeline")}
                    >
                      <option value="">{t("contact.form.selectPlaceholder")}</option>
                      {timelines.map((v) => (
                        <option key={v} value={v}>
                          {t(`contact.form.timelines.${v}`)}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
              </>
            )}
            {division === "general" && (
              <Field
                label={t("contact.form.subject")}
                required
                error={err(errors.subject)}
                span={2}
              >
                {(a) => <Input {...a} className="h-11 rounded-none" {...register("subject")} />}
              </Field>
            )}
          </div>
        </Step>
      )}

      {division && (
        <Step number={3} title={t("contact.form.step3")}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t("contact.form.firstName")} required error={err(errors.firstName)}>
              {(a) => (
                <Input
                  {...a}
                  autoComplete="given-name"
                  className="h-11 rounded-none"
                  {...register("firstName")}
                />
              )}
            </Field>
            <Field label={t("contact.form.lastName")} required error={err(errors.lastName)}>
              {(a) => (
                <Input
                  {...a}
                  autoComplete="family-name"
                  className="h-11 rounded-none"
                  {...register("lastName")}
                />
              )}
            </Field>
            <Field label={t("contact.form.company")} required error={err(errors.company)}>
              {(a) => (
                <Input
                  {...a}
                  autoComplete="organization"
                  className="h-11 rounded-none"
                  {...register("company")}
                />
              )}
            </Field>
            <Field label={t("contact.form.role")}>
              {(a) => (
                <Input
                  {...a}
                  autoComplete="organization-title"
                  className="h-11 rounded-none"
                  {...register("role")}
                />
              )}
            </Field>
            <Field label={t("contact.form.email")} required error={err(errors.email)}>
              {(a) => (
                <Input
                  {...a}
                  type="email"
                  autoComplete="email"
                  className="h-11 rounded-none"
                  {...register("email")}
                />
              )}
            </Field>
            <Field label={t("contact.form.phone")} required error={err(errors.phone)}>
              {(a) => (
                <Input
                  {...a}
                  type="tel"
                  autoComplete="tel"
                  className="h-11 rounded-none"
                  {...register("phone")}
                />
              )}
            </Field>
            <Field label={t("contact.form.message")} required error={err(errors.message)} span={2}>
              {(a) => (
                <Textarea
                  {...a}
                  placeholder={t("contact.form.messagePlaceholder")}
                  className="min-h-32 rounded-none"
                  {...register("message")}
                />
              )}
            </Field>

            <div className="sm:col-span-2">
              <p className="text-sm font-medium" id="file-label">
                {t("contact.form.file")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground" id="file-hint">
                {t("contact.form.fileHint")}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <input
                  ref={fileInput}
                  id="attachment"
                  type="file"
                  accept=".pdf,.dwg,.jpg,.jpeg,.png"
                  className="peer sr-only"
                  aria-labelledby="file-label"
                  aria-describedby={fileError ? "file-hint file-error" : "file-hint"}
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setFile(f);
                    setFileError(!!f && f.size > MAX_FILE_BYTES);
                  }}
                />
                <label
                  htmlFor="attachment"
                  className="inline-flex h-10 cursor-pointer items-center gap-2 border border-input px-4 text-sm font-medium transition-colors hover:border-foreground peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2"
                >
                  <Paperclip className="size-4" aria-hidden /> {t("contact.form.fileButton")}
                </label>
                <span className="text-sm text-muted-foreground" aria-live="polite">
                  {file ? file.name : t("contact.form.fileNone")}
                </span>
                {file && (
                  <button
                    type="button"
                    className="grid size-8 place-items-center text-muted-foreground hover:text-foreground"
                    aria-label={t("contact.form.fileRemove")}
                    onClick={() => {
                      setFile(null);
                      setFileError(false);
                      if (fileInput.current) fileInput.current.value = "";
                    }}
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                )}
              </div>
              <ErrorText
                id="file-error"
                message={fileError ? t("contact.form.errors.fileSize") : undefined}
              />
            </div>

            <div className="grid gap-4 border-t border-border pt-6 sm:col-span-2">
              <div>
                <label className="flex items-start gap-3 text-sm leading-6">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 shrink-0 accent-foreground"
                    aria-invalid={!!errors.gdpr}
                    aria-describedby={errors.gdpr ? "gdpr-error" : undefined}
                    {...register("gdpr")}
                  />
                  <span>
                    <Trans
                      i18nKey="contact.form.gdpr"
                      t={t}
                      components={[
                        <LocalizedLink
                          key="privacy"
                          page="privacy"
                          target="_blank"
                          rel="noopener"
                          className="underline underline-offset-4"
                        />,
                      ]}
                    />
                  </span>
                </label>
                <ErrorText id="gdpr-error" message={err(errors.gdpr)} />
              </div>
              <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                <input
                  type="checkbox"
                  className="mt-1 size-4 shrink-0 accent-foreground"
                  {...register("marketing")}
                />
                <span>{t("contact.form.marketing")}</span>
              </label>
            </div>
          </div>
        </Step>
      )}

      <div className="mt-8 grid gap-4">
        {hasErrors && (
          <p role="alert" className="border-l-2 border-destructive pl-3 text-sm text-destructive">
            {t("contact.form.errorSummary")}
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="border-l-2 border-destructive pl-3 text-sm text-destructive">
            {t("contact.form.errorSubmit")}
          </p>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="h-12 w-full rounded-none sm:w-auto sm:px-10"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" aria-hidden /> {t("contact.form.submitting")}
            </>
          ) : (
            t("contact.form.submit")
          )}
        </Button>
      </div>
    </form>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <section className="mt-10 border-t border-border pt-8">
      <h3 className="mb-6 flex items-baseline gap-3 text-xl font-semibold">
        <span className="font-display text-sm text-muted-foreground">
          {String(number).padStart(2, "0")}
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

type A11yProps = {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
};

function Field({
  label,
  required = false,
  error,
  span = 1,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string | undefined;
  span?: 1 | 2;
  children: (a: A11yProps) => ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={span === 2 ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && " *"}
      </label>
      <div className="mt-2">
        {children({
          id,
          "aria-invalid": !!error,
          ...(error ? { "aria-describedby": errorId } : {}),
          ...(required ? { "aria-required": true } : {}),
        })}
      </div>
      <ErrorText id={errorId} message={error} />
    </div>
  );
}

function ChoiceGroup({
  label,
  options,
  register,
  error,
  span = 2,
}: {
  label: string;
  options: { value: string; label: string }[];
  register: ReturnType<ReturnType<typeof useForm<LeadForm>>["register"]>;
  error?: string | undefined;
  span?: 1 | 2;
}) {
  const id = useId();
  return (
    <fieldset
      className={span === 2 ? "sm:col-span-2" : ""}
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <legend className="text-sm font-medium">{label} *</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="cursor-pointer border border-input px-4 py-2.5 text-sm transition-colors hover:border-foreground has-[:checked]:border-foreground has-[:checked]:bg-foreground has-[:checked]:text-background has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2"
          >
            <input type="radio" value={o.value} className="sr-only" {...register} />
            {o.label}
          </label>
        ))}
      </div>
      <ErrorText id={`${id}-error`} message={error} />
    </fieldset>
  );
}

function ErrorText({ id, message }: { id: string; message?: string | undefined }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs font-medium text-destructive">
      {message}
    </p>
  );
}
