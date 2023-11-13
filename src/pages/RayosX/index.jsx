import AttentionProcessTable from '../../components/AttentionProcessTable'
import { RAYOSX_ID } from '../../constants/areas'
import { getInProcessAttentionsByArea } from '../../services/admission'
import { getDoctorsByArea } from '../../services/medicalStaff'

export default function Rayosx() {
  return (
    <AttentionProcessTable
      nameArea='Rayos X'
      useFecherFunction={() => getInProcessAttentionsByArea(RAYOSX_ID)}
      getDoctorByAreaFunction={() => getDoctorsByArea(RAYOSX_ID)}
    />
  )
}
