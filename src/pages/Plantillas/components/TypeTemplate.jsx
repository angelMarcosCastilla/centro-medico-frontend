import ColumnTemplate from './ColumnTemplate'
import KeyValueTemplate from './KeyValueTemplate'

export default function TypeTemplate({
  typeTemplate,
  sections,
  onInputChange,
  onInputChangeKeyValue,
  onSectionChange,
  onAddRow,
  onRemoveRow,
  onAddItem,
  onRemoveItem,
  onRemoveSection
}) {
  let content

  switch (typeTemplate) {
    case 'fourColumns':
      content = (
        <>
          {sections.map((section) => (
            <ColumnTemplate
              key={section.uid}
              section={section}
              onInputChange={onInputChange}
              onSectionChange={onSectionChange}
              onAddRow={onAddRow}
              onRemoveRow={onRemoveRow}
              onRemoveSection={onRemoveSection}
            />
          ))}
        </>
      )
      break
    case 'keysValues':
      content = (
        <>
          {sections.map((section) => (
            <KeyValueTemplate
              key={section.uid}
              section={section}
              onInputChange={onInputChangeKeyValue}
              onSectionChange={onSectionChange}
              onAddItem={onAddItem}
              onRemoveItem={onRemoveItem}
              onRemoveSection={onRemoveSection}
            />
          ))}
        </>
      )
      break
  }

  return content
}
