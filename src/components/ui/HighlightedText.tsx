interface HighlightedTextProps {
  text: string;
  keywords: string[];
  className?: string;
}

export function HighlightedText({ text, keywords }: HighlightedTextProps) {
  if (!keywords.length) return <>{text}</>;

  const escaped = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="rounded-sm bg-yellow-400/25 px-0.5 text-yellow-200 dark:text-yellow-200 not-italic text-yellow-800"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
