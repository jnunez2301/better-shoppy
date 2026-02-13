import { useMutation } from "@tanstack/react-query"
import api from "../../../utils/api"
import { LuTrash2, LuCheck } from "react-icons/lu"
import { toast } from "sonner"
import { getEmojiForIcon } from "../../../utils/iconMap"

interface Props {
  product: any
}

const ProductItem = ({ product }: Props) => {
  const isCompleted = product.status === "completed"

  const toggleStatusMutation = useMutation({
    mutationFn: (status: string) => api.put(`/products/${product.id}`, { status }),
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update product")
    }
  })

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/products/${product.id}`),
    onSuccess: () => {
      toast.success(`${product.name} removed`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to delete product")
    }
  })

  return (
    <div
      className={`
        group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300
        ${isCompleted
          ? "bg-gray-50/50 dark:bg-gray-800/20 border-gray-100 dark:border-gray-800/50"
          : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/30"}
      `}
      data-testid="product-item"
    >
      {/* Status Toggle / Icon */}
      <button
        onClick={() => toggleStatusMutation.mutate(isCompleted ? "pending" : "completed")}
        className={`
          relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300
          ${isCompleted ? "bg-gray-100 dark:bg-gray-800" : "bg-blue-50 dark:bg-blue-900/20"}
        `}
      >
        <span className={`text-2xl transition-transform duration-300 ${isCompleted ? "scale-75 opacity-50" : "scale-100"}`}>
          {getEmojiForIcon(product.icon)}
        </span>
        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-xl">
            <LuCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        )}
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0 grid gap-0.5 cursor-pointer" onClick={() => toggleStatusMutation.mutate(isCompleted ? "pending" : "completed")}>
        <div className="flex items-center gap-2 max-w-full">
          <h3 className={`
            font-semibold truncate transition-all duration-300
            ${isCompleted ? "text-gray-400 dark:text-gray-500 line-through" : "text-gray-900 dark:text-white"}
            
            max-w-[140px] sm:max-w-none
          `} title={product.name}>
            {product.name}
          </h3>
        </div>
        {product.addedByUser && (
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold truncate">
            Added by {product.addedByUser.username || "Unknown"}
          </p>
        )}
        <span className="text-sm text-gray-500 dark:text-gray-400 font-normal shrink-0">
          x{product.quantity}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            deleteMutation.mutate()
          }}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          aria-label="Delete"
        >
          <LuTrash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default ProductItem
