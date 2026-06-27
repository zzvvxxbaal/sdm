"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}

function initialsFor(name?: string | null): string {
  if (!name) return "?";
  return name.trim().slice(0, 1).toUpperCase();
}

export function Avatar({ src, name, size = 48, className }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const showImage = src && !errored;

  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "bg-[#eff6ff] text-[#2563EB] dark:bg-[#1e3a5f] dark:text-[#60a5fa]",
        className
      )}
    >
      {showImage ? (
        <Image
          src={src}
          alt={name ?? "avatar"}
          fill
          sizes={`${size}px`}
          className="object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <span style={{ fontSize: size * 0.4 }} className="font-bold">
          {initialsFor(name)}
        </span>
      )}
    </div>
  );
}
