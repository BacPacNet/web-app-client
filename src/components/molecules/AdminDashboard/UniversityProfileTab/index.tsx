'use client'

import AdminLiveUpdateNotice from '@/components/molecules/AdminDashboard/AdminLiveUpdateNotice'
import UniversityProfileDetailsForm from '@/components/molecules/AdminDashboard/UniversityProfileDetailsForm'
import UniversityProfileImagesSection from '@/components/molecules/AdminDashboard/UniversityProfileImagesSection'
import Loading from '@/components/atoms/Loading'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { UpdateUniversityProfilePayload } from '@/services/universitySearch'
import { useUploadToS3 } from '@/services/upload'
import { UniversityAdminTabProps } from '@/types/University'
import { UPLOAD_CONTEXT } from '@/types/Uploads'
import { useEffect, useState } from 'react'
export default function UniversityProfileTab({
  className = '',
  university,
  isUniversityLoading,
  universityId,
  universityName,
  onUpdateProfile,
  isUpdatingProfile,
}: UniversityAdminTabProps) {
  const { mutateAsync: uploadToS3 } = useUploadToS3()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [savedName, setSavedName] = useState('')
  const [savedDescription, setSavedDescription] = useState('')
  const [pendingHeroFile, setPendingHeroFile] = useState<File | null>(null)
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null)
  const [heroPreviewUrl, setHeroPreviewUrl] = useState('')
  const [logoPreviewUrl, setLogoPreviewUrl] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const nextName = university?.name ?? ''
    const nextDescription = university?.short_overview ?? ''
    setName(nextName)
    setDescription(nextDescription)
    setSavedName(nextName)
    setSavedDescription(nextDescription)
  }, [university?.name, university?.short_overview])

  useEffect(() => {
    if (!pendingHeroFile) {
      setHeroPreviewUrl(university?.campus ?? '')
    }
    if (!pendingLogoFile) {
      setLogoPreviewUrl(university?.logo ?? '')
    }
  }, [university?.campus, university?.logo, pendingHeroFile, pendingLogoFile])

  useEffect(() => {
    return () => {
      if (heroPreviewUrl.startsWith('blob:')) URL.revokeObjectURL(heroPreviewUrl)
      if (logoPreviewUrl.startsWith('blob:')) URL.revokeObjectURL(logoPreviewUrl)
    }
  }, [heroPreviewUrl, logoPreviewUrl])

  const hasChanges = name !== savedName || description !== savedDescription || pendingHeroFile !== null || pendingLogoFile !== null

  const handleHeroImageSelect = (file: File) => {
    setPendingHeroFile(file)
    setHeroPreviewUrl((prev) => {
      if (prev.startsWith('blob:')) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }

  const handleLogoImageSelect = (file: File) => {
    setPendingLogoFile(file)
    setLogoPreviewUrl((prev) => {
      if (prev.startsWith('blob:')) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const payload: UpdateUniversityProfilePayload = {
        name,
        short_overview: description,
      }

      if (pendingHeroFile) {
        const uploadResponse = await uploadToS3({
          files: [pendingHeroFile],
          context: UPLOAD_CONTEXT.COVER_DP,
        })
        const imageUrl = uploadResponse.data[0]?.imageUrl
        if (imageUrl) payload.campus = imageUrl
      }

      if (pendingLogoFile) {
        const uploadResponse = await uploadToS3({
          files: [pendingLogoFile],
          context: UPLOAD_CONTEXT.DP,
        })
        const imageUrl = uploadResponse.data[0]?.imageUrl
        if (imageUrl) payload.logo = imageUrl
      }

      onUpdateProfile(payload, {
        onSuccess: () => {
          setSavedName(name)
          setSavedDescription(description)
          setPendingHeroFile(null)
          setPendingLogoFile(null)
          showCustomSuccessToast('University profile updated successfully')
        },
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (!universityId || !universityName) {
    return (
      <div className={className}>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
          University information is required to manage the profile.
        </div>
      </div>
    )
  }

  if (isUniversityLoading) return <Loading />

  const isSaveInProgress = isSaving || isUpdatingProfile

  return (
    <div className={className}>
      <div className="flex flex-col gap-6">
        <AdminLiveUpdateNotice />

        <UniversityProfileImagesSection
          heroImageUrl={heroPreviewUrl}
          logoImageUrl={logoPreviewUrl}
          onHeroImageSelect={handleHeroImageSelect}
          onLogoImageSelect={handleLogoImageSelect}
          disabled={isSaveInProgress}
        />

        <UniversityProfileDetailsForm
          name={name}
          description={description}
          onNameChange={setName}
          onDescriptionChange={setDescription}
          onSave={handleSave}
          isSaving={isSaveInProgress}
          isSaveDisabled={!hasChanges}
        />
      </div>
    </div>
  )
}
