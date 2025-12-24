import { authClient } from "@/lib/auth/auth-client"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import {
  toFormValidator,
  validateEmail,
  validateName,
  validatePassword
} from "../../factory/validators/auth.validators"
import { signupFormDefaults } from "../../schema/form/signup.form.schema"

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
          callbackURL: "/dashboard"
        },
        {
          onSuccess: () => {
            toast.success("Signup successful")
          },
          onError: (ctx) => {
            toast.error(ctx.error.message)
          }
        }
      )
    }
  })

  return {
    form,
    validators: {
      name: toFormValidator(validateName),
      email: toFormValidator(validateEmail),
      password: toFormValidator(validatePassword)
    }
  }
}
