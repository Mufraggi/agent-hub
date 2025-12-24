import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { authClient } from "@/lib/auth/auth-client"
import { loginFormDefaults } from "../../schema"
import {
  validateEmail,
  validatePassword,
  toFormValidator,
} from "../../factory/validators/auth.validators"

/**
 * Login form hook with validation and submission
 */
export const useLoginForm = () => {
  const form = useForm({
    defaultValues: loginFormDefaults,
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: () => {
            toast.success("Login successful")
          },
          onError: (ctx) => {
            toast.error(ctx.error.message)
          },
        }
      )
    },
  })

  return {
    form,
    validators: {
      email: toFormValidator(validateEmail),
      password: toFormValidator(validatePassword),
    },
  }
}
