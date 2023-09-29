import AttentionProcessTable from '../../components/AttentionProcessTable'
import { TOMOGRAFIA_ID } from '../../constants/areas'
import { getInProcessAttentionsByArea } from '../../services/admission'

export default function Tomografia() {
  return (
    <AttentionProcessTable
      useFecherFunction={() => getInProcessAttentionsByArea(TOMOGRAFIA_ID)}
    />
  )
}
