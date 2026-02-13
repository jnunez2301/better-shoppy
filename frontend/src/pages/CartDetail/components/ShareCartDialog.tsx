import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { LuCopy, LuLink, LuTrash2, LuPlus } from "react-icons/lu"
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
    mutationFn: () => api.post(`/carts/${cartId}/invitations`, { role: 'editor', singleUse: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", cartId] })
      toast.success(t('dialogs.invitation_created'), {
        description: "Share link created successfully"
      })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Could not create share link")
    },
  })

  const revokeInvitationMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/invitations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", cartId] })
      toast.success("Share link revoked")
    },
  })

  const copyToClipboard = (token: string) => {
    const url = `${window.location.origin}/invitation/${token}`
    navigator.clipboard.writeText(url)
    toast.success(t('dialogs.link_copied'))
  }

  const pendingInvitations = invitations.filter((i: any) => i.status === "pending")
  console.log(pendingInvitations)
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
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Generate Share Code
          </label>
          <Button
            onClick={() => createInvitationMutation.mutate()}
            isLoading={createInvitationMutation.isPending}
            className="w-full"
          >
            <LuPlus className="mr-2" /> Create New Share Code
          </Button>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Share this code with others to let them join this cart. Codes expire in 48 hours.
          </p>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        {/* Active Share Links */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Active Share Codes
          </h3>

          {pendingInvitations.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
              <LuLink className="w-8 h-8 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No active share codes</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {pendingInvitations.map((inv: any) => (
                <div
                  key={inv.id}
                  className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        Share Code
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold mt-0.5">
                        {t('dialogs.expires')} {new Date(inv.expiresAt).toLocaleDateString()} {new Date(inv.expiresAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <button
                      onClick={() => revokeInvitationMutation.mutate(inv.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      aria-label="Revoke"
                    >
                      <LuTrash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Display the Code */}
                  <div className="relative">
                    <div className="w-full px-3 py-4 text-center text-2xl font-bold tracking-widest bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white font-mono select-all">
                      {inv.code}
                    </div>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(inv.code)
                        toast.success("Code copied to clipboard")
                      }}
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      <LuCopy className="w-4 h-4" />
                    </Button>
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
