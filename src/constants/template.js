export  const tableBaseTemplate = {
  typeTemplate: 'table',
  columns: [
    {
      uid: 'analisis',
      title: 'ANALISIS',
      isReadOnly: true,
    },
    {
      title: 'RESULTADO',
      isReadOnly: false,
      uid: 'resultado',
    },
    {
      title: 'UNIDAD',
      isReadOnly: true,
      uid: 'unidad',
    },{
      title: 'RANGO REFERENCIAL',
      isReadOnly: true,
      uid: 'rangoReferencial',
    }

  ],
  row: {},
}
