import { toast } from "sonner"

export const toaster = {
  create: (options: { title: string; description?: string; type?: "success" | "error" | "info" | "loading" }) => {
    const { title, description, type } = options
    if (type === "success") {
      toast.success(title, { description })
    } else if (type === "error") {
      toast.error(title, { description })
    } else {
      toast(title, { description })
    }
  },
  dismiss: (id?: string) => {
    if (id) toast.dismiss(id)
    else toast.dismiss()
  }
}

export const Toaster = () => null
