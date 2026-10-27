import { describe, expect, it } from "vitest";
import { leadSchema } from "@/lib/leadSchema";

const minimal = {
  division: "general",
  projectType: "",
  area: "",
  installationType: "",
  sizingMode: "power",
  power: "",
  location: "",
  timeline: "",
  subject: "",
  firstName: "Test",
  lastName: "",
  company: "",
  role: "",
  email: "test@example.com",
  phone: "+39 351 831 0570",
  message: "",
  gdpr: false,
};

describe("Quote form validation", () => {
  it.each(["7.3", "7,3"])("accepts optional solar power in MWp: %s", (power) => {
    const result = leadSchema.safeParse({
      ...minimal,
      division: "solar",
      installationType: "park",
      power,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.power).toBe(power);
  });

  it("does not accept the removed ground or annual-bill choices", () => {
    expect(leadSchema.safeParse({ ...minimal, installationType: "ground" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...minimal, sizingMode: "bill" }).success).toBe(false);
  });

  it.each(["general", "construction", "solar"])(
    "accepts only name, email and phone for %s enquiries",
    (division) => {
      expect(leadSchema.safeParse({ ...minimal, division }).success).toBe(true);
    },
  );

  it.each(["firstName", "email", "phone"])("rejects a missing %s", (field) => {
    expect(leadSchema.safeParse({ ...minimal, [field]: "" }).success).toBe(false);
  });

  it.each([{ email: "not-an-email" }, { phone: "invalid" }, { area: "-5" }, { power: "invalid" }])(
    "rejects invalid supplied data %j",
    (override) => {
      expect(leadSchema.safeParse({ ...minimal, ...override }).success).toBe(false);
    },
  );
});
