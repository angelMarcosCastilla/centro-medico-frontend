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

export const columnTemplate = {
  templateName: 'My Column Template',
  type: 'fourColumns',
  sections: [
    {
      uid: 'section1',
      title: 'Section 1',
      columns: [
        { uid: 'column1', title: 'Column 1', editable: false },
        { uid: 'column2', title: 'Column 2', editable: true },
        { uid: 'column3', title: 'Column 3', editable: false },
        { uid: 'column4', title: 'Column 4', editable: false }
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
          key: { text: 'Key 1', editable: false },
          value: { text: 'Value 1', editable: true }
        },
        {
          key: { text: 'Key 2', editable: false },
          value: { text: 'Value 2', editable: true }
        }
      ]
    }
  ]
}
