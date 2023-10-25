import AttentionProcessTable from '../../components/AttentionProcessTable'
import { RAYOSX_ID } from '../../constants/areas'
import { getInProcessAttentionsByArea } from '../../services/admission'
import { getDoctorByAreaFunction } from '../../services/person'

export default function Rayosx() {
  return (
    <AttentionProcessTable
      nameArea='Rayos X'
      useFecherFunction={() => getInProcessAttentionsByArea(RAYOSX_ID)}
      getDoctorByAreaFunction={() => getDoctorByAreaFunction(RAYOSX_ID)}
    />
  )
}
