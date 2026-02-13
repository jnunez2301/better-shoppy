import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Link, useNavigate } from "@tanstack/react-router"
import { useAuthStore } from "../stores/useAuthStore"
import api from "../utils/api"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { LuShoppingBag, LuUser } from "react-icons/lu"
import { toast } from "sonner"

const loginSchema = z.object({
  username: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await api.post("/auth/login", data)
      login(response.data.data.token, response.data.data.user)
      toast.success(t('auth.login_title'))
      navigate({ to: "/" })
    } catch (error: any) {
      console.log(error)
      toast.error(error.response?.data?.error || "Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl dark:shadow-gray-900/40 border border-gray-100 dark:border-gray-800">
        <div className="text-center">
          <div className="mb-6 flex flex-col items-center gap-2">
            <img src="/logo_tab.png" alt="Logo" className="w-20 h-20 object-contain" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Shoppy</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {t('auth.login_title')}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('auth.login_subtitle')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.username')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <LuUser className="h-5 w-5" />
                </div>
                <input
                  {...register("username")}
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username.message as string}</p>
              )}
            </div>
            <Input
              label={t('auth.password')}
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
            size="lg"
          >
            {t('auth.login_button')}
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth.no_account')} {" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              {t('auth.register_here')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
