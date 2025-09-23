'use client'
import DateSelect from '@/components/atoms/DateSelect/DateSelect'
import InputWarningText from '@/components/atoms/InputWarningText'
import Button from '@/components/atoms/Buttons'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import SelectUniversityDropdown from '@/components/atoms/SelectUniversityDropDown'
import { useEditProfile } from '@/services/edit-profile'
import { useUniStore } from '@/store/store'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { degreeAndMajors, GenderOptions, occupationAndDepartment, userTypeEnum } from '@/types/RegisterForm'
import { useGetUserData } from '@/services/user'
import { Spinner } from '@/components/spinner/Spinner'
import { Country, City } from 'country-state-city'
import { useUploadToS3 } from '@/services/upload'
import { UPLOAD_CONTEXT } from '@/types/Uploads'
import { useModal } from '@/context/ModalContext'
import { ProfileDp } from '@/types/User'
import Title from '@/components/atoms/Title'
import SubText from '@/components/atoms/SubText'
import ProfileImageUploader from '@/components/molecules/ProfileImageUploader'
import { parseDateOfBirth } from '@/lib/date'
import { validateSingleImageFile } from '@/lib/utils'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'

export interface editProfileInputs {
  firstName: string
  lastName: string
  profilePicture: File | null
  users_id: string
  profile_dp?: ProfileDp
  displayEmail?: string
  cover_dp?: string
  bio?: string
  gender: string
  phone_number?: string
  dob?: string
  country?: string
  city?: string
  university_name?: string
  universityId?: string
  universityLogo?: string
  study_year?: string
  degree?: string
  major?: string
  affiliation?: string
  occupation?: string
  totalFilled: number
  _id: string
}

// Reusable labeled input component
const LabeledInput = ({
  label,
  required = false,
  error,
  children,
  htmlFor,
}: {
  label: string
  required?: boolean
  error?: string | boolean
  children: React.ReactNode
  htmlFor?: string
}) => (
  <div className="flex flex-col">
    <label htmlFor={htmlFor} className="py-1 text-sm text-neutral-700 font-medium">
      {label} {required && <span className="text-destructive-600">*</span>}
    </label>
    {children}
    {error && <span className="text-red-500 font-normal">{error}</span>}
  </div>
)

