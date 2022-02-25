import { convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const Editor = dynamic(
  () => {
    return import('react-draft-wysiwyg').then((mod) => mod.Editor)
  },
  { ssr: false }
)

export default function Report() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  let doc = draftToHtml(convertToRaw(editorState.getCurrentContent()))
  const handleEdit = (e) => {
    setEditorState(e)
  }
  return (
    <div className='max-w-7xl'>
      <p>Report</p>
      <div className='flex justify-center'>
        <div className='w-[40%]'>
          <h1>Preview</h1>
          <div dangerouslySetInnerHTML={{ __html: doc }} />
        </div>

        <div>
          <h1>Draft Editor</h1>
          <Editor
            editorState={editorState}
            toolbarClassName='border-yellow-400 border-dashed '
            wrapperClassName='border-red-400 border-dashed p-5'
            editorClassName='bg-gray-50 px-3 border-gray-500 shadow-sm shadow-gray-400'
            onEditorStateChange={handleEdit}
          />
        </div>
      </div>
    </div>
  )
}
