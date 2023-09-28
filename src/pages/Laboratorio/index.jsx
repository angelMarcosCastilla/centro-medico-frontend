import AttentionProcessTable from '../../components/AttentionProcessTable'
import { getInProcessAttentionsByLaboratory } from '../../services/detalleAtencion'

export default function Laboratorio() {
  return (
    <AttentionProcessTable
      useFecherFunction={getInProcessAttentionsByLaboratory}
    />
  )
}
