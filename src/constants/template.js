export const columnTemplate = {
  templateName: 'My Column Template',
  type: 'fourColumns',
  sections: [
    {
      uid: 'section1',
      title: 'Section 1',
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
          analisis: 'Hola Mundo',
          resultado: 'Aqui estoy',
          unidad: 'Probando',
          rangoReferencial: 'Esto'
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
      uid: 'section1',
      title: 'Section 1',
      items: [
        {
          key: 'key 1',
          value: 'value 1'
        }
      ]
    }
  ]
}

export const templateFormats = [
  { label: 'Columnas', value: 'fourColumns' },
  { label: 'Claves y valores', value: 'keysValues' }
]
