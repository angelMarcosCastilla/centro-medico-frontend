import AttentionProcessTable from '../../components/AttentionProcessTable'
import { LABORATORIO_ID } from '../../constants/areas'
import { getInProcessAttentionsByArea } from '../../services/admission'

export default function Laboratorio() {
  return (
    <AttentionProcessTable useFecherFunction={() => getInProcessAttentionsByArea(LABORATORIO_ID)} />
  )
}
