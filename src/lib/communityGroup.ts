export const filterData = (data: any[], selectedFilters: any) => {
  const { year: selectedYears, major: selectedMajors } = selectedFilters

  if ((!selectedYears || selectedYears.length === 0) && (!selectedMajors || selectedMajors.length === 0)) {
    return []
  }

  return data?.filter((item) => {
    const matchesYear = selectedYears ? item.year == selectedYears[0] : true

    const matchesMajor = selectedMajors?.length ? selectedMajors.includes(item.major) : true

    if (selectedYears?.length) {
      return matchesYear && matchesMajor
    } else if (selectedMajors?.length) {
      return matchesMajor
    }

    return true
  })
}

export const filterFacultyData = (data: any[], selectedFilters: any) => {
  const { occupation, affiliation } = selectedFilters
  if ((!occupation || occupation.length === 0) && (!affiliation || affiliation.length === 0)) {
    return []
  }
  return data?.filter((item) => {
    const matchesOccupation = occupation ? item.occupation === occupation[0] : true
    const matchesAffiliation = affiliation?.length ? affiliation.includes(item.affiliation) : true
    if (occupation) {
      return matchesOccupation && matchesAffiliation
    } else if (affiliation?.length) {
      return matchesAffiliation
    }

    return true
  })
}

export const getFilteredYearCounts = (filteredData: any[]) => {
  return filteredData?.reduce((acc: Record<string, number>, curr) => {
    const year = curr.year?.trim()
    if (year) {
      acc[year] = (acc[year] || 0) + 1
    }
    return acc
  }, {})
}

export const getFilteredMajorCounts = (filteredData: any[]) => {
  return filteredData?.reduce((acc: Record<string, number>, curr) => {
    const major = curr.major?.trim()
    if (major) {
      acc[major] = (acc[major] || 0) + 1
    }
    return acc
  }, {})
}

export const getOccupationCounts = (filteredData: any[]) => {
  return filteredData?.reduce((acc: Record<string, number>, curr) => {
    const occupation = curr.occupation?.trim()
    if (occupation) {
      acc[occupation] = (acc[occupation] || 0) + 1
    }
    return acc
  }, {})
}

export const getFilteredAffiliationCounts = (filteredData: any[]) => {
  return filteredData?.reduce((acc: Record<string, number>, curr) => {
    const affiliation = curr.affiliation?.trim()
    if (affiliation) {
      acc[affiliation] = (acc[affiliation] || 0) + 1
    }
    return acc
  }, {})
}

export const getUniqueById = (arr: any[]) => {
  const seen = new Map()
  arr.forEach((item) => {
    if (!seen.has(item._id)) {
      seen.set(item._id, item)
    }
  })
  return Array.from(seen.values())
}
