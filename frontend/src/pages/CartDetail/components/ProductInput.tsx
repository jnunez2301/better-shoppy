import { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { getEmojiForIcon } from "../../../utils/iconMap"
import { useMutation, useQuery } from "@tanstack/react-query"
import api from "../../../utils/api"
import { LuPlus } from "react-icons/lu"
import { Button } from "../../../components/ui/Button"

interface Props {
  cartId: string
}

const ProductInput = ({ cartId }: Props) => {
  const { t } = useTranslation()
  const [name, setName] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: suggestions = [] } = useQuery({
    queryKey: ["autocomplete", cartId, name],
    queryFn: async () => {
      if (!name || name.length < 1) return []
      const response = await api.get(`/carts/${cartId}/products/autocomplete`, {
        params: { q: name },
      })
      return response.data.data
    },
    enabled: name.length > 0,
  })

  const addProductMutation = useMutation({
    mutationFn: (data: { name: string }) => api.post(`/carts/${cartId}/products`, data),
    onSuccess: () => {
      setName("")
      setShowSuggestions(false)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    addProductMutation.mutate({ name: name.trim() })
  }

  const handleSuggestionClick = (suggestionName: string) => {
    setName(suggestionName)
    addProductMutation.mutate({ name: suggestionName })
    setShowSuggestions(false)
  }

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative w-full" data-testid="product-input">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder={t('dialogs.product_placeholder')}
            className="w-full h-12 bg-transparent px-4 text-base text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none"
          />
        </div>
        <Button
          type="submit"
          isLoading={addProductMutation.isPending}
          className="h-12 px-6 rounded-xl"
        >
          <LuPlus className="mr-2 w-5 h-5" /> {t('common.add')}
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 py-2 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
          data-testid="suggestions-list"
        >
          {suggestions.map((s: any, i: number) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSuggestionClick(s.name)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
            >
              <span className="text-2xl">{getEmojiForIcon(s.icon)}</span>
              <span className="text-gray-900 dark:text-white font-medium">{s.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductInput
