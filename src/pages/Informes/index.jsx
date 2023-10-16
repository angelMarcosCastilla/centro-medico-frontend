import ReportSendTable from '../../components/ReportSendTable'
import { getInProcessReportsPendingAndFinished } from '../../services/admission'

export default function Informes() {
  return (
    <ReportSendTable
      useFecherFunction={() => getInProcessReportsPendingAndFinished()}
    />
  )
}
