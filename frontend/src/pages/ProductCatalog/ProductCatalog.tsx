import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { LuSearch, LuPlus } from "react-icons/lu"
import { ProductCard } from "./components/ProductCard"
import { AddToCartDialog } from "./components/AddToCartDialog"
import { ProductFormDialog } from "./components/ProductFormDialog"
import { Button } from "../../components/ui/Button"
import api from "../../utils/api"
import { Link } from "@tanstack/react-router" // Or use Link from router if needed, though this page is standalone? Setup back nav?

export const ProductCatalog = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string } | null>(null)
  const [isAddToCartOpen, setIsAddToCartOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["catalog", search],
    queryFn: async () => {
      const response = await api.get("/catalog", {
        params: { q: search },
      })
      return response.data.data
    },
  })

  // Debounce search could be added, but relying on react query's cache and fast backend for now or controlled input
  // A simple controlled input for search is fine for small catalogs.

  const handleAddToCart = (product: { id: string; name: string }) => {
    setSelectedProduct(product)
    setIsAddToCartOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Product Catalog
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Browse and manage available products
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Back to Dashboard
            </Link>
            <Button onClick={() => setIsCreateOpen(true)}>
              <LuPlus className="w-5 h-5 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 h-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
          />
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🔍
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              No products found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or add a new product
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      <AddToCartDialog
        open={isAddToCartOpen}
        onOpenChange={setIsAddToCartOpen}
        product={selectedProduct}
      />

      <ProductFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  )
}

export default ProductCatalog
