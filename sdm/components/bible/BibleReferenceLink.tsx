"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatReference, parseReference } from "@/services/bible/bibleService";
import type { BibleReference } from "@/types/bible";

interface BibleReferenceLinkProps {
  reference: BibleReference | string | null | undefined;
  className?: string;
  icon?: boolean;
}

function toReference(reference: BibleReference | string | null | undefined) {
  if (!reference) return null;
  return typeof reference === "string" ? parseReference(reference) : reference;
}

export function BibleReferenceLink({ reference, className, icon = false }: BibleReferenceLinkProps) {
  const resolved = toReference(reference);
  if (!resolved) {
    return reference ? <span className={className}>{typeof reference === "string" ? reference : formatReference(reference)}</span> : null;
  }
  return (
    <Link
      href={`/bible?book=${resolved.bookId}&chapter=${resolved.chapterNumber}&verse=${resolved.startVerse}`}
      className={cn("inline-flex items-center gap-1 text-[#2563EB] hover:underline", className)}
    >
      {icon && <BookOpen className="h-3.5 w-3.5" />}
      {formatReference(resolved)}
    </Link>
  );
}
