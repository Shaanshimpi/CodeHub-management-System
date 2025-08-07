import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { register } from '../../store/slices/authSlice'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  // Define available roles (adjust according to your needs)
  const availableRoles = [
    { value: 'student', label: 'Student' },
    { value: 'trainer', label: 'Trainer' },
    { value: 'sales_person', label: 'Sales Person' },
    // Add other roles as needed
  ]

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    role: 'student', // Default role
    password: '',
    confirmPassword: ''
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    role: Yup.string()
      .oneOf(availableRoles.map(role => role.value))
      .required('Role is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required')
  })

  const onSubmit = async (values) => {
    setIsLoading(true)
    try {
      await dispatch(register(values)).unwrap()
      toast.success('Registration successful')
      navigate('/login')
    } catch (error) {
      toast.error(error || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">Register</div>
      <div className="card-body">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, values }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <Field
                  type="text"
                  name="name"
                  className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                />
                <ErrorMessage name="name" component="div" className="invalid-feedback" />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                />
                <ErrorMessage name="email" component="div" className="invalid-feedback" />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <Field
                  type="text"
                  name="phone"
                  className={`form-control ${errors.phone && touched.phone ? 'is-invalid' : ''}`}
                />
                <ErrorMessage name="phone" component="div" className="invalid-feedback" />
              </div>
              
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <Field
                  as="select"
                  name="role"
                  className={`form-control ${errors.role && touched.role ? 'is-invalid' : ''}`}
                >
                  {availableRoles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="role" component="div" className="invalid-feedback" />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="password"
                  className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                />
                <ErrorMessage name="password" component="div" className="invalid-feedback" />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
                />
                <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
              </div>
              
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Register;