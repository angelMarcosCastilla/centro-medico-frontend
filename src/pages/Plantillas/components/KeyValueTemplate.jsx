import { Button, Input, Tooltip } from '@nextui-org/react'
import { ChevronsRight, ListX, Plus, Trash2 } from 'lucide-react'

export default function KeyValueTemplate({
  section,
  onInputChange,
  onSectionChange,
  onAddItem,
  onRemoveItem,
  onRemoveSection
}) {
  return (
    <>
      <div className='grid grid-cols-4 px-4 gap-4 mb-4 items-end'>
        <Input
          label='Nombre de la sección'
          color='primary'
          variant='underlined'
          value={section.title}
          onChange={(e) => onSectionChange(section.uid, e.target.value)}
        />
        <Tooltip
          content='Eliminar sección'
          color='danger'
          placement='right'
          closeDelay={0}
        >
          <Button
            isIconOnly
            color='danger'
            variant='light'
            onPress={() => onRemoveSection(section.uid)}
          >
            <ListX size={20} />
          </Button>
        </Tooltip>
      </div>
      <div className='grid grid-cols-2 px-4 gap-4 mb-4'>
        {section.items.map((item) => (
          <div className='flex col-span-1 gap-4' key={item.uid}>
            <Input
              value={item.key}
              color='primary'
              variant='bordered'
              onChange={(e) =>
                onInputChange(section.uid, item.uid, 'key', e.target.value)
              }
            />
            <Button isIconOnly color='primary' variant='faded' disabled>
              <ChevronsRight size={20} />
            </Button>
            <Input
              color='primary'
              variant='bordered'
              value={item.value}
              onChange={(e) =>
                onInputChange(section.uid, item.uid, 'value', e.target.value)
              }
            />
            <div className='flex items-center'>
              <Tooltip content='Eliminar fila' color='danger' closeDelay={0}>
                <span
                  className='text-danger cursor-pointer active:opacity-50'
                  onClick={() => onRemoveItem(section.uid, item.uid)}
                >
                  <Trash2 size={20} />
                </span>
              </Tooltip>
            </div>
          </div>
        ))}
        <Button
          className='w-full'
          color='primary'
          radius='full'
          variant='light'
          startContent={<Plus size={20} />}
          onPress={() => onAddItem(section.uid)}
        >
          Agregar nuevo clave-valor
        </Button>
      </div>
    </>
  )
}
