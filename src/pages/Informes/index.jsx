import ReportStatusTable from '../../components/ReportStatusTable'
import { getInProcessReportAttentionsByLaboratory } from '../../services/detalleAtencion'

export default function Informes() {
  return (
    <ReportStatusTable
      useFetcherFunction={getInProcessReportAttentionsByLaboratory}
    />
  )
}
