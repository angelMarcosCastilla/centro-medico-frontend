import AttentionProcessTable from '../../components/AttentionProcessTable'
import { TOMOGRAFIA_ID } from '../../constants/areas'
import { getInProcessAttentionsByArea } from '../../services/admission'
import { getDoctorByAreaFunction } from '../../services/person'

export default function Tomografia() {
  return (
    <AttentionProcessTable
      useFecherFunction={() => getInProcessAttentionsByArea(TOMOGRAFIA_ID)}
      getDoctorByAreaFunction={() => getDoctorByAreaFunction(TOMOGRAFIA_ID)}
    />
  )
}
