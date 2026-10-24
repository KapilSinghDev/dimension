"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import ToolbarButton from "./Toolbarbutton";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Heading1,
  LinkIcon,
  ImageIcon,
  Quote,
  Code,
  Undo,
  Redo,
} from "lucide-react";
import { File } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useCreateResource } from "@/hooks/apihooks";
import { UpdateResourcePayload } from "@/lib/types";
const Tiptap = () => {
  const createIssue = useCreateResource();
  const [resourcePayload, setResourcePayload] = useState<UpdateResourcePayload>(
    () => ({
      resource_content: "",
      resource_name: "",
      resource_image: null,
    }),
  );

  const isFirstRender = useRef(true);
  const resourceId = useRef<string | null>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const isEmpty =
      !resourcePayload.resource_content?.replace(/<[^>]*>/g, "").trim() &&
      !resourcePayload.resource_name?.trim() &&
      !resourcePayload.resource_image;
    if (isEmpty) return;

    const timer = setTimeout(() => {
      const payload = {
        ...resourcePayload,
        resource_name: resourcePayload.resource_name || "Untitled",
      };

      if (!resourceId.current) {
        createIssue.mutate({ payload });
      } else {
        // updateResource.mutate({ id: resourceId.current, payload });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [resourcePayload]);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-md max-w-full",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
    ],
    content: resourcePayload.resource_content || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setResourcePayload((prev) => ({
        ...prev,
        resource_content: editor.getHTML(),
      }));
    },
    editorProps: {
      attributes: {
        class:
          "tiptap prose prose-sm focus:outline-none min-h-32 max-w-none p-3",
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const handleSave = () => {
    const html = editor.getHTML();

    const payload = {
      ...resourcePayload,
      resource_content: html,
    };

    setResourcePayload(payload);
    createIssue.mutate({ payload });
  };
  return (
    <div className="mt-2 rounded-sm w-full p-10">
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center gap-3">
          <File size={20} className="text-muted-foreground" />
          <Textarea
            placeholder="Untitled"
            className="min-h-0 w-full resize-none border-0 bg-transparent p-0 text-[24px] font-light leading-tight tracking-tight text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none md:text-[36px]"
            rows={1}
            onBlur={(e) =>
              setResourcePayload((prev) => ({
                ...prev,
                ["resource_name"]: e.target.value,
              }))
            }
          />
        </div>
        <div className="pl-0">
          <EditorContent editor={editor} />
          <button onClick={handleSave}>save</button>
        </div>
      </div>
    </div>
  );
};

export default Tiptap;
