/**
 * Renders the light markup used in blog and case study copy: a line starting
 * with "## " becomes a heading, consecutive lines starting with "- " become a
 * bulleted list, and everything else is a paragraph. Posts written before this
 * existed are plain paragraphs and render unchanged.
 */
const RichText = ({ content }: { content: string }) => {
  const blocks = content.split("\n\n").map((b) => b.trim()).filter(Boolean);

  return (
    <div className="space-y-4 text-foreground/70 text-sm lg:text-base leading-relaxed">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="text-xl lg:text-2xl tracking-tight text-foreground pt-4"
            >
              {block.slice(3)}
            </h2>
          );
        }

        const lines = block.split("\n");
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="space-y-2 pl-1">
              {lines.map((line, j) => (
                <li key={j} className="flex items-start gap-2.5">
                  <span className="mt-2 size-1.5 rounded-full bg-primary shrink-0" />
                  <span>{line.slice(2)}</span>
                </li>
              ))}
            </ul>
          );
        }

        return <p key={i}>{block}</p>;
      })}
    </div>
  );
};

export default RichText;
