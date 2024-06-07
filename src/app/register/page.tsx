/* eslint-disable @next/next/no-img-element */
'use client'
import Footer from '@components/Footer/Footer'
import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react'
import { AiOutlineEye } from 'react-icons/ai'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import { RegisterForm } from '@/models/auth'
import { useHandleRegister } from '@/services/auth'

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { mutate: mutateRegister } = useHandleRegister()
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors },
    watch,
  } = useForm<RegisterForm>()

  // Get the current values of password and confirmPassword
  const password = watch('password')

  const onSignupSubmit: SubmitHandler<RegisterForm> = (data) => {
    console.log(data)
    console.log('signup errors', signupErrors)
    mutateRegister(data)
  }

  return (
    <main>
      <div className="flex flex-col justify-center items-center bg-violet-100">
        <div className="my-16 bg-white flex flex-col justify-center px-6 py-8 rounded-xl w-[85%] lg:w-[500px] mx-4">
          <div className="mb-8">
            <img src="/unibuzzLogo.png" alt="uniBuzz Logo" />
          </div>
          <h1 className="text-2xl font-extrabold mb-1">Sign Up</h1>
          <p>Start your journey with us by creating an account!</p>
          <form onSubmit={handleSubmitSignup(onSignupSubmit)} className="flex flex-col font-medium">
            <label htmlFor="firstname" className="py-1 mt-5">
              First Name
            </label>
            <input
              {...registerSignup('firstname', { required: true })}
              placeholder="First Name"
              className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal"
            />
            {signupErrors.firstname && <span className="text-red-500 font-normal">Please enter your first name!</span>}
            <label htmlFor="lastname" className="py-1 mt-5">
              Last Name
            </label>
            <input
              {...registerSignup('lastname', { required: true })}
              placeholder="Last Name"
              className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal"
            />
            {signupErrors.lastname && <span className="text-red-500 font-normal">Please enter your last name!</span>}
            <label htmlFor="email" className="py-1 mt-5">
              Email Address
            </label>
            <input
              {...registerSignup('email', {
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
              placeholder="Email Address"
              className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal"
            />
            {signupErrors.email && (
              <span className="text-red-500 font-normal">{signupErrors.email.message ? signupErrors.email.message : 'Please enter your email!'}</span>
            )}
            <label htmlFor="gender" className="py-1 mt-5">
              Gender
            </label>
            {/* TODO: make it a dropdown */}
            <input
              {...registerSignup('gender', {
                required: true,
              })}
              placeholder="Gender"
              className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal"
            />
            {signupErrors.gender && <span className="text-red-500 font-normal">Please enter your Gender!</span>}
            <label htmlFor="birthday" className="py-1 mt-5">
              Birthday
            </label>
            <input
              type="date"
              {...registerSignup('birthday', { required: true })}
              placeholder="Birthday"
              className=" border px-3 py-2 text-md rounded-lg border-gray-light font-normal text-gray"
            />
            {signupErrors.birthday && <span className="text-red-500 font-normal">Please enter your birth date!</span>}
            <label htmlFor="country" className="py-1 mt-5">
              Country
            </label>
            <input
              {...registerSignup('country', { required: true })}
              placeholder="Country"
              className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal"
            />
            {signupErrors.country && <span className="text-red-500 font-normal">Please enter your Country!</span>}
            <label htmlFor="city" className="py-1 mt-5">
              City
            </label>
            <input
              {...registerSignup('city', { required: true })}
              placeholder="City"
              className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal"
            />
            {signupErrors.city && <span className="text-red-500 font-normal">Please enter your City!</span>}
            <label htmlFor="password" className="py-1 mt-5">
              Password
            </label>
            <div className="relative">
              <input
                {...registerSignup('password', {
                  required: true,
                  minLength: {
                    value: 8,
                    message: 'Password must have at least 8 characters',
                  },
                  pattern: {
                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                  },
                })}
                placeholder="Password"
                className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal w-full"
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
            {signupErrors.password && (
              <div className=" max-w-md">
                <span className="text-red-500 font-normal break-words">
                  {signupErrors.password.message ? signupErrors.password.message : 'Please enter your password!'}
                </span>
              </div>
            )}
            <label htmlFor="confirm password" className="py-1 mt-5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                {...registerSignup('confirmPassword', {
                  required: true,
                  // Add validation to match password
                  validate: (value) => value === password || 'Passwords do not match',
                })}
                placeholder="Password"
                className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal w-full"
                type={showConfirmPassword ? 'text' : 'password'}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible
                    className="h-5 w-5 text-gray-700 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                ) : (
                  <AiOutlineEye className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                )}
              </div>
            </div>
            {signupErrors.confirmPassword && <span className="text-red-500 font-normal">{signupErrors.confirmPassword.message}</span>}

            <label htmlFor="tnc" className="my-5 font-normal">
              Terms & Conditions
            </label>
            <div className="lg:max-w-lg md:max-w-md sm:max-w-sm h-40 overflow-auto p-2 font-normal text-sm border border-primary">
              <p>
                Welcome to UniBuzz, a [brief description of your product/service]. These Terms and Conditions (&quot;Terms&quot;) govern your access
                to and use of UniBuzz Network Pvt Ltd (hereon referred to as UniBuzz Networks) website, mobile application, and related services
                (collectively, the &quot;Service&quot;). By accessing or using the Service, you agree to be bound by these Terms, our Privacy Policy,
                and any additional terms applicable to certain features of the Service, which are incorporated herein by reference. By creating an
                account, accessing, or Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel modi et porro quo aut fugiat reprehenderit quod,
                voluptate consequatur, voluptatum repellat quidem. Voluptatem, corporis mollitia laborum ab cumque quaerat soluta! Lorem ipsum dolor
                sit amet, consectetur adipisicing elit. Porro, maxime sint inventore laudantium quos non libero unde. Modi, necessitatibus. Debitis
                quisquam reprehenderit velit necessitatibus, maxime doloremque molestiae numquam accusamus ducimus.
              </p>
            </div>
            <label htmlFor="privacy policy" className="my-5 font-normal">
              Privacy Policy
            </label>
            <div className="lg:max-w-lg md:max-w-md sm:max-w-sm h-40 overflow-auto p-2 font-normal text-sm border border-primary mb-5">
              <p>
                Welcome to UniBuzz, a [brief description of your product/service]. These Terms and Conditions (&quot;Terms&quot;) govern your access
                to and use of UniBuzz Network Pvt Ltd (hereon referred to as UniBuzz Networks) website, mobile application, and related services
                (collectively, the &quot;Service&quot;). By accessing or using the Service, you agree to be bound by these Terms, our Privacy Policy,
                and any additional terms applicable to certain features of the Service, which are incorporated herein by reference. By creating an
                account, accessing, or Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, et, dolorem eaque, id enim laboriosam
                architecto accusamus odit velit dolorum aut? Adipisci vel nisi libero! Beatae earum a illum modi?Lorem ipsum dolor sit amet
                consectetur, adipisicing elit. Ea incidunt distinctio officia architecto. Officiis iure quia repudiandae culpa veniam non nemo
                consequatur ut? Obcaecati, nisi. Soluta, maxime eligendi! Soluta, enim.
              </p>
            </div>
            {/* checkbox for remember me */}
            <div className="flex items-center pl-2">
              <div>
                <input {...registerSignup('tnc', { required: true })} type="checkbox" id="tnc" name="tnc" value={'true'} className="mr-2" />
              </div>
              <label htmlFor="tnc agree" className="text-md font-normal">
                I have read and agree with the terms of service and privacy policy.
              </label>
            </div>
            {signupErrors.tnc && <span className="text-red-500 font-normal">Required!</span>}
            <input type="submit" value="Sign Up" className="bg-primary py-2 rounded-lg text-white text-lg font-normal mb-5 mt-4" />
            <p className="text-md text-center text-gray font-medium px-2">
              Already a member?{' '}
              <span className="text-primary cursor-pointer">
                <Link href={'/login'}>Sign In</Link>
              </span>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default SignUp
