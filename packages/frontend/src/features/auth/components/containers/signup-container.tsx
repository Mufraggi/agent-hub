import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "@tanstack/react-router"
import { useSignupForm, useSocialSignIn } from "../../hooks"
import { SocialLoginButton } from "../common/social-login-button"
import { CallbackURL } from "../../schema/auth.schema"


type SignupContainerProps = React.ComponentProps<"div">

export function SignupContainer({ className, ...props }: SignupContainerProps) {
  const { form, validators } = useSignupForm()
  const { signInWithGitHub } = useSocialSignIn()

  const handleGitHubSignIn = async () => {
    await signInWithGitHub("/dashboard" as CallbackURL)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Sign up with your GitHub account or email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="signup-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <Field>
                <SocialLoginButton
                  provider="github"
                  onClick={handleGitHubSignIn}
                  label="Sign up with GitHub"
                />
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <form.Field
                name="name"
                validators={{
                  onBlur: ({ value }) => validators.name(value),
                  onSubmit: ({ value }) => validators.name(value),
                }}
                children={(field) => {
                  const hasErrors = field.state.meta.errors.length > 0
                  const isInvalid =
                    hasErrors &&
                    (field.state.meta.isTouched ||
                      form.state.submissionAttempts > 0)
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="John Doe"
                        autoComplete="name"
                        type="text"
                      />
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors.map((e: unknown) => ({
                            message:
                              typeof e === "string"
                                ? e
                                : (e as { message?: string })?.message,
                          }))}
                        />
                      )}
                    </Field>
                  )
                }}
              />

              <form.Field
                name="email"
                validators={{
                  onBlur: ({ value }) => validators.email(value),
                  onSubmit: ({ value }) => validators.email(value),
                }}
                children={(field) => {
                  const hasErrors = field.state.meta.errors.length > 0
                  const isInvalid =
                    hasErrors &&
                    (field.state.meta.isTouched ||
                      form.state.submissionAttempts > 0)
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="m@example.com"
                        autoComplete="email"
                        type="email"
                      />
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors.map((e: unknown) => ({
                            message:
                              typeof e === "string"
                                ? e
                                : (e as { message?: string })?.message,
                          }))}
                        />
                      )}
                    </Field>
                  )
                }}
              />

              <form.Field
                name="password"
                validators={{
                  onBlur: ({ value }) => validators.password(value),
                  onSubmit: ({ value }) => validators.password(value),
                }}
                children={(field) => {
                  const hasErrors = field.state.meta.errors.length > 0
                  const isInvalid =
                    hasErrors &&
                    (field.state.meta.isTouched ||
                      form.state.submissionAttempts > 0)
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="********"
                        autoComplete="new-password"
                        type="password"
                      />
                      {isInvalid && (
                        <FieldError
                          errors={field.state.meta.errors.map((e: unknown) => ({
                            message:
                              typeof e === "string"
                                ? e
                                : (e as { message?: string })?.message,
                          }))}
                        />
                      )}
                    </Field>
                  )
                }}
              />

              <Field>
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="underline">
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
