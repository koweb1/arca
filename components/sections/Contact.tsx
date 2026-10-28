"use client";

import { useState, type FormEvent } from "react";
import AnchorLink from "@/components/ui/AnchorLink";
import Container from "@/components/ui/Container";
import { siteConfig } from "@/lib/seo";
import { buttonClass } from "@/utils/buttonStyles";
import { scenePinFallback } from "@/utils/sceneStyles";

const labelClass =
  "font-mono text-[.62rem] font-medium uppercase tracking-[.14em] text-mute";
const fieldClass =
  "w-full rounded-none border border-line-2 bg-[rgba(8,13,16,.7)] px-[.8rem] py-3 font-sans text-base text-fg aria-invalid:border-warm focus:border-blue";
const errorClass = "font-mono text-[.7rem] font-medium leading-snug text-warm";
const detailLink = "inline-block py-2 hover:text-blue min-[640px]:py-0";

type Errors = { name?: string; email?: string };

export default function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    setErrors(next);

    if (next.name || next.email) {
      setStatus("");
      const first = next.name ? "name" : "email";
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setStatus(`Thank you, ${name.split(" ")[0]}. This is a design preview, so nothing was sent.`);
  }

  return (
    <section id="contact" aria-label="Contact" className={`relative ${scenePinFallback}`}>
      <div className="h-[70vh]" aria-hidden="true" />
      <Container>
        <div className="grid min-h-screen grid-cols-1 items-end gap-[clamp(1.5rem,4vw,4rem)] pb-12 min-[960px]:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
          <div>
            <p className="eyebrow">Start a project</p>
            <h2 className="disp mb-[1.4rem] mt-4 text-[clamp(2.1rem,6vw,5.6rem)]">
              Have a vision? Let&apos;s give it form.
            </h2>
            <p className="max-w-[36rem] text-[clamp(1.02rem,1.5vw,1.22rem)] text-soft">
              Tell us about your next project. Let&apos;s explore what&apos;s possible.
            </p>

            {/* Phones: stacked, full width, equal size. From 640px: side by side at natural width. */}
            <div className="mt-10 flex flex-col gap-3 min-[640px]:mt-8 min-[640px]:flex-row min-[640px]:flex-wrap min-[640px]:gap-[.8rem]">
              <AnchorLink
                href="#name"
                className={buttonClass("primary", "md", "w-full min-[640px]:w-auto")}
              >
                Start a Project
              </AnchorLink>
              <AnchorLink
                href="#name"
                className={buttonClass("ghost", "md", "w-full min-[640px]:w-auto")}
              >
                Contact the Studio
              </AnchorLink>
            </div>

            {/* Phones: email and phone on separate lines, each an easy tap target. From 640px: one line. */}
            <p className="mt-6 flex flex-col items-start gap-1 font-mono text-[.8rem] font-medium text-soft [text-shadow:0_1px_10px_rgba(0,0,0,.55)] min-[640px]:mt-[1.4rem] min-[640px]:flex-row min-[640px]:flex-wrap min-[640px]:items-center min-[640px]:gap-x-3 min-[640px]:gap-y-1">
              <a href={`mailto:${siteConfig.email}`} className={detailLink}>
                {siteConfig.email}
              </a>
              <span aria-hidden="true" className="hidden min-[640px]:inline">
                ·
              </span>
              <a href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`} className={detailLink}>
                {siteConfig.phone}
              </a>
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            noValidate
            aria-labelledby="enquiry-heading"
            className="border border-line-2 bg-[rgba(11,17,20,.78)] p-[clamp(1.1rem,2.4vw,1.8rem)] backdrop-blur-[14px]"
          >
            <h3 id="enquiry-heading" className="mb-1 text-[1.05rem] font-bold tracking-[.02em]">
              Tell us about the project
            </h3>
            <p className="mb-4 font-mono text-[.62rem] font-medium uppercase tracking-[.14em] text-mute">
              * Required
            </p>

            <div className="grid grid-cols-1 gap-x-[.8rem] min-[520px]:grid-cols-2">
              <div className="mb-[.9rem] flex min-w-0 flex-col gap-[.35rem]">
                <label htmlFor="name" className={labelClass}>
                  Name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  aria-required="true"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  onChange={() => errors.name && setErrors((p) => ({ ...p, name: undefined }))}
                  className={fieldClass}
                />
                {errors.name && (
                  <p id="name-error" className={errorClass}>
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="mb-[.9rem] flex min-w-0 flex-col gap-[.35rem]">
                <label htmlFor="email" className={labelClass}>
                  Email <span aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  aria-required="true"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  onChange={() => errors.email && setErrors((p) => ({ ...p, email: undefined }))}
                  className={fieldClass}
                />
                {errors.email && (
                  <p id="email-error" className={errorClass}>
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-[.9rem] flex min-w-0 flex-col gap-[.35rem]">
              <label htmlFor="ptype" className={labelClass}>
                Project type
              </label>
              <select id="ptype" name="ptype" className={fieldClass}>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Interior design</option>
                <option>Renovation</option>
                <option>3D visualization</option>
              </select>
            </div>

            <div className="mb-[.9rem] flex min-w-0 flex-col gap-[.35rem]">
              <label htmlFor="msg" className={labelClass}>
                Message
              </label>
              <textarea
                id="msg"
                name="msg"
                placeholder="Site, size, timeline, ideas"
                className={`${fieldClass} min-h-24 resize-y`}
              />
            </div>

            <button type="submit" className={buttonClass("primary", "md", "w-full")}>
              Send enquiry
            </button>
            <p
              role="status"
              className="mt-[.9rem] min-h-[1.2em] font-mono text-[.72rem] font-medium leading-normal text-blue"
            >
              {status}
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
}