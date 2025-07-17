//import useCookie from '@/hooks/useCookie'
//import { CloudinaryResponse } from '@/types/Cloudinary'
//import axios, { AxiosResponse } from 'axios'
//import CryptoJS from 'crypto-js'
//import { client } from './api-Client'

//const presetKey: any = process.env.NEXT_PUBLIC_preset_key
//const cloudName = process.env.NEXT_PUBLIC_cloudName
//const APIKEY = process.env.NEXT_PUBLIC_Api
//const apiSecret = process.env.NEXT_PUBLIC_Api_Secret

//// generate the signature
//function generateSignature(publicId: any) {
//  const timestamp = Math.round(new Date().getTime() / 1000)
//  const toSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
//  const signature = CryptoJS.SHA1(toSign).toString()

//  return { signature, timestamp }
//}

//// delete the previous image
//async function deletePreviousImage(publicId: any) {
//  try {
//    const { signature, timestamp } = generateSignature(publicId)

//    await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
//      public_id: publicId,
//      api_key: APIKEY,
//      timestamp: timestamp,
//      signature: signature,
//    })
//  } catch (err) {
//    console.log('Error deleting previous image', err)
//  }
//}

//export async function uploadtoS3(img: any) {
//  const formData = new FormData()

//  formData.append('files', img)
//  formData.append('upload_preset', presetKey)

//  const [cookieValue] = useCookie('uni_user_token')

//  try {
//    const response: any = await client('/upload', {
//      method: 'POST',
//      headers: { Authorization: `Bearer ${cookieValue}` },
//      data: formData,
//    })
//    console.log(response)
//    if (response.success) {
//      const imageUrl = response.data.imageUrl
//      const publicId = response.data.key
//      return { imageUrl: imageUrl, publicId: publicId }
//    }
//  } catch (err) {
//    console.log('Error uploading new image', err)
//  }
//}

//export async function uploadNewImage(img: any) {
//  const formData = new FormData()
//  formData.append('file', img)
//  formData.append('upload_preset', presetKey)

//  try {
//    const res: AxiosResponse<CloudinaryResponse, any> = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData)
//    if (res?.data?.secure_url) {
//      const imageUrl = res.data.secure_url
//      const publicId = res.data.public_id
//      return { imageUrl: imageUrl, publicId: publicId }
//    }
//  } catch (err) {
//    console.log('Error uploading new image', err)
//  }
//}

//export async function replaceImage(img: any, previousImagePublicId: any) {
//  //  if (previousImagePublicId) {
//  //    await deletePreviousImage(previousImagePublicId)
//  //  }
//  const data = await uploadNewImage(img)
//  //  const data = await uploadtoS3(img)
//  return data
//}
