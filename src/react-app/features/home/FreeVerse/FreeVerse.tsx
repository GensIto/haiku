import { Card } from "@/react-app/components/ui/card";
import { PenLine } from "lucide-react";
import { FreeVerseDialog } from "@/react-app/features/home/FreeVerseDialog/FreeVerseDialog";

export const FreeVerse = () => {
  return (
    <Card className='rounded-2xl border-emerald-500/20 bg-emerald-950/30 p-4'>
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-emerald-600/20 flex items-center justify-center shrink-0'>
            <PenLine className='w-5 h-5 text-emerald-400' />
          </div>
          <div className='flex-1'>
            <h3 className='text-sm font-medium text-emerald-100 mb-0.5'>
              自由に創作
            </h3>
            <p className='text-xs text-emerald-400/60'>
              お題にとらわれず、あなたのテーマで詩を綴りましょう
            </p>
          </div>
        </div>
        <FreeVerseDialog />
      </div>
    </Card>
  );
};
