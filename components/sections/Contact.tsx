"use client";

import { useState, type FormEvent } from "react";
import Footer from "@/components/layout/Footer";
import AnchorLink from "@/components/ui/AnchorLink";
import Container from "@/components/ui/Container";
import { siteConfig } from "@/lib/seo";
import { buttonClass } from "@/utils/buttonStyles";
import { scenePinFallback } from "@/utils/sceneStyles";

const labelClass =
  "font-mono text-[.62rem] font-medium uppercase tracking-[.14em] text-mute";
const fieldClass =
  "w-full rounded-none border border-line-2 bg-[rgba(8,13,16,.7)] px-[.8rem] py-3 font-sans text-base text-fg focus:border-blue";

export default function Contact() {
  const [note, setNote] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      setNote("Add your name and a valid email address.");
      return;
    }
    setNote(`Thank you, ${name.split(" ")[0]}. This is a design preview, so nothing was sent.`);
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
            <div className="mt-8 flex flex-wrap gap-[.8rem]">
              <AnchorLink href="#name" className={buttonClass("primary")}>
                Start a Project
              </AnchorLink>
              <AnchorLink href="#name" className={buttonClass("ghost")}>
                Contact the Studio
              </AnchorLink>
            </div>
            <p className="mt-[1.4rem] font-mono text-[.8rem] font-medium text-mute">
              <a href={`mailto:${siteConfig.email}`} className="hover:text-blue">
                {siteConfig.email}
              </a>{" "}
              · {siteConfig.phone}
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            noValidate
            className="border border-line-2 bg-[rgba(11,17,20,.78)] p-[clamp(1.1rem,2.4vw,1.8rem)] backdrop-blur-[14px]"
          >
            <h3 className="mb-4 text-[1.05rem] font-bold tracking-[.02em]">
              Tell us about the project
            </h3>

            <div className="grid grid-cols-1 gap-x-[.8rem] min-[520px]:grid-cols-2">
              <div className="mb-[.9rem] flex min-w-0 flex-col gap-[.35rem]">
                <label htmlFor="name" className={labelClass}>Name</label>
                <input id="name" name="name" autoComplete="name" placeholder="Your name" className={fieldClass} />
              </div>
              <div className="mb-[.9rem] flex min-w-0 flex-col gap-[.35rem]">
                <label htmlFor="email" className={labelClass}>Email</label>
                <input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" className={fieldClass} />
              </div>
            </div>

            <div className="mb-[.9rem] flex min-w-0 flex-col gap-[.35rem]">
              <label htmlFor="ptype" className={labelClass}>Project type</label>
              <select id="ptype" name="ptype" className={fieldClass}>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Interior design</option>
                <option>Renovation</option>
                <option>3D visualization</option>
              </select>
            </div>

            <div className="mb-[.9rem] flex min-w-0 flex-col gap-[.35rem]">
              <label htmlFor="msg" className={labelClass}>Message</label>
              <textarea id="msg" name="msg" placeholder="Site, size, timeline, ideas" className={`${fieldClass} min-h-24 resize-y`} />
            </div>

            <button type="submit" className={buttonClass("primary", "md", "w-full")}>
              Send enquiry
            </button>
            <p
              role="status"
              className="mt-[.9rem] min-h-[1.2em] font-mono text-[.72rem] font-medium leading-normal text-blue"
            >
              {note}
            </p>
          </form>
        </div>
        <Footer />
      </Container>
    </section>
  );
}