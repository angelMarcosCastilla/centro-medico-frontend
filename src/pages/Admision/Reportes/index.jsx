import ReportSendTable from '../../../components/ReportSendTable'
import { getListStatePE } from '../../../services/service'

export default function Reportes() {
    return(
        <ReportSendTable
        useFecherFunction={()=>getListStatePE()}/>        
    )
  
}
