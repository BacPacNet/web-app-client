export type UniversityInfo = {
  collegeBoardInfo: {
    name: string
    Location: string
    Phone: string | null
    Website: string | null
  }
  topUniInfo: {
    about: string
  }
  _id: string
  name: string
  country: string
  logos: string[]
  images: string[]
  about: string
  isCommunityCreated: boolean
  wikiInfoBox: {
    Motto: string
    Type: string
    Established: string
    Affiliation: string
    President: string
    Location: string
    Campus: string
    Colours: string
    Website: string
  }
  pathUrl: string
  __v: number
}
