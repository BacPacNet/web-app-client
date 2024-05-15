/* eslint-disable @next/next/no-img-element */
'use client'
import Footer from '@components/Footer/Footer'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react'
import { AiOutlineEye } from 'react-icons/ai'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import Link from 'next/link'
import { useHandleLogin } from '@/services/auth'
import { LoginForm } from '@/models/auth'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: mutateLogin } = useHandleLogin()
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginForm>()

  const onLoginSubmit: SubmitHandler<LoginForm> = (data) => mutateLogin(data)

  return (
    <main>
      <div className="flex flex-col justify-center items-center bg-violet-100">
        <div className="my-16 bg-white flex flex-col justify-center px-6 py-8 rounded-xl w-[85%] lg:w-[500px] mx-4">
          <div className="self-center">
            <img src="/unibuzzLogo.png" alt="uniBuzz Logo" />
          </div>
          <h1 className="text-2xl font-extrabold py-6 text-center">Login to your account</h1>
          <form onSubmit={handleSubmitLogin(onLoginSubmit)} className="flex flex-col font-medium">
            <label htmlFor="email" className="py-1">
              Email Address
            </label>
            <input
              {...registerLogin('email', {
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
              placeholder="Email Address"
              className=" border pl-6 py-2 text-md rounded-lg border-gray-light font-normal"
            />
            {loginErrors.email && (
              <span className="text-red-500 font-normal">{loginErrors.email.message ? loginErrors.email.message : 'Please enter your email!'}</span>
            )}
            <label htmlFor="password" className="py-1 mt-5">
              Password
            </label>
            {/* include validation with required or other standard HTML validation rules */}
            <div className="relative">
              <input
                {...registerLogin('password', { required: true })}
                placeholder="Password"
                className=" border pl-6 py-2 text-md rounded-lg border-gray-light font-normal w-full"
                type={showPassword ? 'text' : 'password'}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                {showPassword ? (
                  <AiOutlineEyeInvisible className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <AiOutlineEye className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>
            </div>
            {/* errors will return when field validation fails  */}
            {loginErrors.password && <span className="text-red-500 font-normal">Please enter your password!</span>}
            <p className="text-sm text-slate-600 font-normal px-2 my-4 cursor-pointer">Forgot Password?</p>
            {/* checkbox for remember me */}
            {/*<div className="flex flex-row items-center mb-4 pl-2">
              <div>
                <input type="checkbox" {...registerLogin('rememberMe')} id="rememberMe" name="rememberMe" value="true" className="mr-2" />
              </div>
              <label htmlFor="rememberMe" className="text-sm font-normal">
                Remember Me
              </label>
            </div>*/}
            <input type="submit" value="Login" className="bg-primary py-2 rounded-xl text-white text-lg font-normal mb-5" />
            <p className="text-md text-center text-gray font-medium px-2">
              Don&apos;t have an account?{' '}
              <span className="text-primary cursor-pointer">
                <Link href={'/register'}>Sign Up</Link>
              </span>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default Login
