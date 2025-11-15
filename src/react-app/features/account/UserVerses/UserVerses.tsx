import { Card } from "@/react-app/components/ui/card";
import { Badge } from "@/react-app/components/ui/badge";
import { VERSE_LABELS } from "@/worker/domain/value-object/VerseForm";
import { client } from "@/react-app/lib/hono";
import { useSuspenseQuery } from "@tanstack/react-query";

export const UserVerses = () => {
  const { data: userVerses } = useSuspenseQuery({
    queryKey: ["userVerses"],
    queryFn: async () => {
      const res = await client.api.verses.user.$get();
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      return data.verses;
    },
  });

  return (
    <>
      {userVerses.map((verse) => (
        <Card
          key={verse.id}
          className='rounded-xl border-emerald-500/20 bg-emerald-950/20 p-4 hover:bg-emerald-950/30 transition-colors cursor-pointer'
        >
          <div className='mb-3'>
            <Badge
              variant='secondary'
              className='bg-emerald-600/20 border-0 text-emerald-300 px-2 py-0.5 text-xs'
            >
              {VERSE_LABELS[verse.type]}
            </Badge>
          </div>
          <div className='space-y-1 mb-4'>
            {verse.lines.map((line, i) => (
              <p key={i} className='text-sm text-emerald-100'>
                {line}
              </p>
            ))}
          </div>
          <div className='flex items-center justify-between text-xs text-emerald-400/60'>
            <span>{verse.userName}</span>
            <div className='flex items-center gap-2'>
              <span>🍡 {verse.dangoCount}</span>
            </div>
          </div>
          <div className='mt-2 text-xs text-emerald-400/40'>
            {new Date(verse.createdAt).toLocaleDateString()}
          </div>
        </Card>
      ))}
    </>
  );
};
