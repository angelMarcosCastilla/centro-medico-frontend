export function validateColumnTemplate(columnTemplate) {
  if (columnTemplate.templateName === '') {
    return false
  }

  for (const section of columnTemplate.sections) {
    if (section.title === '') {
      return false
    }

    for (const row of section.rows) {
      if (
        row.analisis === '' ||
        row.unidad === '' ||
        row.rangoReferencial === ''
      ) {
        return false
      }
    }
  }

  return true
}

export function validateKeyValueTemplate(keyValueTemplate) {
  if (keyValueTemplate.templateName === '') {
    return false
  }

  for (const section of keyValueTemplate.sections) {
    if (section.title === '') {
      return false
    }

    for (const item of section.items) {
      if (item.key === '') {
        return false
      }
    }
  }

  return true
}
