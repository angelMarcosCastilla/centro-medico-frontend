import AttentionProcessTable from '../../components/AttentionProcessTable'
import { TOMOGRAFIA_ID } from '../../constants/areas'
import { getInProcessAttentionsByArea } from '../../services/admission'
import { getDoctorsByArea } from '../../services/medicalStaff'

export default function Tomografia() {
  return (
    <AttentionProcessTable
      nameArea='Tomografía'
      useFecherFunction={() => getInProcessAttentionsByArea(TOMOGRAFIA_ID)}
      getDoctorByAreaFunction={() => getDoctorsByArea(TOMOGRAFIA_ID)}
    />
  )
}
