import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Link, useNavigate } from "@tanstack/react-router"
import { useAuthStore } from "../stores/useAuthStore"
import api from "../utils/api"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { useState } from "react"
import { LuShoppingBag, LuUser } from "react-icons/lu"
import { toast } from "sonner"

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  avatar: z.enum(["avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

const avatars = [
  { id: "avatar-1", color: "bg-red-500" },
  { id: "avatar-2", color: "bg-blue-500" },
  { id: "avatar-3", color: "bg-green-500" },
  { id: "avatar-4", color: "bg-orange-500" },
  { id: "avatar-5", color: "bg-purple-500" },
]

const Register = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)
  const [selectedAvatar, setSelectedAvatar] = useState("avatar-1")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      avatar: "avatar-1",
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const response = await api.post("/auth/register", data)
      login(response.data.data.token, response.data.data.user)
      toast.success(t('auth.register_title'))
      navigate({ to: "/" })
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.error || "Something went wrong")
    }
  }

  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);
  };

  const handleAvatarSelect = (id: string) => {
    setSelectedAvatar(id)
    setValue("avatar", id as any)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl dark:shadow-gray-900/40 border border-gray-100 dark:border-gray-800">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/30 mb-4">
            <LuUser className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {t('auth.register_title')}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t('auth.register_subtitle')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="space-y-4">
            <Input
              label={t('auth.username')}
              placeholder="johndoe"
              error={errors.username?.message}
              {...register("username")}
            />
            <Input
              label={t('auth.password')}
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              label={t('auth.confirm_password')}
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.choose_avatar')}
              </label>
              <div className="flex justify-center gap-4 py-2">
                {avatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => handleAvatarSelect(avatar.id)}
                    className={`
                      relative w-12 h-12 rounded-full overflow-hidden
                      transition-all duration-200 hover:scale-110 ring-offset-2 dark:ring-offset-gray-900
                      ${selectedAvatar === avatar.id ? "ring-2 ring-blue-500 scale-110" : "scale-100 opacity-60 hover:opacity-100"}
                    `}
                  >
                    <img
                      src={`/avatars/${avatar.id}.png`}
                      alt={avatar.id}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              {errors.avatar && (
                <p className="text-xs text-red-500 text-center">{errors.avatar.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
            size="lg"
          >
            {t('auth.register_button')}
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth.have_account')} {" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              {t('auth.login_here')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Register
