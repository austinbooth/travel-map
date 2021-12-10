import { FC } from 'react'
import { Formik } from "formik"
import * as Yup from 'yup'
import { auth } from '../../firebaseSingleton'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { FirebaseErrorType } from './SignUp'
import { useNavigate } from 'react-router-dom'

const SignUpFormSchema = Yup.object({
  email: Yup.string()
    .email('Invalid Email')
    .trim()
    .required('Required'),
  password: Yup.string()
    .required('Required'),
})

const SignIn: FC = () => {
  const navigate = useNavigate()
  return (
  <Formik
    initialValues={{ email: '', password: ''}}
    validationSchema={SignUpFormSchema}
    onSubmit={async(values, formikActions) => {
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password)
        navigate('/')
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
        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>
      </form>
    )}
  </Formik>
)}

export default SignIn
