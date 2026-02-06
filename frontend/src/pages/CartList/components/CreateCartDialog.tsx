import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as z from "zod"
import { Button } from "../../../components/ui/Button"
import { CART_LOGOS } from "../../../utils/iconMap"
// Note: React Icons might not have all, falling back to Lucide for some if needed or using text.
import { Input } from "../../../components/ui/Input"
import { toaster } from "../../../components/ui/toaster"
import { Dialog } from "../../../components/ui/dialog"
import api from "../../../utils/api"

const cartSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  description: z.string().max(255).optional(),
  icon: z.string().optional(),
})

type CartFormValues = z.infer<typeof cartSchema>

interface Props {
  open: boolean
  onOpenChange: (e: { open: boolean }) => void
}

const CreateCartDialog = ({ open, onOpenChange }: Props) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<CartFormValues>({
    resolver: zodResolver(cartSchema),
    defaultValues: {
      icon: 'default'
    }
  })

  const selectedIcon = watch('icon')

  const mutation = useMutation({
    mutationFn: (data: CartFormValues) => api.post("/carts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] })
      toaster.create({ title: t('dialogs.cart_created'), type: "success" })
      onOpenChange({ open: false })
      reset()
    },
    onError: (error: any) => {
      toaster.create({
        title: error.response?.data?.error || t('dialogs.something_wrong'),
        type: "error"
      })
    },
  })

  const onSubmit = (data: CartFormValues) => {
    mutation.mutate(data)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('dialogs.create_cart_title')}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange({ open: false })}>
            {t('common.cancel')}
          </Button>
          <Button
            form="create-cart-form"
            type="submit"
            isLoading={isSubmitting}
          >
            {t('dialogs.create_cart_button')}
          </Button>
        </>
      }
    >
      <form id="create-cart-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label={t('dialogs.cart_name')}
          placeholder={t('dialogs.cart_placeholder')}
          error={errors.name?.message}
          {...register("name")}
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('dialogs.select_logo')}
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CART_LOGOS.map((option) => {
              const Icon = option.icon
              const isSelected = selectedIcon === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setValue('icon', option.id)}
                  className={`
                    flex flex-col items-center gap-1 p-2 rounded-xl border transition-all min-w-[80px]
                    ${isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <Icon className={`w-8 h-8 ${option.color}`} />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('dialogs.description')}
          </label>
          <textarea
            className={`
              flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm 
              placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:cursor-not-allowed disabled:opacity-50
              dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus:ring-blue-600
              ${errors.description ? "border-red-500" : ""}
            `}
            placeholder={t('dialogs.description_placeholder')}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>
      </form>
    </Dialog>
  )
}

export default CreateCartDialog
