export const createQueryParams = (paramsObj) => {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(paramsObj)) {
    params.append(key, value)
  }

  return `?${params.toString()}`
}

