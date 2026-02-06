import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useParams, useNavigate } from "@tanstack/react-router"
import api from "../../utils/api"
import { getSocket } from "../../utils/socket"
import Layout from "../../components/Layout"
import { LuArrowLeft, LuShare2, LuTrash2, LuShoppingBasket, LuUsers, LuEllipsisVertical } from "react-icons/lu"
import { useEffect, useState } from "react"
import { toaster } from "../../components/ui/toaster"
import ProductInput from "./components/ProductInput"
import MembersList from "./components/MembersList"
import { Button } from "../../components/ui/Button"
import ProductItem from "./components/ProductItem"
import ShareCartDialog from "./components/ShareCartDialog"

interface Product {
  id: string
  name: string
  status: "pending" | "completed"
  icon: string
  addedByUser?: { username: string }
}

const CartDetail = () => {
  const { t } = useTranslation()
  const { id } = useParams({ strict: false })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isMembersOpen, setIsMembersOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { data: cart, isLoading: isCartLoading } = useQuery({
    queryKey: ["cart", id],
    queryFn: async () => {
      const response = await api.get(`/carts/${id}`)
      return response.data.data
    },
  })

  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const response = await api.get(`/carts/${id}/products`)
      return response.data.data
    },
  })

  useEffect(() => {
    if (!id) return
    const socket = getSocket()
    socket.emit("join-cart", id)

    socket.on("product-added", (newProduct: Product) => {
      queryClient.setQueryData(["products", id], (old: Product[] | undefined) => [newProduct, ...(old || [])])
    })

    socket.on("product-updated", (updatedProduct: Product) => {
      queryClient.setQueryData(["products", id], (old: Product[] | undefined) =>
        (old || []).map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      )
    })

    socket.on("product-deleted", ({ productId }: { productId: string }) => {
      queryClient.setQueryData(["products", id], (old: Product[] | undefined) =>
        (old || []).filter((p) => p.id !== productId)
      )
    })

    socket.on("cart-cleared", () => {
      queryClient.setQueryData(["products", id], [])
    })

    return () => {
      socket.off("product-added")
      socket.off("product-updated")
      socket.off("product-deleted")
      socket.off("cart-cleared")
      socket.emit("leave-cart", id)
    }
  }, [id, queryClient])

  const clearCartMutation = useMutation({
    mutationFn: () => api.delete(`/carts/${id}/products`),
    onSuccess: () => {
      toaster.create({ title: t('common.delete') + " success", type: "success" })
      setIsMenuOpen(false)
    },
  })

  const deleteCompletedMutation = useMutation({
    mutationFn: () => api.delete(`/carts/${id}/products/completed`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", id] })
      toaster.create({ title: "Completed products removed", type: "success" })
      setIsMenuOpen(false)
    },
  })

  if (isCartLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  if (!cart) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('cart_detail.cart_not_found')}</h2>
          <Button variant="ghost" onClick={() => navigate({ to: "/" })} className="mt-4">
            <LuArrowLeft className="mr-2" /> {t('cart_detail.go_back')}
          </Button>
        </div>
      </Layout>
    )
  }

  const pendingProducts = products?.filter((p: Product) => p.status === "pending") || []
  const completedProducts = products?.filter((p: Product) => p.status === "completed") || []

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8" data-testid="cart-detail">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate({ to: "/" })}
              className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            >
              <LuArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {cart.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {cart.description || t('cart_detail.no_description') || "No description"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsMembersOpen(true)}>
              <LuUsers className="mr-2 w-4 h-4" />
              <span className="hidden sm:inline">{t('cart_detail.members')}</span> ({cart.cartUsers?.length || 0})
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsShareOpen(true)}>
              <LuShare2 className="mr-2 w-4 h-4" /> {t('cart_detail.share_cart')}
            </Button>

            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                data-testid="cart-menu-trigger"
              >
                <LuEllipsisVertical className="w-5 h-5" />
              </button>

              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                    <button
                      onClick={() => deleteCompletedMutation.mutate()}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                    >
                      {t('cart_detail.clear_completed')}
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(t('cart_detail.confirm_clear_all'))) {
                          clearCartMutation.mutate()
                        }
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"
                    >
                      {t('cart_detail.clear_all')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="bg-white dark:bg-gray-900 p-1 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-20 z-10">
          <ProductInput cartId={id!} />
        </div>

        {/* Products List */}
        {isProductsLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {pendingProducts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    {t('cart_detail.to_buy')} ({pendingProducts.length})
                  </h2>
                </div>
                <div className="grid gap-3">
                  {pendingProducts.map((product: Product) => (
                    <ProductItem key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}

            {completedProducts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    {t('cart_detail.completed')} ({completedProducts.length})
                  </h2>
                </div>
                <div className="grid gap-3 opacity-60 grayscale-[0.5]">
                  {completedProducts.map((product: Product) => (
                    <ProductItem key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}

            {products?.length === 0 && (
              <div className="text-center py-20 bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                <LuShoppingBasket className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('cart_detail.cart_empty')}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">{t('cart_detail.add_first_item')}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {isShareOpen && (
        <ShareCartDialog
          open={isShareOpen}
          onOpenChange={(e: { open: boolean }) => setIsShareOpen(e.open)}
          cartId={id!}
        />
      )}
      {isMembersOpen && (
        <MembersList
          open={isMembersOpen}
          onOpenChange={(e: { open: boolean }) => setIsMembersOpen(e.open)}
          cartId={id!}
          members={cart.cartUsers || []}
          userRole={cart.userRole}
        />
      )}
    </Layout>
  )
}

export default CartDetail
