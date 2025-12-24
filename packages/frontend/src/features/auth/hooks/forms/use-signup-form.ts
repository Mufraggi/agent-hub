import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { authClient } from "@/lib/auth/auth-client"
import { signupFormDefaults } from "../../schema"
import {
  validateEmail,
  validatePassword,
  validateName,
  toFormValidator,
} from "../../factory/validators/auth.validators"

/**
 * Signup form hook with validation and submission
 */
export const useSignupForm = () => {
  const form = useForm({
    defaultValues: signupFormDefaults,
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
          callbackURL: "/dashboard",
        },
        {
          onSuccess: () => {
            toast.success("Signup successful")
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
      name: toFormValidator(validateName),
      email: toFormValidator(validateEmail),
      password: toFormValidator(validatePassword),
    },
  }
}
