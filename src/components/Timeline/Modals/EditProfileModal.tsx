'use client'
import DateSelect from '@/components/atoms/DateSelect/DateSelect'
import InputWarningText from '@/components/atoms/InputWarningText'
import Button from '@/components/atoms/Buttons'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import { useEditProfile } from '@/services/edit-profile'
import { useUniStore } from '@/store/store'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { TiCameraOutline } from 'react-icons/ti'
import { useEffect, useState } from 'react'
import { replaceImage } from '@/services/uploadImage'
import { currYear, degreeAndMajors, GenderOptions, occupationAndDepartment } from '@/types/RegisterForm'
import { FaCamera } from 'react-icons/fa'
import { useGetUserData } from '@/services/user'
import { closeModal } from '@/components/molecules/Modal/ModalManager'
import { Spinner } from '@/components/spinner/Spinner'
import { Country, City } from 'country-state-city'

export interface editProfileInputs {
  firstName: string
  lastName: string
  profilePicture: string | null
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
  const { userProfileData } = useUniStore()
  const { data: userProfile } = useGetUserData(userProfileData?.users_id as string)
  const [user, setUser] = useState<any>(null)
  const [userType, setUserType] = useState('student')
  const [previewProfileImage, setPreviewProfileImage] = useState<File | null | string>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<editProfileInputs>()

  const profilePicture = watch('profilePicture')

  useEffect(() => {
    if (userProfile) {
      const { firstName, lastName, gender, profile, email } = userProfile || {}
      const userDefault = {
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        gender: gender || '',
        affiliation: profile.affiliation || '',
        bio: profile.bio || '',
        city: profile.city || '',
        country: profile.country || '',
        degree: profile.degree || '',
        dob: profile.dob || '',
        major: profile.major || '',
        occupation: profile.occupation || '',
        phone_number: profile.phone_number || '',
        study_year: profile.study_year || '',
        profilePicture: null,
      }
      reset(userDefault)
      setUser({ ...userDefault, profile_dp: profile?.profile_dp })
      setPreviewProfileImage(profile?.profile_dp?.imageUrl)
    }
  }, [userProfile, reset])

  const [cityOptions, setCityOptions] = useState<string[]>([])
  const [isCityAvailable, setIsCityAvailable] = useState(true)
  const currCountry = watch('country') || ''

  const handleCountryChange = (selectedCountry: string, field?: any) => {
    const getCountyCode = Country.getAllCountries().find((country) => country.name === selectedCountry)?.isoCode
    if (getCountyCode) {
      setCityOptions(City.getCitiesOfCountry(getCountyCode)!.map((state) => state.name))
      field.onChange(selectedCountry) // Update the country field value
    }
  }

  type DegreeKeys = keyof typeof degreeAndMajors
  const currDegree = watch('degree') as DegreeKeys
  const [currMajor, setCurrMajor] = useState<any>([])

  type occupationKeys = keyof typeof occupationAndDepartment
  const currOccupation = watch('occupation') as occupationKeys
  const currFormDepartment = watch('affiliation') as occupationKeys

  const [currDepartment, setCurrDepartment] = useState<any>([])

  useEffect(() => {
    setCurrDepartment(occupationAndDepartment[currOccupation] || [])
    if (!occupationAndDepartment[currOccupation]?.includes(currFormDepartment)) {
      setValue('affiliation', '')
    }
  }, [currOccupation, setValue])

  useEffect(() => {
    setCurrMajor(degreeAndMajors[currDegree] || [])
  }, [currDegree, setValue])

  useEffect(() => {
    const getCountyCode = Country.getAllCountries().find((country) => country.name === currCountry)?.isoCode
    if (getCountyCode) {
      setCityOptions(City.getCitiesOfCountry(getCountyCode)!.map((state) => state.name))
    }
  }, [currCountry, setValue])

