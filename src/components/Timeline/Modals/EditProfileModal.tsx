'use client'
import DateSelect from '@/components/atoms/DateSelect/DateSelect'
import InputWarningText from '@/components/atoms/InputWarningText'
import Button from '@/components/atoms/Buttons'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import { ButtonPrimary } from '@/components/Buttons/PrimaryButton'
import { useEditProfile } from '@/services/edit-profile'
import { useUniStore } from '@/store/store'
import { country_list } from '@/utils/countriesList'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'

export interface editProfileInputs {
  first_name: string
  last_name: string
  users_id: string
  profile_dp?: string
  email?: string
  cover_dp?: string
  bio?: string
  gender: string
  phone_number?: string
  dob?: string
  country?: string
  city?: string
  university_name?: string
  study_year?: string
  degree?: string
  major?: string
  affiliation?: string
  occupation?: string
  totalFilled: number
  _id: string
}

const EditProfileModal = () => {
  const { mutate: mutateEditProfile, isPending } = useEditProfile()
  const { userData, userProfileData } = useUniStore()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<editProfileInputs>({
    defaultValues: {
      first_name: userData.firstName,
      last_name: userData.lastName,
      bio: userProfileData?.bio,
      phone_number: userProfileData?.phone_number,
      gender: userData.gender,
      dob: userProfileData?.dob ? new Date(userProfileData?.dob).toISOString().split('T')[0] : '',
      country: userProfileData?.country,
      city: userProfileData?.city,
      university_name: userProfileData?.university_name,
      study_year: userProfileData?.study_year,
      degree: userProfileData?.degree,
      major: userProfileData?.major,
      affiliation: userProfileData?.affiliation,
      occupation: userProfileData?.occupation,
      totalFilled: userProfileData?.totalFilled,
    },
  })

  const onSubmit: SubmitHandler<editProfileInputs> = (data) => {
    const emailToInsert = [{ UniversityName: data.affiliation, UniversityEmail: data.email }]
    const dataToPush = { ...data, email: emailToInsert }
    mutateEditProfile(dataToPush)
  }
  return (
    <div className=" flex flex-col justify-center rounded-xl lg:w-[500px] font-poppins w-full">
      <h1 className="text-md font-bold text-neutral-700">Edit Profile</h1>
      <p className="text-xs text-neutral-600">This will show up on your profile for others to see</p>
      <form className="flex flex-col font-medium text-sm gap-4">
        <div className="flex flex-col">
          <p className="text-sm font-bold py-2">Basic Information</p>
          <label htmlFor="firstname" className="py-1 text-sm text-neutral-700">
            First Name
          </label>
          <input
            {...register('first_name', { required: true })}
            placeholder="Enter First Name"
            className="text-base border pl-3 py-1 rounded-lg border-gray-light font-normal"
          />
          {errors.first_name && <span className="text-red-500 font-normal">Please enter first name</span>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="lastname" className="py-1 text-sm text-neutral-700">
            Last Name
          </label>
          <input
            {...register('last_name', { required: true })}
            placeholder="Enter Last Name"
            className="text-base border pl-3 py-1 rounded-lg border-gray-light font-normal"
          />
          {errors.last_name && <span className="text-red-500 font-normal">Please enter your date of birth</span>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="dob" className="py-1 text-sm text-neutral-700">
            Date of Birth
          </label>
          <Controller
            name="dob"
            control={control}
            rules={{ required: 'birthDate is required!' }}
            render={({ field }) => <DateSelect value={field.value} onChange={field.onChange} placeholder="Birthday" err={!!errors.dob} />}
          />
          {errors.dob && <InputWarningText>Please enter your Birthday!</InputWarningText>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="gender" className="py-1 text-sm text-neutral-700">
            Gender
          </label>
          <input
            {...register('gender', { required: true })}
            placeholder="Choose Gender"
            className="text-base border pl-3 py-1 rounded-lg border-gray-light font-normal"
          />
          {errors.gender && <span className="text-red-500 font-normal">Please enter your full name!</span>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="country" className="py-1">
            Country
          </label>
          <Controller
            name="country"
            control={control}
            rules={{ required: 'country is required!' }}
            render={({ field }) => (
              <SelectDropdown
                options={country_list}
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Select a country"
                icon={'dual'}
                search={true}
                err={!!errors.country}
              />
            )}
          />
          {errors.country && <InputWarningText>{errors?.country?.message?.toString()}</InputWarningText>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="city" className="py-1">
            City
          </label>
          <input
            {...register('city')}
            placeholder="Write a short bio to introduce yourself"
            className="text-base border pl-3 py-1 rounded-lg border-gray-light font-normal"
          />
          {errors.bio && <span className="text-red-500 font-normal">Please enter your bio</span>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="study_year">Year</label>
          <input
            {...register('study_year')}
            placeholder=""
            type="number"
            className="text-base border pl-3 py-1 rounded-lg border-gray-light font-normal"
          />
          {errors.study_year && <span className="text-red-500 font-normal">Please enter your graduation year!</span>}
        </div>
        <div className="flex flex-col">
          <p className="text-gray-1 font-normal">This field is for students undergoing a degree.</p>
          <label htmlFor="degree" className="py-1 ">
            Degree
          </label>
          <input {...register('degree')} placeholder="" className=" text-base border pl-3 py-1 rounded-lg border-gray-light font-normal" />
          {errors.degree && <span className="text-red-500 font-normal">Please enter the degree you&apos;re pursuing!</span>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="major" className="py-1 ">
            Field of Study
          </label>
          <input {...register('major')} placeholder="" className=" text-base border pl-3 py-1 rounded-lg border-gray-light font-normal" />
          {errors.major && <span className="text-red-500 font-normal">Please enter the field of study!</span>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="occupation" className="py-1 ">
            Occupation(for Faculty)
          </label>

          <input {...register('occupation')} placeholder="" className=" text-base border pl-3 py-1 rounded-lg border-gray-light font-normal" />
          {errors.occupation && <span className="text-red-500 font-normal">Please enter your occupation!</span>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="affiliation" className="py-1 ">
            Affilation
          </label>
          <input {...register('affiliation')} placeholder="" className=" text-base border pl-3 py-1 rounded-lg border-gray-light font-normal" />
          {errors.affiliation && <span className="text-red-500 font-normal">Please enter the affilation!</span>}
        </div>

        <p className="text-gray-1 font-normal">School or department you are part of.</p>

        <label htmlFor="tags" className="py-1  font-semibold">
          Home Location
        </label>

        <label htmlFor="country" className="py-1 ">
          Country
        </label>
        <input {...register('country')} placeholder="Country" className=" text-base border pl-3 py-1 rounded-lg border-gray-light font-normal" />
        {errors.country && <span className="text-red-500 font-normal">Please enter your Country!</span>}
        <label htmlFor="city" className="py-1 ">
          City
        </label>
        <input {...register('city')} placeholder="City" className=" text-base border pl-3 py-1 rounded-lg border-gray-light font-normal" />
        {errors.city && <span className="text-red-500 font-normal">Please enter your City!</span>}
        <label htmlFor="phone_number" className="py-1 ">
          Phone Number
        </label>
        <input
          {...register('phone_number')}
          placeholder=""
          type="number"
          className=" text-base border pl-3 py-1 rounded-lg border-gray-light font-normal"
        />
        {errors.phone_number && <span className="text-red-500 font-normal">Please enter your phone number!</span>}

        <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={isPending}>
          Update Profile
        </Button>
        <Button variant="shade" onClick={() => reset()}>
          Redo Changes
        </Button>
      </form>
    </div>
  )
}

export default EditProfileModal
