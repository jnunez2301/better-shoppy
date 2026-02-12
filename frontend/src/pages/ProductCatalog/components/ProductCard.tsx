import { getEmojiForIcon } from "../../../utils/iconMap"
import { LuPlus } from "react-icons/lu"
import { Button } from "../../../components/ui/Button"

interface ProductCatalogItem {
  id: string
  name: string
  category?: string
  defaultUnit?: string
  icon?: string
}

interface Props {
  product: ProductCatalogItem
  onAddToCart: (product: ProductCatalogItem) => void
}

export const ProductCard = ({ product, onAddToCart }: Props) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg text-2xl">
          {getEmojiForIcon(product.icon || 'generic')}
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            {product.name}
          </h3>
          {product.category && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {product.category}
            </p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        className="opacity-0 group-hover:opacity-100 transition-opacity p-2"
        onClick={() => onAddToCart(product)}
        title="Add to cart"
      >
        <LuPlus className="w-5 h-5" />
      </Button>
    </div>
  )
}
