import { Button } from "@/react-app/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "@/react-app/lib/hono";
import { startTransition, useOptimistic } from "react";

export const DangoButton = ({
  verseId,
  count,
  onDangoChange,
}: {
  verseId: string;
  count: number;
  onDangoChange: () => void;
}) => {
  const queryClient = useQueryClient();

  const { data: hasDango } = useQuery({
    queryKey: ["hasDango", verseId],
    queryFn: async () => {
      const res = await client.api.dangos[":verseId"].$get({
        param: {
          verseId: verseId,
        },
      });
      return res.json();
    },
  });

  const { mutate: addDango } = useMutation({
    mutationFn: async () => {
      const res = await client.api.dangos[":verseId"].$post({
        param: {
          verseId: verseId,
        },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hasDango", verseId] });
      onDangoChange();
    },
  });

  const { mutate: removeDango } = useMutation({
    mutationFn: async () => {
      const res = await client.api.dangos[":verseId"].$delete({
        param: {
          verseId: verseId,
        },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hasDango", verseId] });
      onDangoChange();
    },
  });

  const isHasDango = hasDango && "hasDango" in hasDango && hasDango.hasDango;

  const [optimisticCount, setOptimisticCount] = useOptimistic(
    count,
    (currentCount, action: "add" | "remove") => {
      return action === "add" ? currentCount + 1 : currentCount - 1;
    }
  );
  const handleClick = () => {
    startTransition(() => {
      if (isHasDango) {
        setOptimisticCount("remove");
        removeDango();
      } else {
        setOptimisticCount("add");
        addDango();
      }
    });
  };

  return (
    <Button
      variant={isHasDango ? "default" : "outline"}
      size='icon'
      onClick={handleClick}
    >
      <div className='flex items-center gap-2'>
        <span>🍡 {optimisticCount}</span>
      </div>
    </Button>
  );
};
