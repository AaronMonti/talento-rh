"use client"

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ToolBar } from "./ToolBar";

export default function TipTap({
    description,
    onChange,
}: {
    description: string;
    onChange: (richText: string) => void;
}) {
    const editor = useEditor({
        extensions: [StarterKit.configure()],
        content: description,
        editorProps: {
            attributes: {
                class: "rounded-sm border min-h-[150px] border-input bg-white"
            }
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML())
            console.log(editor.getHTML())
        }
    })

    return (
        <div>
            <ToolBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}