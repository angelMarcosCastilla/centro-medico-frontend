import PaymentsAgreementTable from "../../../components/PaymentsAgreementTable";
import { getListofPaymentsbyAgreement } from "../../../services/service";

export default  function Pagos(){
    return(
        <PaymentsAgreementTable
        useFecherFunction={()=> getListofPaymentsbyAgreement()}/>
    )
}