import { useCallback, useEffect, useMemo, useState } from 'react'

export const usePagination = (data, rowsPage = 15) => {
  const [rowsPerPage, setRowsPerPage] = useState(rowsPage)
  const [page, setPage] = useState(1)

  const pages = Math.ceil(data.length / rowsPerPage) || 1

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return data.slice(start, end)
  }, [page, data, rowsPerPage])

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1)
    }
  }, [page, pages])

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
  }, [page])

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }, [])

  useEffect(() => {
    setPage(1)
  }, [data])
  
  return {
    items,
    page,
    pages,
    rowsPerPage,
    onNextPage,
    onPreviousPage,
    onRowsPerPageChange,
    setPage
  }
}
