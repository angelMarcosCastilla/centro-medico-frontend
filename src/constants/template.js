export const tableBaseTemplate = {
  typeTemplate: 'table',
  columns: [
    {
      uid: 'analisis',
      title: 'ANÁLISIS',
      readOnly: true
    },
    {
      uid: 'resultado',
      title: 'RESULTADO',
      readOnly: false
    },
    {
      uid: 'unidad',
      title: 'UNIDAD',
      readOnly: true
    },
    {
      uid: 'rangoReferencial',
      title: 'RANGO REFERENCIAL',
      readOnly: true
    },
    {
      uid: 'acciones',
      title: 'ACCIONES',
      readOnly: true
    }
  ],
  rows: []
}

export const template2 = {
  typeTemplate: 'tableWithoutHeader'
}
