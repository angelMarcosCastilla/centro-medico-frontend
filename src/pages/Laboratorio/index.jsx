import AttentionProcessTable from '../../components/AttentionProcessTable'
import { LABORATORIO_ID } from '../../constants/areas'
import { getInProcessAttentionsByArea } from '../../services/admission'
import { getDoctorsByArea } from '../../services/medicalStaff'

export default function Laboratorio() {
  return (
    <AttentionProcessTable
      nameArea='Laboratorio'
      useFecherFunction={() => getInProcessAttentionsByArea(LABORATORIO_ID)}
      getDoctorByAreaFunction={() => getDoctorsByArea(LABORATORIO_ID)}
    />
  )
}
