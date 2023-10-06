import { useEffect, useState } from 'react'

export const useFetcher = (callback) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      const response = await callback()
      setData(response)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    await fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, mutate: setData, refresh: refreshData }
}
