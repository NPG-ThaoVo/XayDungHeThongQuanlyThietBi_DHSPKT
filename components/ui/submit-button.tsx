"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  loadingLabel?: string;
  className?: string;
};

export function SubmitButton({ label, loadingLabel, className }: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingLabel ?? "Đang xử lý..."}
        </>
      ) : (
        label
      )}
    </button>
  );
}
