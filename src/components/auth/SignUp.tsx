import { FC } from 'react'
import { Formik } from "formik"
import * as Yup from 'yup'
import { auth } from '../../firebaseSingleton'
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

export type FirebaseErrorType = { message: string }

const SignUpFormSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required('Required'),
  email: Yup.string()
    .email('Invalid Email')
    .trim()
    .required('Required'),
  password: Yup.string()
    .required('Required'),
  passwordConfirmation: Yup.string()
    .required('Required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
})

const SignUp: FC = () => {
  const navigate = useNavigate()
  return (
  <Formik
    initialValues={{ name: '', email: '', password: '', passwordConfirmation: ''}}
    validationSchema={SignUpFormSchema}
    onSubmit={async(values, formikActions) => {
      try {
        const { user } = await createUserWithEmailAndPassword(auth, values.email, values.password)

        if (!user.uid) {
          throw new Error('Did not retrieve a uid when the user was created in firestore')
        } else {
          await updateProfile(user, { displayName: values.name })
          await sendEmailVerification(user)
          navigate('/')
        }
      } catch (error: unknown) {
        alert((error as FirebaseErrorType).message)
        console.log(error)
      } finally {
        formikActions.setSubmitting(false)
      }
    }}
  >
    {({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) => (
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}
      >
        <input
          type="name"
          name="name"
          placeholder='Your name'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.name}

        />
        {errors.name && touched.name && errors.name}
        <input
          type="email"
          name="email"
          placeholder='Email'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.email}
        />
        {errors.email && touched.email && errors.email}
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password}
        />
        {errors.password && touched.password && errors.password}
        <input
          type="password"
          name="passwordConfirmation"
          placeholder="Confirm password"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.passwordConfirmation}
        />
        {errors.passwordConfirmation && touched.passwordConfirmation && errors.passwordConfirmation}
        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>
      </form>
    )}
  </Formik>
)}

export default SignUp
