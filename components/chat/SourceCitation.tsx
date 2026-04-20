"use client";

interface Source {
  title: string;
  url: string | null;
  snippet?: string;
}

export function SourceCitation({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;

  // Deduplicate sources by title
  const unique = sources.filter(
    (s, i, arr) => arr.findIndex((x) => x.title === s.title) === i
  );

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {unique.map((source, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 rounded-full border border-[#d1e7dd] bg-[#FFFBEB] px-3 py-1.5 text-xs"
        >
          <span className="shrink-0 text-[10px]">📄</span>
          <span className="font-medium text-[#0A0A0A]">
            {source.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {source.title}
              </a>
            ) : (
              source.title
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
