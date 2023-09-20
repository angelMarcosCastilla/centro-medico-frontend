export function validateFieldsFormAdmision(data, isConvenio = false){
  const validateKeys = [  "detalleAtencion", "detallePago", "idcliente", "idpaciente", "pagoData"  ]

  const isValidated = validateKeys.every(key => {
    if(key === "idcliente") return data[key]?.length >=2 
    if(key === "detallePago" && isConvenio) return true
    if(key === "detallePago" || key === "detalleAtencion") return data[key]?.length >=1
    return data[key]
  })
  return isValidated
}