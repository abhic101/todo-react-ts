import { useEditor, EditorContent } from '@tiptap/react';
import { useController } from 'react-hook-form';
import {BulletList, ListItem, OrderedList } from '@tiptap/extension-list';
import Paragraph from '@tiptap/extension-paragraph';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import { Placeholder } from '@tiptap/extensions'
import styles from './RichTextEditor.module.css'
import type { TodoTask } from '../todolist/todolist.data';

interface Props {
  control: any;
  name: any;
  rules: any;
  task?: TodoTask;
}

function TipTap({control, name, rules, task}: Props) {
    const {
      field: { value, onChange },
      fieldState: { error }
    } = useController({name, control, rules, defaultValue: (task ? task.task_details ? task.task_details : '' : '')});
    const editor = useEditor({
        extensions: [Document, Paragraph, Text, BulletList, OrderedList, ListItem, Placeholder.configure({
          placeholder: 'Enter task Details'
        })],
        content: (task ? task.task_details ? task.task_details : '' : ''),
        onUpdate: ({ editor }) => {
          onChange(editor.getHTML());
        }
    });

    return (
        <div className={styles['rte-root']}>
          <EditorContent className={styles.editor} editor={editor} />
          {error && <p>{error.message}</p>}
        </div>
    )
}

export default TipTap;