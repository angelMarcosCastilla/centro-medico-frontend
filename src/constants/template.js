export const columnTemplate = {
  templateName: 'My Column Template',
  type: 'fourColumns',
  sections: [
    {
      uid: Date.now().toString(),
      title: 'Sección 1',
      columns: [
        {
          uid: 'analisis',
          title: 'ANÁLISIS',
          editable: false
        },
        {
          uid: 'resultado',
          title: 'RESULTADO',
          editable: true
        },
        {
          uid: 'unidad',
          title: 'UNIDAD',
          editable: false
        },
        {
          uid: 'rangoReferencial',
          title: 'RANGO REFERENCIAL',
          editable: false
        },
        {
          uid: 'acciones',
          title: 'ACCIONES',
          editable: false
        }
      ],
      rows: [
        {
          uid: Date.now().toString(),
          analisis: '',
          resultado: '',
          unidad: '',
          rangoReferencial: ''
        }
      ]
    }
  ]
}

export const keyValueTemplate = {
  templateName: 'My KeyValue Template',
  type: 'keysValues',
  sections: [
    {
      uid: Date.now().toString(),
      title: 'Sección 1',
      items: [
        {
          uid: Date.now().toString(),
          key: '',
          value: ''
        }
      ]
    }
  ]
}

export const templateFormats = [
  { label: 'Columnas', value: 'fourColumns' },
  { label: 'Claves y valores', value: 'keysValues' }
]
