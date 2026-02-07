import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useMutation } from "@tanstack/react-query"
import { Dialog } from "./ui/dialog"
import { Button } from "./ui/Button"
import { useAuthStore } from "../stores/useAuthStore"
import api from "../utils/api"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { LuSun, LuMoon, LuLock, LuUser } from "react-icons/lu"

const avatars = [
  { id: "avatar-1", color: "bg-red-500" },
  { id: "avatar-2", color: "bg-blue-500" },
  { id: "avatar-3", color: "bg-green-500" },
  { id: "avatar-4", color: "bg-orange-500" },
  { id: "avatar-5", color: "bg-purple-500" },
]

interface Props {
  open: boolean
  onOpenChange: (e: { open: boolean }) => void
}

const ProfileDialog = ({ open, onOpenChange }: Props) => {
  const { t } = useTranslation()
  const { user, login } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile')
  const { theme, setTheme } = useTheme()

  // Profile State
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "avatar-1")
  const [selectedTheme, setSelectedTheme] = useState(user?.theme || theme || 'light')

  // Password State
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  // Update effect when user changes
  useEffect(() => {
    if (user?.avatar) setSelectedAvatar(user.avatar)
    if (user?.theme) setSelectedTheme(user.theme)
  }, [user])

  const profileMutation = useMutation({
    mutationFn: (data: { avatar?: string, theme?: string }) => api.put("/auth/me", data),
    onSuccess: (response) => {
      const token = useAuthStore.getState().token
      if (token && response.data.data) {
        login(token, response.data.data)
      }
      // Also update local theme immediately if changed
      if (selectedTheme) setTheme(selectedTheme)

      toast.success(t('profile.update_success') || "Profile updated successfully")
      onOpenChange({ open: false })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || t('dialogs.something_wrong'))
    }
  })

  const passwordMutation = useMutation({
    mutationFn: (data: { oldPassword: string, newPassword: string }) => api.put("/auth/password", data),
    onSuccess: () => {
      toast.success("Password changed successfully")
      setCurrentPassword("")
      setNewPassword("")
      onOpenChange({ open: false })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to change password")
    }
  })

  const handleSaveProfile = () => {
    profileMutation.mutate({
      avatar: selectedAvatar,
      theme: selectedTheme
    })
  }

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword || !newPassword) return
    passwordMutation.mutate({ oldPassword: currentPassword, newPassword })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('profile.edit_profile') || "Edit Profile"}
      footer={null} // Custom footer per tab or just content
    >
      <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all text-sm font-medium ${activeTab === 'profile'
            ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
        >
          <LuUser className="w-4 h-4" />
          {t('profile.general') || "General"}
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all text-sm font-medium ${activeTab === 'security'
            ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
        >
          <LuLock className="w-4 h-4" />
          {t('profile.security') || "Security"}
        </button>
      </div>

      {activeTab === 'profile' ? (
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
              {t('auth.choose_avatar')}
            </label>
            <div className="flex justify-center gap-4 flex-wrap">
              {avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`
                    relative w-14 h-14 rounded-full overflow-hidden transition-all duration-200 
                    ${selectedAvatar === avatar.id
                      ? "ring-4 ring-blue-500 scale-110 shadow-lg"
                      : "scale-100 opacity-70 hover:opacity-100 hover:scale-105"
                    }
                  `}
                >
                  <img
                    src={`/avatars/${avatar.id}.png`}
                    alt={avatar.id}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement?.classList.add(avatar.color)
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Theme Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
              Theme / Appearance
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedTheme('light')
                  setTheme('light') // Preview immediately
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${selectedTheme === 'light'
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                <LuSun className="w-5 h-5" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedTheme('dark')
                  setTheme('dark') // Preview immediately
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${selectedTheme === 'dark'
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                <LuMoon className="w-5 h-5" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="outline" onClick={() => onOpenChange({ open: false })}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleSaveProfile}
              isLoading={profileMutation.isPending}
            >
              {t('common.save')}
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSavePassword} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="outline" type="button" onClick={() => onOpenChange({ open: false })}>
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              isLoading={passwordMutation.isPending}
            >
              Update Password
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  )
}

export default ProfileDialog
