'use client'

import AdminSectionHeader from '@/components/molecules/AdminDashboard/AdminSectionHeader'
import UniversityProfileImageUpload from '@/components/molecules/AdminDashboard/UniversityProfileImageUpload'

type Props = {
  heroImageUrl?: string
  logoImageUrl?: string
  onHeroImageSelect: (file: File) => void
  onLogoImageSelect: (file: File) => void
  disabled?: boolean
}

export default function UniversityProfileImagesSection({
  heroImageUrl,
  logoImageUrl,
  onHeroImageSelect,
  onLogoImageSelect,
  disabled = false,
}: Props) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <AdminSectionHeader title="Images" />

      <UniversityProfileImageUpload
        label="Hero Image"
        helperText="The wide banner photo shown at the top of the university profile page."
        imageUrl={heroImageUrl}
        variant="hero"
        inputId="university-hero-image"
        onFileSelect={onHeroImageSelect}
        disabled={disabled}
      />

      <UniversityProfileImageUpload
        label="University Logo"
        helperText="Shown in the circular logo holder next to the university name."
        imageUrl={logoImageUrl}
        variant="logo"
        inputId="university-logo-image"
        onFileSelect={onLogoImageSelect}
        disabled={disabled}
      />
    </div>
  )
}
