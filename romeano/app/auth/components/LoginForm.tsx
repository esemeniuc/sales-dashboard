import { AuthenticationError, Routes, useMutation } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"
import NextLink from "next/link"

export const LoginForm = (props: {
  onSuccess?: () => void,
  portalId?: number
}) => {
  const [loginMutation] = useMutation(login)

  return (
    <div>
      <h1>Please verify your email address</h1>
      <Form
        submitText="Submit"
        schema={Login}
        onSubmit={async (values) => {
          try {
            await loginMutation({ portalId: props.portalId, email: values.email })
            props.onSuccess?.()
          } catch (error) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
            } else {
              return {
                [FORM_ERROR]:
                "Sorry, we had an unexpected error. Please try again. - " + error.toString()
              }
            }
          }
        }}
      >
        <LabeledTextField name="email" label="" placeholder="Email" />
      </Form>

      <br />
      <br />
      <h1>AE1P1 Greg Login</h1>
      <NextLink href={Routes.MagicLinkPage({ magicLinkId: "ae1Login" })}>
        <a><span className="font-bold">Click me!!</span></a>
      </NextLink>
      <h1>AE2P1 Alexis Login</h1>
      <NextLink href={Routes.MagicLinkPage({ magicLinkId: "ae2Login" })}>
        <a><span className="font-bold">Click me!!</span></a>
      </NextLink>
      <h1>AE3P2 Julia Login</h1>
      <NextLink href={Routes.MagicLinkPage({ magicLinkId: "ae3Login" })}>
        <a><span className="font-bold">Click me!!</span></a>
      </NextLink>

      <br />
      <br />

      <h1>Stakeholder1P1 Kristin Login</h1>
      <NextLink href={Routes.MagicLinkPage({ magicLinkId: "stakeholder1Login" })}>
        <a><span className="font-bold">Click me!!</span></a>
      </NextLink>
      <h1>Stakeholder2P1 Wally Login</h1>
      <NextLink href={Routes.MagicLinkPage({ magicLinkId: "stakeholder2Login" })}>
        <a><span className="font-bold">Click me!!</span></a>
      </NextLink>
      <h1>Stakeholder3P2 Ali Login</h1>
      <NextLink href={Routes.MagicLinkPage({ magicLinkId: "stakeholder3Login" })}>
        <a><span className="font-bold">Click me!!</span></a>
      </NextLink>
    </div>
  )
}

export default LoginForm
