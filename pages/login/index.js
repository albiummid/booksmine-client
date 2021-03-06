import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons/lib/icons'
import { Divider, Form } from 'antd'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  ButtonSubmit,
  InputPassword,
  InputText,
  LoginCard,
  LoginContainer,
  ResetContainer,
  SocialCard,
  SocialLoginContainer,
} from '../../components/Layout/Elements.styles'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
const Login = () => {
  const auth = getAuth()
  const router = useRouter()
  const [isNewUser, setIsNewUser] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isResetPassword, setIsResetPassword] = useState(false)
  const [error, setError] = useState('')
  const [userData, setUserData] = useState(null)
  const { data: session, loading: ld } = useSession()
  let from = router.query.from

  const handleSubmit = ({ name, email, password }) => {
    if (isNewUser) {
      handleSignUp(name, email, password)
    } else {
      handleSignIn(email, password)
    }
  }

  const handleSignIn = (email, password) => {
    setLoading(true)
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        setUserData(user)
        // ...
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        toast.error(errorMessage)
        if (error.code === 'auth/user-not-found') {
          setError('Incorrect email and user not found !')
        }
        if (error.code === 'auth/wrong-password') {
          setError('Incorrect password !')
        }
        if (error.code === 'auth/too-many-requests') {
          setError(
            'You have done many failed login attepts.Please try again later !'
          )
        }
      })
      .finally(() => setLoading(false))
  }

  const handleSignUp = (name, email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUserData(auth.currentUser)
        toast.success(`User Created !`)
        updateProfile(userCredential.user, {
          displayName: name,
          photoURL: 'https://example.com/jane-q-user/profile.jpg',
        }).then((data) => {
          console.log(data, 'updatedData')
          toast.success('User Name saved')
          // ...
        })
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        toast.error(errorMessage)
        // ..
      })
  }
  useEffect(() => {
    if (session) {
      toast.info('You are already logged In.Logout for another account !')
      router.push(from || '/')
    }
  })

  useEffect(() => {
    if (userData) {
      handleFinish()
    }
  }, [userData])

  const handleFinish = () => {
    const user = {
      id: userData.uid,
      name: userData.displayName,
      email: userData.email,
    }
    signIn('credentials', {
      callbackUrl: from ? from : '/',
      ...user,
    })
  }

  const handleResetPass = (email) => {
    setLoading(true)
    passwordReset(email)
      .then(() => {
        setError('')
        passwordReset(email)
        toast.success('Password Reset Email Has Been Sent To Your Mail !')
        setLoading(false)
        setIsResetPassword(false)
      })
      .catch((e) => {
        notification.error({ message: e.code })
        setLoading(false)
        if (e.code === 'auth/user-not-found') {
          setError('User not found !')
          toast.error('User Not Found !')
        }
        console.log(e.code)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (loading || ld) return <LoadingSpinner />

  return (
    <LoginContainer>
      {!isResetPassword ? (
        <LoginCard>
          <h1>{isNewUser ? 'Sign Up' : 'Login'}</h1>
          {!isNewUser ? (
            <Form onFinish={handleSubmit}>
              <Form.Item
                style={{ width: '100%' }}
                name='email'
                rules={[
                  {
                    required: true,
                    message: 'Please input your email address!',
                    validateTrigger: 'onSubmit',
                  },
                ]}
              >
                <InputText
                  large={true}
                  type='email'
                  placeholder='Email address'
                  prefix={<MailOutlined />}
                />
              </Form.Item>
              <Form.Item
                style={{ width: '100%' }}
                name='password'
                rules={[
                  {
                    required: true,
                    message: 'Please enter a password!',
                  },
                ]}
              >
                <InputPassword
                  placeholder='Password'
                  prefix={<LockOutlined />}
                />
              </Form.Item>
              {
                <a
                  onClick={() => setIsResetPassword(true)}
                  style={{ marginRight: 'auto' }}
                >
                  Forgot password?
                </a>
              }
              {error && <div className='error'>{error}</div>}
              <ButtonSubmit htmlType='submit' size='large'>
                Login
              </ButtonSubmit>
              <a onClick={() => setIsNewUser(!isNewUser)}>
                {!isNewUser
                  ? "Don't have an account? SignUp"
                  : "Have an account? Let's Sign In"}
              </a>
            </Form>
          ) : (
            <Form onFinish={handleSubmit}>
              <Form.Item
                style={{ width: '100%' }}
                name='username'
                rules={[{ required: true, message: 'Please write your name!' }]}
                hasFeedback
              >
                <InputText
                  large={true}
                  placeholder='Name'
                  prefix={<UserOutlined />}
                />
              </Form.Item>
              <Form.Item
                style={{ width: '100%' }}
                name='email'
                rules={[
                  {
                    required: true,
                    message: 'Please input your email address!',
                  },
                  {
                    pattern: new RegExp(
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    ),
                    message: "This email isn't valid.Please check your email",
                  },
                ]}
                hasFeedback
              >
                <InputText
                  large={true}
                  placeholder='Email address'
                  prefix={<MailOutlined />}
                />
              </Form.Item>
              {/* <Form.Item
                                        style={{ width: "100%" }}
                                        name="phone"
                                        rules={[{ required: true, message: 'Please input your phone number!', },]}
                                    >
                                        <InputText
                                            placeholder="Phone Number"
                                            prefix={<MobileOutlined />}
                                        />

                                    </Form.Item> */}
              <Form.Item
                style={{ width: '100%' }}
                name='password'
                rules={[
                  { required: true, message: 'Please give a password!' },
                  {
                    min: 8,
                    message: 'Password Must be minimum 8 characters',
                  },
                ]}
                hasFeedback
              >
                <InputPassword
                  onEnter
                  placeholder='Password'
                  prefix={<LockOutlined />}
                />
              </Form.Item>
              <Form.Item
                style={{ width: '100%' }}
                name='confirmPassword'
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }

                      return Promise.reject(
                        new Error('Your confirmed password not matched !')
                      )
                    },
                  }),
                ]}
              >
                <InputPassword
                  placeholder='Confirm Password'
                  prefix={<LockOutlined />}
                />
              </Form.Item>
              {error && <p className='error'>{error}</p>}

              <ButtonSubmit size='large' disabled={loading} htmlType='submit'>
                Sign Up
              </ButtonSubmit>
              <a onClick={() => setIsNewUser(!isNewUser)}>
                {!isNewUser
                  ? "Don't have an account? SignUp"
                  : "Have an account? Let's Sign In"}
              </a>
            </Form>
          )}

          <div className='w-[100%]'>
            <Divider style={{ color: 'black' }}>Or Login With</Divider>
            <SocialLoginContainer>
              <SocialCard
                onClick={() => {
                  signIn('google', {
                    callbackUrl: from ? from : '/',
                  })
                }}
              >
                <Image
                  className='rounded-full bg-transparent'
                  src={'/images/icons/google.png'}
                  width={100}
                  height={100}
                  alt='google'
                />
              </SocialCard>
              <SocialCard
                onClick={() =>
                  signIn('facebook', {
                    callbackUrl: from ? from : '/',
                  })
                }
              >
                <Image
                  className='rounded-full bg-transparent'
                  src={'/images/icons/facebook.png'}
                  width={100}
                  height={100}
                  alt='fb'
                />
              </SocialCard>
              <SocialCard
                onClick={() =>
                  signIn('github', {
                    callbackUrl: from ? from : '/',
                  })
                }
              >
                <Image
                  className='rounded-full bg-transparent'
                  src={'/images/icons/github.png'}
                  width={100}
                  height={100}
                  alt='github'
                />
              </SocialCard>
            </SocialLoginContainer>
          </div>
        </LoginCard>
      ) : (
        <ResetContainer>
          <h3>Please Enter your email</h3>
          {error && <p className='error'>{error}</p>}
          <Form onFinish={handleResetPass}>
            <Form.Item
              style={{ width: '100%' }}
              name='email'
              rules={[
                {
                  required: true,
                  message: 'Please input your email address!',
                },
                {
                  pattern: new RegExp(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                  ),
                  message: "This email isn't valid",
                },
              ]}
              hasFeedback
            >
              <InputText
                placeholder='Email address'
                prefix={<MailOutlined />}
              />
            </Form.Item>
            <ButtonSubmit size='large' htmlType='submit'>
              Reset Password
            </ButtonSubmit>
          </Form>
        </ResetContainer>
      )}
    </LoginContainer>
  )
}

export default Login
