import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "../../../components/ui/Button"
import { Input } from "../../../components/ui/Input"
import { toast } from "sonner"
import { Dialog } from "../../../components/ui/dialog"
import api from "../../../utils/api"

const joinCartSchema = z.object({
  code: z.string().length(8, "Code must be 8 characters").transform(val => val.toUpperCase()),
})

type JoinCartValues = z.infer<typeof joinCartSchema>

interface Props {
  open: boolean
  onOpenChange: (e: { open: boolean }) => void
}

const JoinCartDialog = ({ open, onOpenChange }: Props) => {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JoinCartValues>({
    resolver: zodResolver(joinCartSchema),
  })

  const mutation = useMutation({
    mutationFn: (data: JoinCartValues) => api.post("/invitations/join", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] })
      toast.success("Successfully joined cart")
      onOpenChange({ open: false })
      reset()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to join cart")
    },
  })

  const onSubmit = (data: JoinCartValues) => {
    mutation.mutate(data)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Join Cart"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter the 8-character code shared with you to join an existing cart.
          </p>
          <Input
            placeholder="ENTER CODE (e.g. A1B2C3D4)"
            error={errors.code?.message}
            {...register("code")}
            className="text-center text-lg uppercase tracking-widest font-mono"
            maxLength={8}
          />
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange({ open: false })}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            Join Cart
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

export default JoinCartDialog
