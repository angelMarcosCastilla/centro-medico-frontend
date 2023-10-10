import ReportSendTable from '../../../components/ReportSendTable'
import { getInProcessReportsPendingAndFinished } from '../../../services/admission'

export default function Reportes() {
  return (
    <ReportSendTable
      useFecherFunction={() => getInProcessReportsPendingAndFinished()}
    />
  )
}
