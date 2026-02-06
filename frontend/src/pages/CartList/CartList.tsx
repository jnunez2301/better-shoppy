import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import api from "../../utils/api"
import Layout from "../../components/Layout"
import { LuPlus, LuShoppingBag, LuTrash2, LuUsers } from "react-icons/lu"
import { CART_LOGOS } from "../../utils/iconMap"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { useState } from "react"
import { Button } from "../../components/ui/Button"
import CreateCartDialog from "./components/CreateCartDialog"

const CartList = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: carts, isLoading } = useQuery({
    queryKey: ["carts"],
    queryFn: async () => {
      const response = await api.get("/carts")
      return response.data.data
    },
  })

  const deleteCartMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/carts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] })
      toast.success(t('common.delete') + " success") // Simplified for now, or add translation
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete cart")
    }
  })

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8" data-testid="cart-list">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('cart_list.title')}
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {t('cart_list.subtitle')}
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="shadow-lg shadow-blue-500/20"
          >
            <LuPlus className="mr-2" /> {t('cart_list.new_cart')}
          </Button>
        </div>

        {carts?.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
              <LuShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('cart_list.no_carts')}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs mt-1">
              {t('cart_list.start_creating')}
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => setIsDialogOpen(true)}
            >
              {t('cart_list.create_first')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carts?.map((cart: any) => (
              <div
                key={cart.id}
                onClick={() => navigate({ to: "/cart/$id", params: { id: cart.id } })}
                className="group relative bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const logo = CART_LOGOS.find(l => l.id === cart.icon) || CART_LOGOS[0]
                      const Icon = logo.icon
                      return <Icon className={`w-8 h-8 ${logo.color}`} />
                    })()}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {cart.name}
                    </h3>
                  </div>
                  <div className="flex items-center text-gray-400 dark:text-gray-500">
                    <LuUsers className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">{cart.cartUsers?.length || 1}</span>
                  </div>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 min-h-[40px]">
                  {cart.description || "No description provided."}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">
                    {t('cart_list.created_on', { date: new Date(cart.createdAt).toLocaleDateString() })}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (window.confirm("Are you sure you want to delete this cart?")) {
                        deleteCartMutation.mutate(cart.id)
                      }
                    }}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Delete cart"
                  >
                    <LuTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isDialogOpen && (
        <CreateCartDialog
          open={isDialogOpen}
          onOpenChange={(e) => setIsDialogOpen(e.open)}
        />
      )}
    </Layout>
  )
}

export default CartList
