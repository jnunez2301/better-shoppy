import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { LuCopy, LuLink, LuUser, LuTrash2 } from "react-icons/lu"
import { toast } from "sonner"
import { Dialog } from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/Button"
import api from "../../../utils/api"

interface Props {
  cartId: string
  open: boolean
  onOpenChange: (e: { open: boolean }) => void
}

const ShareCartDialog = ({ cartId, open, onOpenChange }: Props) => {
  const { t } = useTranslation()
  const [username, setUsername] = useState("")
  const queryClient = useQueryClient()

  const { data: invitations = [] } = useQuery({
    queryKey: ["invitations", cartId],
    queryFn: async () => {
      const response = await api.get(`/carts/${cartId}/invitations`)
      return response.data.data
    },
    enabled: open,
  })

  const createInvitationMutation = useMutation({
    mutationFn: (username: string) => api.post(`/carts/${cartId}/invitations`, { invitedUsername: username }),
    onSuccess: () => {
      setUsername("")
      queryClient.invalidateQueries({ queryKey: ["invitations", cartId] })
      toast.success(t('dialogs.invitation_created'), {
        description: "You can now copy the link below" // Can localize this too if critical
      })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Could not invite user")
    },
  })

  const revokeInvitationMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/invitations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", cartId] })
      toast.success("Invitation revoked")
    },
  })

  const copyToClipboard = (token: string) => {
    const url = `${window.location.origin}/invitation/${token}`
    navigator.clipboard.writeText(url)
    toast.success(t('dialogs.link_copied'))
  }

  const pendingInvitations = invitations.filter((i: any) => i.status === "pending")

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('dialogs.share_title')}
      footer={
        <Button onClick={() => onOpenChange({ open: false })}>
          {t('common.done')}
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Username Invitation */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('dialogs.invite_username')}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LuUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('dialogs.username_placeholder')}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              onClick={() => createInvitationMutation.mutate(username)}
              isLoading={createInvitationMutation.isPending}
              size="sm"
            >
              {t('dialogs.invite_button')}
            </Button>
          </div>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        {/* Pending Invitations */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            {t('dialogs.pending_invitations')}
          </h3>

          {pendingInvitations.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
              <LuLink className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
              <p className="text-sm text-gray-500">{t('dialogs.no_pending')}</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {pendingInvitations.map((inv: any) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {inv.invitedUsername}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold mt-0.5">
                      {t('dialogs.expires')} {new Date(inv.expiresAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => copyToClipboard(inv.token)}
                      variant="outline"
                      size="sm"
                    >
                      <LuCopy className="mr-2" /> {t('dialogs.copy_link')}
                    </Button>
                    <button
                      onClick={() => revokeInvitationMutation.mutate(inv.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      aria-label="Revoke"
                    >
                      <LuTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default ShareCartDialog
