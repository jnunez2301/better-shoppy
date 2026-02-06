import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useMutation } from "@tanstack/react-query"
import { Dialog } from "./ui/dialog"
import { Button } from "./ui/Button"
import { useAuthStore } from "../stores/useAuthStore"
import api from "../utils/api"
import { toast } from "sonner"

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
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "avatar-1")

  const mutation = useMutation({
    mutationFn: (avatar: string) => api.put("/auth/me", { avatar }),
    onSuccess: (response) => {
      // Update local user state
      // We need to keep the token but update the user object
      const token = useAuthStore.getState().token
      if (token && response.data.data) {
        login(token, response.data.data)
      }

      toast.success(t('profile.update_success') || "Profile updated successfully")
      onOpenChange({ open: false })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || t('dialogs.something_wrong'))
    }
  })

  const handleSave = () => {
    mutation.mutate(selectedAvatar)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('profile.edit_profile') || "Edit Profile"}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange({ open: false })}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSave}
            isLoading={mutation.isPending}
          >
            {t('common.save')}
          </Button>
        </>
      }
    >
      <div className="space-y-4 py-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block text-center mb-4">
          {t('auth.choose_avatar')}
        </label>

        <div className="flex justify-center gap-4 flex-wrap">
          {avatars.map((avatar) => (
            <button
              key={avatar.id}
              type="button"
              onClick={() => setSelectedAvatar(avatar.id)}
              className={`
                relative w-16 h-16 rounded-full overflow-hidden transition-all duration-200 
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
                  // Fallback to color if image fails
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement?.classList.add(avatar.color)
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </Dialog>
  )
}

export default ProfileDialog
