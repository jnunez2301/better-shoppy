import { useNavigate } from "@tanstack/react-router"
import { useAuthStore } from "../stores/useAuthStore"
import { LanguageToggle } from "./LanguageToggle"
import { LuLogOut, LuShoppingBag } from "react-icons/lu"
import { useTranslation } from "react-i18next"
import ProfileDialog from "./ProfileDialog"
import { useState } from "react"

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate({ to: "/login" })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300" data-testid="layout">
      <ProfileDialog open={isProfileOpen} onOpenChange={(e) => setIsProfileOpen(e.open)} />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => navigate({ to: "/" })}
              data-testid="logo"
            >
              <img src="/logo_navbar.png" alt={t('common.app_name')} className="object-contain h-[120px]" />
            </div>

            <div className="flex items-center gap-4">
              <LanguageToggle />
              {user && (
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-none">{user.username}</p>

                  </div>
                  <button
                    onClick={() => setIsProfileOpen(true)}
                    className="w-9 h-9 rounded-full overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <img
                      src={`/avatars/${user.avatar}.png`}
                      alt={user.username}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-blue-500', 'to-indigo-600', 'flex', 'items-center', 'justify-center', 'text-white', 'font-bold', 'text-sm');
                        e.currentTarget.parentElement!.innerText = user.username.charAt(0).toUpperCase();
                      }}
                    />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                    aria-label="Logout"
                    data-testid="logout-button"
                  >
                    <LuLogOut className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
