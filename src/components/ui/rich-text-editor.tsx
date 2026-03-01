"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Heading1,
  Heading2,
  Pilcrow,
  Quote,
  Code2,
  Minus,
  Undo2,
  Redo2,
  Eraser,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  toolbar?: "basic" | "advanced";
}

const ToolbarButton = ({
  onClick,
  isActive,
  title,
  disabled = false,
  children,
}: {
  onClick: () => void;
  isActive: boolean;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
    className={cn(
      "inline-flex h-9 w-9 items-center justify-center border-r border-input text-muted-foreground transition-colors last:border-r-0",
      isActive
        ? "bg-primary text-primary-foreground"
        : "bg-transparent hover:bg-muted hover:text-foreground",
      disabled && "pointer-events-none opacity-40"
    )}
  >
    {children}
  </button>
);

const ToolbarDivider = () => <div className="h-9 w-px bg-border" />;

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
  toolbar = "basic",
}: RichTextEditorProps) {
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
          "prose prose-sm max-w-none px-4 py-3 font-poppins leading-relaxed focus:outline-none min-h-[140px] [&_h1]:mb-2 [&_h1]:mt-4 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-base [&_h2]:font-semibold [&_ol]:my-2 [&_ol]:pl-5 [&_ul]:my-2 [&_ul]:pl-5 [&_li]:my-0.5 [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_p]:my-1",
          className
        ),
        "data-placeholder": placeholder || "",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      if (editor.isEmpty && value) {
        editor.commands.setContent(value, { emitUpdate: false });
      }
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg border border-input bg-card">
      <div className="flex flex-wrap border-b border-input bg-muted/20">
        {toolbar === "advanced" ? (
          <>
            <ToolbarButton
              title="Paragraph"
              onClick={() => editor.chain().focus().setParagraph().run()}
              isActive={editor.isActive("paragraph")}
            >
              <Pilcrow className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Heading 1"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive("heading", { level: 1 })}
            >
              <Heading1 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Heading 2"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive("heading", { level: 2 })}
            >
              <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarDivider />
            <ToolbarButton
              title="Bold"
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Italic"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Strike"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarDivider />
            <ToolbarButton
              title="Bulleted List"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Numbered List"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Blockquote"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
            >
              <Quote className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Code Block"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive("codeBlock")}
            >
              <Code2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Horizontal Rule"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              isActive={false}
            >
              <Minus className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarDivider />
            <ToolbarButton
              title="Clear Formatting"
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
              isActive={false}
            >
              <Eraser className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Undo"
              onClick={() => editor.chain().focus().undo().run()}
              isActive={false}
              disabled={!editor.can().chain().focus().undo().run()}
            >
              <Undo2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Redo"
              onClick={() => editor.chain().focus().redo().run()}
              isActive={false}
              disabled={!editor.can().chain().focus().redo().run()}
            >
              <Redo2 className="h-4 w-4" />
            </ToolbarButton>
          </>
        ) : (
          <>
            <ToolbarButton
              title="Bold"
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Italic"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Bulleted List"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              title="Numbered List"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
          </>
        )}
      </div>
      <EditorContent editor={editor} className="flex-1" />
    </div>
  );
}