  const validateBio = (value: string | undefined): string | boolean => {
    if (!value || value.trim() === '') return true // Allow empty input

    const wordCount = value.trim().split(/\s+/).filter(Boolean).length

    return wordCount <= 10 || 'Bio must not exceed 10 words'
  }

  const handleImageUpload = async () => {
    const files = profilePicture
    if (files) {
      const data = await replaceImage(files, userProfileData?.profile_dp?.publicId)
      return { imageUrl: data?.imageUrl, publicId: data?.publicId }
    } else {
      console.error('No file selected.')
    }
  }

  // Handle image preview
  const handleImagePreview = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      setPreviewProfileImage(URL.createObjectURL(file))
      setValue('profilePicture', file)
    }
  }

  const onSubmit: SubmitHandler<editProfileInputs> = async (data) => {
    setIsProfileLoading(true)
    let profileImageData = user?.profile_dp
    if (profilePicture) {
      profileImageData = await handleImageUpload()
    }
    mutateEditProfile({ ...data, profile_dp: profileImageData })
    setIsProfileLoading(false)
    closeModal()
  }

  return (
    <div className=" flex flex-col justify-center rounded-xl  font-poppins w-full">
      <h1 className="text-md font-bold text-neutral-700">Edit Profile</h1>
      {/* <p className="text-xs text-neutral-600">This will show up on your profile for others to see</p> */}
      <p className="text-xs text-neutral-600">
        <span className="text-destructive-600">*</span> Are required fields to fill.
      </p>
      <form className="flex flex-col font-medium text-sm gap-4">
        <div className="flex items-center gap-4 mt-4">
          {previewProfileImage ? (
            <div className="relative w-20 h-20 rounded-full border border-neutral-200 group">
              <img
                className="rounded-full object-cover w-20 h-20"
                src={typeof previewProfileImage === 'string' ? previewProfileImage : URL.createObjectURL(previewProfileImage)}
                alt="aa"
              />
              <div className="group-hover:block hidden absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-primary-50 py-1 px-2 rounded-full text-primary font-medium cursor-pointer">
                <input
                  {...register('profilePicture')}
                  style={{ display: 'none' }}
                  type="file"
                  id="changeProfileImage"
                  onChange={handleImagePreview}
                />
                <label
                  htmlFor="changeProfileImage"
                  className="bg-primary w-10 h-10 flex justify-center items-center rounded-full p-2 text-neutral-800"
                >
                  <FaCamera color="white" />
                </label>
              </div>
            </div>
          ) : (
            <label htmlFor="changeProfileImage" className="w-20 h-20 rounded-full border border-neutral-200 flex items-center justify-center">
              <input style={{ display: 'none' }} {...register('profilePicture')} type="file" id="changeProfileImage" onChange={handleImagePreview} />
              <TiCameraOutline className="text-primary text-lg" />
            </label>
          )}

          <p className="text-sm text-neutral-700">Edit Profile Picture</p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-bold py-2">Basic Information</p>
          <label htmlFor="firstname" className="py-1 text-sm text-neutral-700">
            First Name <span className="text-destructive-600">*</span>
          </label>
          <input
            {...register('firstName', { required: true })}
            placeholder="Enter First Name"
            className="text-base border pl-3 py-1 rounded-lg border-gray-light font-normal"
          />
          {errors.firstName && <span className="text-red-500 font-normal">Please enter first name</span>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="lastname" className="py-1 text-sm text-neutral-700">
            Last Name <span className="text-destructive-600">*</span>
          </label>
          <input
            {...register('lastName', { required: true })}
            placeholder="Enter Last Name"
            className="text-base border pl-3 py-1 rounded-lg border-gray-light font-normal"
          />
          {errors.lastName && <span className="text-red-500 font-normal">Please enter your date of birth</span>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="dob" className="py-1 text-sm text-neutral-700">
            Date of Birth <span className="text-destructive-600">*</span>
          </label>
          <Controller
            name="dob"
            control={control}
            rules={{ required: 'birthDate is required!' }}
            render={({ field }) => <DateSelect value={field.value} onChange={field.onChange} placeholder="Birthday" err={!!errors.dob} />}
          />
          {errors.dob && <InputWarningText>Please enter your Birthday!</InputWarningText>}
        </div>

        <div className="w-full flex flex-col relative">
          <label htmlFor="dob" className="py-1 text-sm text-neutral-700">
            Gender
          </label>
          <Controller
            name="gender"
            control={control}
            rules={{ required: 'Gender is required!' }}
            render={({ field }) => (
              <SelectDropdown
                options={GenderOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select a Gender"
                icon={'single'}
                err={!!errors.gender}
              />
            )}
          />
          {errors.gender && <InputWarningText>{errors?.gender?.message?.toString()}</InputWarningText>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="bio" className="py-1">
            Bio
          </label>
          <input
            {...register('bio', { validate: validateBio })}
            placeholder="Write a short bio to introduce yourself"
            className="text-base border pl-3 py-1 rounded-lg border-gray-light font-normal"
          />
          {errors.bio && <span className="text-red-500 font-normal">{errors.bio.message}</span>}
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
                options={Country.getAllCountries().map((country) => country.name)}
                value={field.value || ''}
                onChange={(selectedCountry: string) => handleCountryChange(selectedCountry, field)}
                placeholder="Select a country"
                icon={'single'}
                search={true}
                err={!!errors.country}
              />
            )}
          />
          {errors.country && <InputWarningText>{errors?.country?.message?.toString()}</InputWarningText>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="country" className="py-1">
            City
          </label>
          <Controller
            name="city"
            control={control}
            rules={{
              validate: (value?: string) => (isCityAvailable || value === 'Not available' || value ? true : 'City selection is required!'),
            }}
            render={({ field }) => (
              <SelectDropdown
                options={cityOptions}
                key={cityOptions[0]}
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Select a city"
                icon={'single'}
                search={true}
                err={!!errors.city}
              />
            )}
          />

          {errors.country && <InputWarningText>{errors?.country?.message?.toString()}</InputWarningText>}
        </div>
        {/* contact information start */}
        <div>
          <div className="flex flex-col gap-4">
            <p className="text-sm font-bold ">Contact Information</p>
            <div className="flex flex-col gap-2">
              <label htmlFor="phone_number" className="py-1 ">
                Email
              </label>
              <input
                {...register('email')}
                placeholder="Enter an email you would like to show others"
                type="email"
                className="border pl-3 py-2 rounded-lg border-gray-light text-2xs"
              />
              {errors.phone_number && <span className="text-red-500 font-normal">Please enter your phone number!</span>}
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone_number" className="py-1 ">
                Phone Number
              </label>
              <input
                {...register('phone_number')}
                placeholder=""
                type="number"
                className=" text-xs border pl-3 py-1 rounded-lg border-gray-light font-normal"
              />
              {errors.phone_number && <span className="text-red-500 font-normal">Please enter your phone number!</span>}
            </div>
          </div>
        </div>
        {/* contact information end */}

        <div>
          <p className="text-sm font-bold py-2 ">
            What is your status? <span className="text-destructive-600">*</span>
          </p>
          <p className="text-2xs text-destructive-600">
            You can only change your status once every academic year. You cannot change back after updating your status for 1 year.
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <input
              className="w-4 h-4"
              checked={userType == 'student'}
              id="student"
              onClick={() => setUserType('student')}
              type="radio"
              name="userType"
            />
            <label htmlFor="student">Student</label>
          </div>

          {userType === 'student' && (
            <>
              <div className="flex flex-col py-2">
                <label htmlFor="study_year" className="py-1">
                  Year <span className="text-destructive-600">*</span>
                </label>
                <div className="w-full flex flex-col relative">
                  <Controller
                    name="study_year"
                    control={control}
                    rules={{ required: 'Year is required!' }}
                    render={({ field }) => (
                      <SelectDropdown
                        options={currYear}
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="year"
                        icon={'single'}
                        err={!!errors.study_year}
                      />
                    )}
                  />
                  {errors.study_year && <InputWarningText>{errors?.study_year?.message?.toString()}</InputWarningText>}
                </div>
              </div>
              <div className="flex flex-col py-2">
                <label htmlFor="degree" className="py-1">
                  Degree <span className="text-destructive-600">*</span>
                </label>
                <div className="w-full flex flex-col relative">
                  <Controller
                    name="degree"
                    control={control}
                    rules={{ required: 'Degree is required!' }}
                    render={({ field }) => (
                      <SelectDropdown
                        options={Object.keys(degreeAndMajors)}
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Select a degree"
                        icon={'single'}
                        search={true}
                        err={!!errors.degree}
                      />
                    )}
                  />
                  {errors.degree && <InputWarningText>{errors?.degree?.message?.toString()}</InputWarningText>}
                </div>
              </div>
              <div className="flex flex-col py-2">
                <label htmlFor="major" className="py-1">
                  Field of Study <span className="text-destructive-600">*</span>
                </label>
                <div className="w-full flex flex-col relative">
                  <Controller
                    name="major"
                    control={control}
                    rules={{ required: 'Major is required!' }}
                    disabled={!currDegree}
                    render={({ field }) => (
                      <SelectDropdown
                        key={currMajor}
                        options={currMajor}
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Select a major"
                        icon={'single'}
                        err={!!errors.major}
                      />
                    )}
                  />
                  {errors.major && <InputWarningText>{errors?.major?.message?.toString()}</InputWarningText>}
                </div>
              </div>
            </>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <input
              className="w-4 h-4"
              checked={userType == 'applicant'}
              id="applicant"
              onClick={() => setUserType('applicant')}
              type="radio"
              name="userType"
            />
            <label htmlFor="applicant">Applicant</label>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <input
              className="w-4 h-4"
              checked={userType == 'faculty'}
              id="faculty"
              onClick={() => setUserType('faculty')}
              type="radio"
              name="userType"
            />
            <label htmlFor="faculty">Faculty</label>
          </div>

          {userType === 'faculty' && (
            <>
              <div className="flex flex-col">
                <label htmlFor="occupation" className="py-1">
                  Occupation <span className="text-destructive-600">*</span>
                </label>
                <div className="w-full flex flex-col py-2 relative">
                  <Controller
                    name="occupation"
                    control={control}
                    rules={{ required: 'Occupation is required!' }}
                    render={({ field }) => (
                      <SelectDropdown
                        options={Object.keys(occupationAndDepartment)}
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Select a occupation"
                        icon={'dual'}
                        search={true}
                        err={!!errors.occupation}
                      />
                    )}
                  />
                  {errors.occupation && <InputWarningText>{errors?.occupation?.message?.toString()}</InputWarningText>}
                </div>
              </div>
              <div className="flex flex-col py-2">
                <label htmlFor="affiliation" className="py-1">
                  Affiliation <span className="text-destructive-600">*</span>
                </label>
                <div className="w-full flex flex-col relative">
                  <Controller
                    name="affiliation"
                    control={control}
                    rules={{ required: 'Department is required!' }}
                    disabled={!currDepartment}
                    render={({ field }) => (
                      <SelectDropdown
                        key={currDepartment}
                        options={currDepartment}
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Select a department"
                        icon={'single'}
                        err={!!errors.affiliation}
                      />
                    )}
                  />
                  {errors.affiliation && <InputWarningText>{errors?.affiliation?.message?.toString()}</InputWarningText>}
                </div>
              </div>
            </>
          )}
        </div>

        <Button variant="primary" type="submit" onClick={handleSubmit(onSubmit)} disabled={!isDirty}>
          {isProfileLoading ? <Spinner /> : 'Update Profile'}
        </Button>
        <Button variant="shade" onClick={() => reset()}>
          Redo Changes
        </Button>
      </form>
    </div>
  )
}

export default EditProfileModal
