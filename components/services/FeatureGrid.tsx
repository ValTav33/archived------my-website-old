import Card from "@/components/ui/Card";

export type Feature = {
  title: string;
  body: string;
};

/**
 * The deliverables grid — a card per item, three across on a wide screen.
 *
 * A `ul` rather than a row of `div`s because it is a list of six things and
 * announcing it as one lets a screen-reader user know how many there are
 * before reading them.
 */
export default function FeatureGrid({
  items,
}: {
  items: readonly Feature[];
}) {
  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card as="li" key={item.title} className="p-5">
          <h3 className="text-sm font-semibold text-white">{item.title}</h3>
          <p className="mt-2.5 text-xs leading-relaxed text-zinc-400">
            {item.body}
          </p>
        </Card>
      ))}
    </ul>
  );
}
