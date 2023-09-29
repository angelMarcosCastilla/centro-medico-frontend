import ReportStatusTable from '../../components/ReportStatusTable'
import { LABORATORIO_ID } from '../../constants/areas'
import { getInProcessReportAttentionsByArea } from '../../services/admission'

export default function Informes() {
  return (
    <ReportStatusTable
      useFetcherFunction={() =>
        getInProcessReportAttentionsByArea(LABORATORIO_ID)
      }
    />
  )
}
