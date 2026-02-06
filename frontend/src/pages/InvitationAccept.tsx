import { useParams, useNavigate } from "@tanstack/react-router"
import { useQuery, useMutation } from "@tanstack/react-query"
import api from "../utils/api"
import { toast } from "sonner"
import { useAuthStore } from "../stores/useAuthStore"
import { Button } from "../components/ui/Button"
import { LuMailOpen, LuCircleAlert } from "react-icons/lu"

const InvitationAccept = () => {
  const { token } = useParams({ strict: false })
  const navigate = useNavigate()
  const { token: userToken } = useAuthStore()

  const { data: invitation, isLoading, error } = useQuery({
    queryKey: ["invitation", token],
    queryFn: async () => {
      const response = await api.get(`/invitations/${token}`)
      return response.data.data
    },
  })

  const acceptMutation = useMutation({
    mutationFn: () => api.post(`/invitations/${token}/accept`),
    onSuccess: (response) => {
      toast.success("Invitation accepted!")
      navigate({ to: "/cart/$id", params: { id: response.data.data.cartId } })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Could not accept invitation")
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
          <div className="inline-flex items-center justify-center p-4 bg-red-100 dark:bg-red-900/20 rounded-full text-red-600 dark:text-red-400">
            <LuCircleAlert className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invalid Link</h1>
          <p className="text-gray-500 dark:text-gray-400">
            This invitation link is invalid, has expired, or has already been used.
          </p>
          <Button onClick={() => navigate({ to: "/" })} className="w-full">
            Return Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl dark:shadow-gray-900/40 border border-gray-100 dark:border-gray-800 text-center">
        <div className="relative inline-block">
          <div className="inline-flex items-center justify-center p-5 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-500/30 mb-2">
            <LuMailOpen className="w-10 h-10" />
          </div>
          <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            You're Invited!
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            You've been invited to collaborate on the shopping list:
          </p>
          <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
            <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
              {invitation.Cart?.name}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 px-4">
          Joining this cart will allow you to see and modify products in real-time with other members.
        </p>

        <div className="space-y-3">
          {!userToken ? (
            <div className="grid gap-3">
              <Button size="lg" onClick={() => navigate({ to: "/login" })}>
                Sign In to Accept
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate({ to: "/register" })}>
                Create Account
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              className="w-full h-14 text-lg"
              onClick={() => acceptMutation.mutate()}
              isLoading={acceptMutation.isPending}
            >
              Accept Invitation
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default InvitationAccept
