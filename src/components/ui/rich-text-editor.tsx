"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const ToolbarButton = ({ 
  onClick, 
  isActive, 
  children 
}: { 
  onClick: () => void; 
  isActive: boolean; 
  children: React.ReactNode 
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "p-2 hover:bg-primary hover:text-primary-foreground transition-colors border-r border-primary last:border-r-0",
      isActive ? "bg-primary text-primary-foreground" : "bg-card text-primary"
    )}
  >
    {children}
  </button>
);

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base focus:outline-none min-h-[120px] px-4 py-3 font-poppins",
          className
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      if (editor.isEmpty && value) {
         editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-primary flex flex-col w-full bg-card rounded-none">
      <div className="flex border-b border-primary bg-secondary/50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} className="flex-1" />
    </div>
  );
}
