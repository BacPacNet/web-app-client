import axios from 'axios'
import CryptoJS from 'crypto-js'

const presetKey: any = process.env.NEXT_PUBLIC_preset_key
const cloudName = process.env.NEXT_PUBLIC_cloudName
const APIKEY = process.env.NEXT_PUBLIC_Api
const apiSecret = process.env.NEXT_PUBLIC_Api_Secret
// api_key: '198584357429765',
// api_secret: 'hiDUnW34r_xGmFdEHHBE80BaLT0',

// Function to generate the signature
function generateSignature(publicId: any) {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const toSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
  const signature = CryptoJS.SHA1(toSign).toString()

  return { signature, timestamp }
}

// Function to delete the previous image
async function deletePreviousImage(publicId: any) {
  try {
    const { signature, timestamp } = generateSignature(publicId)

    // Make the request to Cloudinary to delete the image
    const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      public_id: publicId,
      api_key: APIKEY,
      timestamp: timestamp,
      signature: signature,
    })

    console.log('Previous image deleted', res.data)
  } catch (err) {
    console.log('Error deleting previous image', err)
  }
}

export async function uploadNewImage(img: any) {
  const formData = new FormData()
  formData.append('file', img)
  formData.append('upload_preset', presetKey)

  try {
    const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData)
    if (res?.data?.secure_url) {
      const imageUrl = res.data.secure_url
      const publicId = res.data.public_id

      // console.log('New image uploaded', res.data)
      // console.log('New image uploaded', imageUrl)
      return { imageUrl: imageUrl, publicId: publicId }
    }
  } catch (err) {
    console.log('Error uploading new image', err)
  }
}

export async function replaceImage(img: any, previousImagePublicId: any) {
  // console.log('previousImagePublicId', previousImagePublicId)

  if (previousImagePublicId) {
    // console.log('prev', previousImagePublicId)

    await deletePreviousImage(previousImagePublicId)
  }
  const data = await uploadNewImage(img)
  return data
}
