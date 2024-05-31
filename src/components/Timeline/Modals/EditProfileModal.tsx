'use client'
import { useForm, SubmitHandler } from 'react-hook-form'

interface editProfileInputs {
  fullname: string
  bio: string
  year: number
  degree: string
  fieldOfStudy: string
  occupationForFaculty: string
  affilation: string
  country: string
  city: string
  email: string
  phoneNumber: string
  dateOfBirth: string
}

const EditProfileModal = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<editProfileInputs>()

  const onSubmit: SubmitHandler<editProfileInputs> = (data) => {
    console.log(data)
    console.log('Edit Profile Errors', errors)
  }
  return (
    <div className="flex flex-col justify-center px-6 py-8 rounded-xl w-[85%] lg:w-[500px] mx-4">
      <h1 className="text-xl font-bold mb-1 text-[#404040]">Edit Profile</h1>
      <p>This will show up on your profile for others to see</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col font-medium text-sm">
        <label htmlFor="fullname" className="py-1 mt-5">
          Full Name
        </label>
        <input
          {...register('fullname', { required: true })}
          placeholder="We recommend using your real name!"
          className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal"
        />
        {errors.fullname && <span className="text-red-500 font-normal">Please enter your full name!</span>}
        <label htmlFor="bio" className="py-1 mt-5">
          Bio
        </label>
        <input
          {...register('bio')}
          placeholder="Write a short bio to introduce yourself"
          className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal"
        />
        {errors.bio && <span className="text-red-500 font-normal">Please enter your bio!</span>}

        <label htmlFor="tags" className="py-1 mt-5 font-semibold">
          Tags
        </label>

        <label htmlFor="year" className="py-1 mt-5">
          Year
        </label>
        <input {...register('year')} placeholder="" type="number" className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal" />
        {errors.year && <span className="text-red-500 font-normal">Please enter your graduation year!</span>}
        <p className="text-gray-1 font-normal">This field is for students undergoing a degree.</p>
        <label htmlFor="degree" className="py-1 mt-5">
          Degree
        </label>
        <input {...register('degree')} placeholder="" className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal" />
        {errors.degree && <span className="text-red-500 font-normal">Please enter the degree you&apos;re pursuing!</span>}
        <label htmlFor="fieldOfStudy" className="py-1 mt-5">
          Field of Study
        </label>
        <input {...register('fieldOfStudy')} placeholder="" className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal" />
        {errors.fieldOfStudy && <span className="text-red-500 font-normal">Please enter the field of study!</span>}
        <label htmlFor="occupation" className="py-1 mt-5">
          Occupation(for Faculty)
        </label>
        <input {...register('occupationForFaculty')} placeholder="" className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal" />
        {errors.occupationForFaculty && <span className="text-red-500 font-normal">Please enter your occupation!</span>}
        <label htmlFor="affilation" className="py-1 mt-5">
          Affilation
        </label>
        <input {...register('affilation')} placeholder="" className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal" />
        {errors.fieldOfStudy && <span className="text-red-500 font-normal">Please enter the affilation!</span>}
        <p className="text-gray-1 font-normal">School or department you are part of.</p>

        <label htmlFor="tags" className="py-1 mt-5 font-semibold">
          Home Location
        </label>

        <label htmlFor="country" className="py-1 mt-5">
          Country
        </label>
        <input {...register('country')} placeholder="Country" className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal" />
        {errors.country && <span className="text-red-500 font-normal">Please enter your Country!</span>}
        <label htmlFor="city" className="py-1 mt-5">
          City
        </label>
        <input {...register('city')} placeholder="City" className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal" />
        {errors.city && <span className="text-red-500 font-normal">Please enter your City!</span>}
        <label htmlFor="email" className="py-1 mt-5">
          Email
        </label>
        <input
          {...register('email', {
            required: true,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'Please enter a valid email address',
            },
          })}
          placeholder="Email Address"
          className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal"
        />
        {errors.email && <span className="text-red-500 font-normal">{errors.email.message ? errors.email.message : 'Please enter your email!'}</span>}
        <label htmlFor="phone" className="py-1 mt-5">
          Phone Number
        </label>
        <input
          {...register('phoneNumber')}
          placeholder=""
          type="number"
          className=" border pl-3 py-2 text-md rounded-lg border-gray-light font-normal"
        />
        {errors.phoneNumber && <span className="text-red-500 font-normal">Please enter your phone number!</span>}
        <label htmlFor="birthday" className="py-1 mt-5">
          Date of Birth*
        </label>
        <input
          type="date"
          {...register('dateOfBirth', { required: true })}
          className=" border px-3 py-2 text-md rounded-lg border-gray-light font-normal text-gray"
        />
        {errors.dateOfBirth && <span className="text-red-500 font-normal">Please enter your birth date!</span>}
        <input type="submit" value="Update Profile" className="bg-primary py-3 mt-16 rounded-lg text-white font-medium mb-5" />
        <button className="bg-primary-50 py-3 rounded-lg text-primary font-medium mb-5" onClick={() => reset()}>
          Redo Changes
        </button>
      </form>
    </div>
  )
}

export default EditProfileModal
