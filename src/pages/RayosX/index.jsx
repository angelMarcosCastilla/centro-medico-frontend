import AttentionProcessTable from '../../components/AttentionProcessTable'
import { RAYOSX_ID } from '../../constants/areas'
import { getInProcessAttentionsByArea } from '../../services/admission'

export default function Rayosx() {
  return (
    <AttentionProcessTable
      useFecherFunction={() => getInProcessAttentionsByArea(RAYOSX_ID)}
    />
  )
}
