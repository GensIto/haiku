import { Button } from "@/react-app/components/ui/button";
import { DialogHeader, DialogFooter } from "@/react-app/components/ui/dialog";
import { Input } from "@/react-app/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/react-app/components/ui/dialog";
import { toast } from "sonner";
import { VERSE_TYPES } from "@/worker/domain/value-object/VerseForm";
import { useForm } from "@tanstack/react-form";
import { client } from "@/react-app/lib/hono";
import { Field, FieldGroup, FieldLabel } from "@/react-app/components/ui/field";
import { Label } from "@/react-app/components/ui/label";
import { Checkbox } from "@/react-app/components/ui/checkbox";
import { useState } from "react";
import { queryClient } from "@/react-app/lib/query";

export const FreeVerseDialog = () => {
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      type: VERSE_TYPES.senryu,
      lines: ["", "", ""],
      isPublish: false,
    },
    onSubmit: async ({ value }) => {
      const res = await client.api.verses.$post({ json: value });
      if (!res.ok) {
        toast.error("Failed to create verse");
        return;
      }
      toast.success("Verse created successfully");
      form.reset();
      await queryClient.refetchQueries({
        queryKey: ["latestVerses"],
        type: "active",
      });
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <Button variant='outline'>自由に詠う</Button>
      </DialogTrigger>
      <DialogContent
        className='sm:max-w-md'
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>川柳</DialogTitle>
          <DialogDescription className='text-sm text-muted-foreground'>
            <span>
              川柳は、「五・七・五」の十七音で、人情や世相を滑稽に、あるいは風刺的に詠む定型詩です。
            </span>
            <br />
            <span>
              俳句と異なり、季語や切れ字の約束はなく、口語で表現するのが特徴です。
            </span>
            <br />
            <span>
              人間の感情や暮らしをテーマに、言葉遊びの要素も取り入れながら、自由な表現を楽し見ましょう！
            </span>
          </DialogDescription>
        </DialogHeader>
        <form
          id='verse-create-form'
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name='lines'>
              {(field) => (
                <>
                  <Field>
                    <FieldLabel htmlFor='line-1'>上の句（五音）</FieldLabel>
                    <Input
                      id='line-1'
                      value={field.state.value[0] || ""}
                      onChange={(e) => {
                        const newLines = [...field.state.value];
                        newLines[0] = e.target.value;
                        field.handleChange(newLines);
                      }}
                      placeholder='五音で入力'
                      pattern='^[ぁ-んァ-ン一-鿿]{1,5}$'
                      maxLength={5}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor='line-2'>中の句（七音）</FieldLabel>
                    <Input
                      id='line-2'
                      value={field.state.value[1] || ""}
                      onChange={(e) => {
                        const newLines = [...field.state.value];
                        newLines[1] = e.target.value;
                        field.handleChange(newLines);
                      }}
                      placeholder='七音で入力'
                      pattern='^[ぁ-んァ-ン一-鿿]{1,7}$'
                      maxLength={7}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor='line-3'>下の句（五音）</FieldLabel>
                    <Input
                      id='line-3'
                      value={field.state.value[2] || ""}
                      onChange={(e) => {
                        const newLines = [...field.state.value];
                        newLines[2] = e.target.value;
                        field.handleChange(newLines);
                      }}
                      placeholder='五音で入力'
                      pattern='^[ぁ-んァ-ン一-鿿]{1,5}$'
                      maxLength={5}
                      required
                    />
                  </Field>
                </>
              )}
            </form.Field>
            <form.Field name='isPublish'>
              {(field) => (
                <div className='flex items-center gap-3'>
                  <Checkbox
                    id='isPublish'
                    checked={field.state.value}
                    onCheckedChange={(checked) =>
                      field.handleChange(checked === true)
                    }
                  />
                  <Label htmlFor='isPublish'>公開する</Label>
                </div>
              )}
            </form.Field>
          </FieldGroup>
        </form>
        <DialogFooter className='sm:justify-start'>
          <Button
            type='submit'
            form='verse-create-form'
            disabled={!form.state.canSubmit}
          >
            作成
          </Button>
          <DialogClose asChild>
            <Button
              type='button'
              variant='outline'
              onClick={() => form.reset()}
            >
              キャンセル
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
