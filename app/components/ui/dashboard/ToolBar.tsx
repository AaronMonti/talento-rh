"use client"

import { type Editor } from "@tiptap/react"
import {
    Bold,
    Strikethrough,
    Italic,
    List,
    ListOrdered,
    Heading2
} from "lucide-react"
import { div } from "motion/react-client"
import { Toggle } from "radix-ui"
type Props = {
    editor: Editor | null
}

export function ToolBar({ editor }: Props) {
    if (!editor) return null

    return (
        <div className="border border-input bg-transparent rounded-sm">
            <Toggle.Root
                pressed={editor.isActive("heading")}
                onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
            >
                <Heading2 className="w-4 h-4" />
            </Toggle.Root>
            <Toggle.Root
                pressed={editor.isActive("bold")}
                onPressedChange={() =>
                    editor.chain().focus().toggleBold().run()
                }
            >
                <Bold className="w-4 h-4" />
            </Toggle.Root>
            <Toggle.Root
                pressed={editor.isActive("italic")}
                onPressedChange={() =>
                    editor.chain().focus().toggleItalic().run()
                }
            >
                <Italic className="w-4 h-4" />
            </Toggle.Root>
            <Toggle.Root
                pressed={editor.isActive("strike")}
                onPressedChange={() =>
                    editor.chain().focus().toggleStrike().run()
                }
            >
                <Strikethrough className="w-4 h-4" />
            </Toggle.Root>
            <Toggle.Root
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                    editor.chain().focus().toggleBulletList().run()
                }
            >
                <List className="w-4 h-4" />
            </Toggle.Root>
            <Toggle.Root
                pressed={editor.isActive("orderedList")}
                onPressedChange={() =>
                    editor.chain().focus().toggleOrderedList().run()
                }
            >
                <ListOrdered className="w-4 h-4" />
            </Toggle.Root>
        </div>
    )
}
