import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { LuX } from "react-icons/lu"

interface DialogProps {
  open: boolean
  onOpenChange: (e: { open: boolean }) => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export const Dialog = ({ open, onOpenChange, title, children, footer }: DialogProps) => {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  if (!open) return null

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onOpenChange({ open: false })
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300"
      data-testid="dialog-root"
    >
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
      />

      {/* Content */}
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            type="button"
            onClick={() => onOpenChange({ open: false })}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