const EditProfileModal = () => {
  const { mutateAsync: mutateEditProfile, isPending } = useEditProfile()
  const { userProfileData } = useUniStore()
  const { closeModal } = useModal()
  const { data: userProfile } = useGetUserData(userProfileData?.users_id as string)
  const [userType, setUserType] = useState<userTypeEnum>(userProfileData?.role || userTypeEnum.Student)
  const [profileImageFile, setProfileImageFile] = useState<File | string | null>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { mutateAsync: uploadtoS3 } = useUploadToS3()

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<editProfileInputs>()

  useEffect(() => {
    if (userProfile) {
      const { firstName, lastName, gender, profile } = userProfile || {}
      const userDefault = {
        firstName: firstName || '',
        lastName: lastName || '',
        displayEmail: profile?.displayEmail || '',
        gender: gender || '',
        affiliation: profile?.affiliation || '',
        bio: profile?.bio || '',
        city: profile?.city || '',
        country: profile?.country || '',
        degree: profile?.degree || '',
        dob: parseDateOfBirth(profile?.dob),
        major: profile?.major || '',
        occupation: profile?.occupation || '',
        phone_number: profile?.phone_number || '',
        study_year: profile?.study_year || '',
        university_name: profile?.university_name || '',
        universityId: profile?.university_id || '',
        universityLogo: profile?.universityLogo || '',
        profilePicture: null,
      }
      reset(userDefault)
      setProfileImageFile(profile?.profile_dp?.imageUrl || null)
    }
  }, [userProfile, reset])

  const currCountry = watch('country') || ''
  const currBio = watch('bio') || ''
  const countryOptions = useMemo(() => Country.getAllCountries().map((country) => country.name), [])

  const cityOptions = useMemo(() => {
    const isoCode = Country.getAllCountries().find((country) => country.name === currCountry)?.isoCode
    if (!isoCode) return []
    return City.getCitiesOfCountry(isoCode)?.map((city) => city.name) ?? []
  }, [currCountry])

  const handleCountryChange = useCallback((selectedCountry: string, field: any) => {
    field.onChange(selectedCountry)
  }, [])

  type DegreeKeys = keyof typeof degreeAndMajors
  const currYear = watch('study_year') as DegreeKeys

  type occupationKeys = keyof typeof occupationAndDepartment
  const currOccupation = watch('occupation') as occupationKeys

  const currDepartment = useMemo(() => occupationAndDepartment[currOccupation] || [], [currOccupation])

  const validateBio = (value: string | undefined): string | boolean => {
    if (!value || value.trim() === '') return true
    const trimmedValue = value.trim()
    const charCount = trimmedValue.length
    if (charCount > 160) return 'Bio must not exceed 160 characters'
    return true
  }

  // Handle image upload with error handling
  const handleImageUpload = async () => {
    if (profileImageFile && typeof profileImageFile === 'object') {
      try {
        const uploadPayload = {
          files: [profileImageFile] as unknown as File[],
          context: UPLOAD_CONTEXT.DP,
        }
        const uploadResponse = await uploadtoS3(uploadPayload)
        return uploadResponse.data[0]
      } catch (err) {
        setSubmitError('Failed to upload image. Please try again.')
        return null
      }
    } else {
      setSubmitError('No file selected.')
      return null
    }
  }

  // Handle profile image change
  const handleProfileImageChange = useCallback(
    (file: File) => {
      const { isValid, message } = validateSingleImageFile(file, 5 * 1024 * 1024)
      if (!isValid) {
        showCustomDangerToast(message)
        return
      }
      setProfileImageFile(file)
      setValue('profilePicture', file)
    },
    [setValue]
  )

  // Form submit handler with error handling
  const onSubmit: SubmitHandler<editProfileInputs> = async (data) => {
    setIsProfileLoading(true)
    setSubmitError(null)
    let profileImageData = userProfile?.profile?.profile_dp

    if (profileImageFile && typeof profileImageFile === 'object') {
      const uploaded = await handleImageUpload()
      if (!uploaded) {
        setIsProfileLoading(false)
        return
      }
      if (!uploaded.imageUrl || !uploaded.publicId) {
        setSubmitError('Image upload failed: missing imageUrl or publicId.')
        setIsProfileLoading(false)
        return
      }
      profileImageData = { imageUrl: uploaded.imageUrl, publicId: uploaded.publicId }
    }

    try {
      await mutateEditProfile({ ...data, profile_dp: profileImageData, role: userType })
      closeModal()
    } catch (err) {
      setSubmitError('Failed to update profile. Please try again.')
    } finally {
      setIsProfileLoading(false)
    }
  }

  return (
    <div className="flex flex-col justify-center rounded-xl font-poppins w-full">
      <Title>Edit Profile</Title>
      <p className="text-2xs text-neutral-600">
        <span className="text-destructive-600">*</span> Are required fields to fill.
      </p>
      {submitError && <div className="text-red-500 text-sm mb-2">{submitError}</div>}
      <form className="flex flex-col font-medium text-sm gap-4 my-4" onSubmit={handleSubmit(onSubmit)}>
        <ProfileImageUploader label="Profile Picture" imageFile={profileImageFile} onImageChange={handleProfileImageChange} id="editProfileImage" />

        <LabeledInput label="First Name" required error={errors.firstName && 'Please enter first name'} htmlFor="firstname">
          <input
            {...register('firstName', { required: true })}
            placeholder="Enter First Name"
            className="text-base border pl-3 py-1 rounded-lg border-gray-light font-normal text-neutral-700"
            id="firstname"
            disabled={isProfileLoading}
          />
        </LabeledInput>
        <LabeledInput label="Last Name" required error={errors.lastName && 'Please enter last name'} htmlFor="lastname">
          <input
            {...register('lastName', { required: true })}
            placeholder="Enter Last Name"
            className="text-base border pl-3 py-1 rounded-lg border-gray-light font-normal text-neutral-700"
            id="lastname"
            disabled={isProfileLoading}
          />
        </LabeledInput>
        <LabeledInput label="Date of Birth" required error={errors.dob && 'Please enter your Birthday!'} htmlFor="dob">
          <Controller
            name="dob"
            control={control}
            rules={{ required: 'Birth date is required!' }}
            render={({ field }) => <DateSelect value={field.value} onChange={field.onChange} placeholder="Birthday" err={!!errors.dob} />}
          />
        </LabeledInput>

        <div className="flex flex-col">
          <div className="flex justify-between">
            <label htmlFor="bio" className="py-1">
              Bio
            </label>
            <p className="text-xs text-neutral-500 font-normal">{currBio?.trim()?.length}/160</p>
          </div>
          <textarea
            {...register('bio', { validate: validateBio })}
            placeholder="Write a short bio to introduce yourself"
            className="text-base border pl-3 py-2 rounded-lg border-neutral-200 font-normal h-32 resize-none outline-none"
            maxLength={160}
            disabled={isProfileLoading}
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
            render={({ field }) => (
              <SelectDropdown
                options={countryOptions}
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
          <label htmlFor="city" className="py-1">
            City
          </label>
          <Controller
            name="city"
            control={control}
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
          {errors.city && <InputWarningText>{errors?.city?.message?.toString()}</InputWarningText>}
        </div>
        <div>
          <div className="flex flex-col gap-4">
            <LabeledInput label="Email" htmlFor="email">
              <input
                {...register('displayEmail')}
                placeholder="Enter an email you would like to show others"
                type="email"
                className="border pl-3 py-2 rounded-lg border-gray-light text-xs font-normal"
                id="email"
                disabled={isProfileLoading}
              />
            </LabeledInput>
            <SubText>
              This is the email other users will see if they want to contact you. It is separate from your login email and doesn&apos;t affect your
              account access.
            </SubText>

            <LabeledInput label="Phone Number" error={errors.phone_number && 'Please enter your phone number!'} htmlFor="phone_number">
              <input
                {...register('phone_number')}
                placeholder=""
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="text-xs border pl-3 py-2 rounded-lg border-gray-light font-normal"
                id="phone_number"
                disabled={isProfileLoading}
              />
            </LabeledInput>
          </div>
        </div>
        <div className="flex flex-col py-2">
          <label htmlFor="university_name" className="py-1">
            University <span className="text-destructive-600">*</span>
          </label>
          <div className="w-full flex flex-col relative">
            <Controller
              name="university_name"
              control={control}
              rules={{ required: 'University is required!' }}
              render={({ field }) => (
                <SelectUniversityDropdown
                  value={field.value || ''}
                  onChange={(selectedUniversity: any) => {
                    field.onChange(selectedUniversity.name)
                    setValue('universityId', selectedUniversity._id)
                    setValue('universityLogo', selectedUniversity.logo)
                  }}
                  // label="University"
                  placeholder="Select University Name"
                  icon={'single'}
                  search={true}
                  err={!!errors.university_name}
                />
              )}
            />
            {errors.university_name && <InputWarningText>{errors?.university_name?.message?.toString()}</InputWarningText>}
          </div>
        </div>
        <div>
          <Title>
            Edit status<span className="text-destructive-600">*</span>
          </Title>
          <p className="text-2xs font-normal text-destructive-500">You can only change your status twice within 14 days</p>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <input
              className="w-4 h-4"
              checked={userType === 'student'}
              id="student"
              onChange={() => setUserType(userTypeEnum.Student)}
              type="radio"
              name="userType"
              disabled={isProfileLoading}
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
                        options={Object.keys(degreeAndMajors)}
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
                <label htmlFor="major" className="py-1">
                  Major <span className="text-destructive-600">*</span>
                </label>
                <div className="w-full flex flex-col relative">
                  <Controller
                    name="major"
                    control={control}
                    rules={{ required: 'Major is required!' }}
                    disabled={!currYear}
                    render={({ field }) => (
                      <SelectDropdown
                        options={degreeAndMajors[currYear]}
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
              checked={userType === 'faculty'}
              id="faculty"
              onChange={() => setUserType(userTypeEnum.Faculty)}
              type="radio"
              name="userType"
              disabled={isProfileLoading}
            />
            <label htmlFor="faculty">Faculty</label>
          </div>
          {userType === 'faculty' && (
            <>
              <div className="flex flex-col py-2">
                <label htmlFor="university_name" className="py-1">
                  University <span className="text-destructive-600">*</span>
                </label>
                <div className="w-full flex flex-col relative">
                  <Controller
                    name="university_name"
                    control={control}
                    rules={{ required: 'University is required!' }}
                    render={({ field }) => (
                      <SelectUniversityDropdown
                        value={field.value || ''}
                        onChange={(selectedUniversity: any) => {
                          field.onChange(selectedUniversity.name)
                          setValue('universityId', selectedUniversity._id)
                          setValue('universityLogo', selectedUniversity.logo || '/src/assets/Logo Circle.svg')
                        }}
                        placeholder="Select University Name"
                        icon={'single'}
                        search={true}
                        err={!!errors.university_name}
                      />
                    )}
                  />
                  {errors.university_name && <InputWarningText>{errors?.university_name?.message?.toString()}</InputWarningText>}
                </div>
              </div>
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
                    disabled={currDepartment.length === 0}
                    render={({ field }) => (
                      <SelectDropdown
                        key={currDepartment[0] || 'no-dept'}
                        options={currDepartment}
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Select a department"
                        icon={'single'}
                        search={true}
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
        <Button variant="primary" type="submit" disabled={!isDirty || isProfileLoading || isPending}>
          {isProfileLoading || isPending ? <Spinner /> : 'Update Profile'}
        </Button>
        <Button type="button" variant="shade" onClick={() => reset()} disabled={isProfileLoading || isPending}>
          Redo Changes
        </Button>
      </form>
    </div>
  )
}

export default EditProfileModal
