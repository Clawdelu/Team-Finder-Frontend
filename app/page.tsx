"use client";

import { HeroImage } from "./lib/hero-image/HeroImage";
import { HeaderMenu } from "./lib/header-menu/HeaderMenu";

export default function Home() {
  return (
    <>
      <HeaderMenu />
      <HeroImage />
    </>
  );
}
