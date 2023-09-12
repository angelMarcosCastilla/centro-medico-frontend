import { Button } from '@nextui-org/react'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Heading from '@tiptap/extension-heading'
import Underline from '@tiptap/extension-underline'
import { EditorContent, mergeAttributes, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  RedoDot,
  Strikethrough,
  UnderlineIcon,
  UndoDot
} from 'lucide-react'
import React from 'react'

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }
  return (
    <div className='flex gap-x-2 mb-2'>
      <Button
        variant={editor.isActive('bold') ? 'flat' : 'light'}
        color='primary'
        isIconOnly
        size='sm'
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      >
        <Bold className='h-5 w-5' />
      </Button>
      <Button
        variant={editor.isActive('italic') ? 'flat' : 'light'}
        color='primary'
        isIconOnly
        size='sm'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
      >
        <Italic className='h-5 w-5' />
      </Button>
      <Button
        variant={editor.isActive('underline') ? 'flat' : 'light'}
        color='primary'
        isIconOnly
        size='sm'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className='h-5 w-5' />
      </Button>
      <Button
        variant={editor.isActive('strike') ? 'flat' : 'light'}
        color='primary'
        isIconOnly
        size='sm'
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
      >
        <Strikethrough className='h-5 w-5' />
      </Button>

      <Button
        variant={editor.isActive('paragraph') ? 'flat' : 'light'}
        color='primary'
        isIconOnly
        size='sm'
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <Pilcrow className='h-5 w-5' />
      </Button>
      <Button
        variant={editor.isActive('heading', { level: 1 }) ? 'flat' : 'light'}
        color='primary'
        isIconOnly
        size='sm'
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 className='h-5 w-5' />
      </Button>
      <Button
        variant={editor.isActive('heading', { level: 2 }) ? 'flat' : 'light'}
        color='primary'
        isIconOnly
        size='sm'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className='h-5 w-5' />
      </Button>
      <Button
        variant={editor.isActive('heading', { level: 3 }) ? 'flat' : 'light'}
        color='primary'
        isIconOnly
        size='sm'
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className='h-5 w-5' />
      </Button>

      <Button
        variant={editor.isActive('bulletList') ? 'flat' : 'light'}
        color='primary'
        isIconOnly
        size='sm'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className='h-5 w-5' />
      </Button>
      <Button
        variant={editor.isActive('orderedList') ? 'flat' : 'light'}
        color='primary'
        isIconOnly
        size='sm'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className='h-5 w-5' />
      </Button>

      <Button
        variant='light'
        color='primary'
        isIconOnly
        size='sm'
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <UndoDot className='h-5 w-5' />
      </Button>
      <Button
        variant='light'
        color='primary'
        isIconOnly
        size='sm'
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <RedoDot className='h-5 w-5' />
      </Button>
    </div>
  )
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        style: 'list-style-type: disc; margin-left: 10px;'
      },
      keepMarks: true,
      keepAttributes: false
    },
    orderedList: {
      HTMLAttributes: {
        style: 'list-style-type: decimal; margin-left: 10px;'
      },
      keepMarks: true,
      keepAttributes: false
    }
  }),
  Heading.extend({
    levels: [1, 2, 3],
    renderHTML({ node, HTMLAttributes }) {
      const level = this.options.levels.includes(node.attrs.level)
        ? node.attrs.level
        : this.options.levels[0]
      const sizes = {
        1: 'font-size: 36px',
        2: 'font-size: 28px',
        3: 'font-size: 20px'
      }
      return [
        `h${level}`,
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
          style: `${sizes[level]}; text-transform: uppercase;`
        }),
        0
      ]
    }
  }).configure({ levels: [1, 2, 3] }),
  Underline.configure({
    HTMLAttributes: {
      style: 'text-decoration: underline'
    }
  })
]

export default function Editor({ content = '' }) {
  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: 'outline-none h-[400px] border border-gray-200 p-4'
      }
    }
  })

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <Button
        className='mt-4'
        onClick={() => {
          console.log(editor.getHTML())
        }}
      >
        Enviar Informe
      </Button>
    </div>
  )
}
