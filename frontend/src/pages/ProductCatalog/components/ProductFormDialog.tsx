import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod" // Assumed available
import { z } from "zod"
import { Dialog } from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/Button"
import { toast } from "sonner"
import api from "../../../utils/api"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().optional(),
  icon: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ProductFormDialog = ({ open, onOpenChange }: Props) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [showIconPicker, setShowIconPicker] = useState(false) // Simplified for now

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      category: "",
      icon: "shopping_bag",
    },
  })

  const selectedIcon = watch("icon")

  const { mutate: createProduct, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      return api.post("/catalog", data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog"] })
      toast.success("Product created successfully")
      onOpenChange(false)
      reset()
    },
    onError: () => {
      toast.error("Failed to create product")
    },
  })

  const onSubmit = (data: FormData) => {
    createProduct(data)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      title="Add New Product"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Name</label>
          <input
            {...register("name")}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Product name"
            autoFocus
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Category</label>
          <input
            {...register("category")}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Optional category"
          />
        </div>

        {/* Simplified Icon Selection */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">Icon</label>
          <div className="flex gap-2">
            {/* Just a few common icons for MVP handling, or use existing icon picker if available */}
            {['shopping_bag', 'apple', 'carrot', 'milk', 'bread'].map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => setValue('icon', icon)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center border ${selectedIcon === icon
                  ? 'bg-primary-100 border-primary-500 text-primary-600'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                  }`}
              >
                {/* Assuming iconMap maps string to emoji or component */}
                {/* Re-using logic from ProductCard which calls getEmojiForIcon */}
                <span className="text-xl">
                  {/* We might not have access to getEmojiForIcon here effectively without importing it. */}
                  {/* Let's assume we can just show the name or a fallback emoji if getEmojiForIcon is not available in utils/iconMap directly or if it maps just to emoji */}
                  {icon === 'shopping_bag' ? '🛍️' : icon === 'apple' ? '🍎' : icon === 'carrot' ? '🥕' : icon === 'milk' ? '🥛' : '🍞'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isPending}>
            Create Product
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
