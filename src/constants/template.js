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
      rows: [] // Array of arrays
    }
  ]
}

export const keyValueTemplate = {
  templateName: 'My KeyValue Template',
  type: 'keyValues',
  sections: [
    {
      uid: 'section1',
      title: 'Section 1',
      items: [
        {
          key: 'key 1',
          value: 'value 1'
        },
        {
          key: 'key 2',
          value: 'value 2'
        }
      ]
    }
  ]
}
