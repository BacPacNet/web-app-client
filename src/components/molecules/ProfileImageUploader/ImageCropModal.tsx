import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Point, Area } from 'react-easy-crop/types'
import { ImageCropModalProps } from './types'
import Buttons from '@/components/atoms/Buttons'

const ImageCropModal: React.FC<ImageCropModalProps> = ({ imageSrc, isOpen, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropChange = useCallback((crop: Point) => {
    setCrop(crop)
  }, [])

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom)
  }, [])

  const handleCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.src = url
    })

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<File> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    // Set canvas size to the crop size
    const size = Math.max(pixelCrop.width, pixelCrop.height)
    canvas.width = size
    canvas.height = size

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Calculate the offset to center the crop
    const offsetX = (size - pixelCrop.width) / 2
    const offsetY = (size - pixelCrop.height) / 2

    // Draw the cropped image centered on the canvas
    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, offsetX, offsetY, pixelCrop.width, pixelCrop.height)

    // Create circular mask
    ctx.globalCompositeOperation = 'destination-in'
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
    ctx.fill()

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'cropped-image.png', { type: 'image/png' })
          resolve(file)
        }
      }, 'image/png')
    })
  }

  const handleCropConfirm = async () => {
    if (croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
        onCropComplete(croppedImage)
        onClose()
      } catch (error) {
        console.error('Error cropping image:', error)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full h-full flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-semibold">Crop Image</h3>
        </div>

        <div className="relative w-full h-80 mb-4">
          <Cropper
            classes={{
              containerClassName: 'ronded-md',
            }}
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={handleCropComplete}
            cropShape="round"
            showGrid={false}
            objectFit="cover"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Zoom: {zoom.toFixed(1)}x</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="flex gap-3">
          <Buttons onClick={onClose} variant="border_primary" size="large" className="w-full">
            Cancel
          </Buttons>
          <Buttons onClick={handleCropConfirm} variant="primary" size="large" className="w-full">
            Confirm
          </Buttons>
        </div>
      </div>
    </div>
  )
}

export default ImageCropModal
