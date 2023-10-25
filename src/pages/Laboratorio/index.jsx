import AttentionProcessTable from '../../components/AttentionProcessTable'
import { LABORATORIO_ID } from '../../constants/areas'
import { getInProcessAttentionsByArea } from '../../services/admission'
import { getDoctorByAreaFunction } from '../../services/person'

export default function Laboratorio() {
  return (
    <AttentionProcessTable
      nameArea='Laboratorio'
      useFecherFunction={() => getInProcessAttentionsByArea(LABORATORIO_ID)}
      getDoctorByAreaFunction={() => getDoctorByAreaFunction(LABORATORIO_ID)}
    />
  )
}
