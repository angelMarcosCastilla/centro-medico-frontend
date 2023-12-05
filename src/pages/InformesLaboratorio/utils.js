export function validateFieldsFilled(template) {
  if (template.type === 'fourColumns') {
    for (const section of template.sections) {
      for (const row of section.rows) {
        if (row.resultado.trim() === '') {
          return false
        }
      }
    }
  } else if (template.type === 'keysValues') {
    for (const section of template.sections) {
      for (const item of section.items) {
        if (item.value.trim() === '') {
          return false
        }
      }
    }
  } else {
    console.error('Plantilla no compatible')
    return false
  }

  return true
}
