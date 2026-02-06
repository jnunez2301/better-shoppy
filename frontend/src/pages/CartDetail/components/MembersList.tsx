import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../../utils/api"
import { LuTrash2 } from "react-icons/lu"
import { toast } from "sonner"
import { useAuthStore } from "../../../stores/useAuthStore"
import { Dialog } from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/Button"

interface Props {
  cartId: string
  members: any[]
  userRole: string
  open: boolean
  onOpenChange: (e: { open: boolean }) => void
}

const MembersList = ({ cartId, members, userRole, open, onOpenChange }: Props) => {
  const queryClient = useQueryClient()
  const { user: currentUser } = useAuthStore()
  const canManage = userRole === "owner" || userRole === "admin"

  const removeUserMutation = useMutation({
    mutationFn: (userId: string) => api.delete(`/carts/${cartId}/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] })
      toast.success("Member removed")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Could not remove member")
    },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Cart Members"
      footer={
        <Button onClick={() => onOpenChange({ open: false })}>
          Close
        </Button>
      }
    >
      <div className="space-y-4" data-testid="members-list">
        {members.map((member: any) => (
          <div
            key={member.user.id}
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${member.role === 'owner' ? 'from-amber-400 to-orange-500' : 'from-blue-400 to-indigo-500'}`}>
              {member.user.username.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-white truncate">
                  {member.user.username} {member.user.id === currentUser?.id && "(You)"}
                </span>
                <span className={`
                  text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full
                  ${member.role === 'owner'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}
                `}>
                  {member.role}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {member.user.email}
              </p>
            </div>

            {canManage && member.role !== "owner" && member.user.id !== currentUser?.id && (
              <button
                onClick={() => {
                  if (window.confirm(`Remove ${member.user.username} from this cart?`)) {
                    removeUserMutation.mutate(member.user.id)
                  }
                }}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                aria-label="Remove member"
              >
                <LuTrash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}

        {members.length === 0 && (
          <p className="text-center py-4 text-gray-500">No members found.</p>
        )}
      </div>
    </Dialog>
  )
}

export default MembersList
