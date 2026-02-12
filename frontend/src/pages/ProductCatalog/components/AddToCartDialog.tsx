import { useState } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Dialog } from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/Button"
import api from "../../../utils/api"
import { toast } from "sonner"
import { LuCheck, LuLoader, LuShoppingCart } from "react-icons/lu"


interface Props {
  product: { id: string; name: string } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const AddToCartDialog = ({ product, open, onOpenChange }: Props) => {
  const { t } = useTranslation()
  const [selectedCartId, setSelectedCartId] = useState<string>("")

  const { data: carts = [], isLoading: isLoadingCarts } = useQuery({
    queryKey: ["carts"],
    queryFn: async () => {
      const response = await api.get("/carts")
      return response.data.data
    },
    enabled: open, // only fetch when dialog opens
  })

  const { mutate: addToCart, isPending } = useMutation({
    mutationFn: async ({ cartId, name }: { cartId: string; name: string }) => {
      // Assuming adding to cart via existing endpoint uses 'name'
      // If we want to link explicitly to catalog ID, backend needs update. 
      // But typically "add product" endpoint takes name and quantity.
      return api.post(`/carts/${cartId}/products`, { name, quantity: 1 })
    },
    onSuccess: () => {
      toast.success(t("common.success") || "Product added to cart")
      onOpenChange(false)
      setSelectedCartId("")
    },
    onError: () => {
      toast.error(t("common.error") || "Failed to add product")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!product || !selectedCartId) return
    addToCart({ cartId: selectedCartId, name: product.name })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      title="Add to Cart"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Select Cart
          </label>
          {isLoadingCarts ? (
            <div className="flex items-center justify-center py-4">
              <LuLoader className="animate-spin w-5 h-5 text-gray-400" />
            </div>
          ) : (
            <div className="grid gap-2 max-h-[300px] overflow-y-auto">
              {carts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No carts found</p>
              ) : (
                carts.map((cart: any) => (
                  <button
                    key={cart.id}
                    type="button"
                    onClick={() => setSelectedCartId(cart.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${selectedCartId === cart.id
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-300 ring-1 ring-primary-500"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedCartId === cart.id
                      ? 'bg-primary-100 dark:bg-primary-800 text-primary-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                      }`}>
                      <LuShoppingCart className="w-5 h-5" />
                    </div>
                    <span className="font-medium flex-1 truncate">{cart.name}</span>
                    {selectedCartId === cart.id && (
                      <LuCheck className="w-5 h-5 text-primary-500" />
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!selectedCartId || isPending}
            isLoading={isPending}
          >
            Add to Cart
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
