import { notFound } from "next/navigation";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og";
import { STUDIED_PROOF, getProofBySlug } from "@/lib/site";
import { greekUpper } from "@/lib/utils";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Same set the page generates, so a card cannot exist without its page. */
export function generateStaticParams() {
  return STUDIED_PROOF.map((item) => ({ slug: item.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getProofBySlug(slug);

  if (!item?.study) notFound();

  return ogCard({ eyebrow: greekUpper(item.kind), title: item.name });
}
