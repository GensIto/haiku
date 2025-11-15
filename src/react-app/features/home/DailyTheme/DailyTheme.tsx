import { Card } from "@/react-app/components/ui/card";
import { client } from "@/react-app/lib/hono";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Badge } from "@/react-app/components/ui/badge";
import { DailyVerseDialog } from "@/react-app/features/home/DailyVerseDialog/DailyVerseDialog";

export const DailyTheme = () => {
  const { data } = useSuspenseQuery({
    queryKey: ["dailyTheme"],
    queryFn: async () => {
      const res = await client.api.workers.ai.$get();
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      return res.json();
    },
  });

  console.log(data);

  const randomKigo = data.kigo[Math.floor(Math.random() * data.kigo.length)];
  return (
    <Card className='relative overflow-hidden rounded-2xl border-emerald-500/40 bg-linear-to-br from-emerald-400/60 to-emerald-300/50 shadow-lg p-6 gap-3'>
      <div className='mx-auto'>
        <Badge
          variant='secondary'
          className='bg-emerald-800/20 border border-emerald-700/30 text-emerald-950 px-3 py-1 rounded-full inline-flex items-center gap-1.5'
        >
          <span className='text-base'>🍵</span>
          <span className='text-sm font-medium'>庭の一隅</span>
        </Badge>
      </div>
      <h2 className='text-lg font-medium text-center text-emerald-950'>
        {randomKigo.word}
      </h2>
      <p className='text-xs text-center text-emerald-950 mb-4'>
        この景色から、あるいは心のままに詠んでみませんか
      </p>
      <div className='flex justify-center'>
        <DailyVerseDialog />
      </div>
    </Card>
  );
};
