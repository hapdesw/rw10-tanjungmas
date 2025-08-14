"use client";

import * as React from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image as TiptapImage } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Placeholder } from "@tiptap/extension-placeholder";

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover";
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/tiptap-icons/link-icon";

// --- Hooks ---
import { useIsMobile } from "@/hooks/use-mobile";
import { useWindowSize } from "@/hooks/use-window-size";
import { useCursorVisibility } from "@/hooks/use-cursor-visibility";

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile
}) => {
  return (
    <>
      <Spacer />
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} portal={isMobile} />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ImageUploadButton text="Add" />
      </ToolbarGroup>
      <Spacer />
      {isMobile && <ToolbarSeparator />}
      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  );
}

const MobileToolbarContent = ({
  type,
  onBack
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export function SimpleEditor({ userId, lembagaId, initialData = {}, articleId }) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = React.useState("main");
  const [title, setTitle] = React.useState(initialData?.title || "");
  const [featuredImage, setFeaturedImage] = React.useState(null);
  const [previewImage, setPreviewImage] = React.useState(initialData?.gambar || null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);
  const [isEditorReady, setIsEditorReady] = React.useState(false);
  const toolbarRef = React.useRef(null);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      TiptapImage,
      Typography,
      Superscript,
      Subscript,
      Placeholder.configure({
        placeholder: 'Mulai menulis konten artikel Anda di sini...',
        emptyEditorClass: 'is-editor-empty',
      }),
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content: initialData?.isi || '<p></p>',
    onCreate: ({ editor }) => {
      setIsEditorReady(true);
    },
  });

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  // Handle initial content setting - only run once when editor is ready
  useEffect(() => {
    if (editor && isEditorReady && initialData.isi && !editor.isEmpty) {
      // Only set content if it's different from current content
      const currentContent = editor.getHTML();
      if (currentContent !== initialData.isi) {
        editor.commands.setContent(initialData.isi);
      }
    }
  }, [editor, isEditorReady, initialData.isi]);

  // Handle title updates
  useEffect(() => {
    if (initialData?.title && initialData.title !== title) {
      setTitle(initialData.title);
    }
  }, [initialData?.title]);

  // Handle image updates
  useEffect(() => {
    if (initialData?.gambar && initialData.gambar !== previewImage) {
      setPreviewImage(initialData.gambar);
    }
  }, [initialData?.gambar]);

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  // Clear error after 10 seconds
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Clear success message after 5 seconds
  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editor || !userId || !lembagaId) {
      setError('Missing required information. Please refresh and try again.');
      return;
    }

    if (!title?.trim()) {
      setError('Judul artikel harus diisi');
      return;
    }

    if (!editor.getText()?.trim()) {
      setError('Konten artikel harus diisi');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const content = editor.getHTML();
      const formData = new FormData();
      
      formData.append('id', articleId); // Pastikan ID dikirim
      formData.append('title', title.trim());
      formData.append('content', content);
      formData.append('currentImageUrl', previewImage || '');
      
      if (featuredImage) {
        formData.append('featuredImage', featuredImage);
      }

      const response = await fetch('/api/artikel/update', {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        alert('Artikel berhasil diperbarui!');
        setTimeout(() => {
          router.push('/admin/kelola-artikel');
        }, 2000);
      } else {
        throw new Error(result.error || 'Gagal memperbarui artikel');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Terjadi kesalahan saat memperbarui artikel');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeaturedImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi ukuran file (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Ukuran file terlalu besar. Maksimal 10MB.');
        return;
      }

      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        setError('File harus berupa gambar.');
        return;
      }

      setFeaturedImage(file);
      setError(null);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFeaturedImage(null);
    setPreviewImage(null);
    // Reset file input
    const fileInput = document.getElementById('featured-image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="simple-editor-wrapper">
      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="font-medium">Artikel berhasil disimpan! Redirecting...</p>
          </div>
        </div>
      )}

      {/* Input Judul */}
      <div className="mb-6">
        <label htmlFor="article-title" className="block text-sm font-medium text-gray-700 mb-2">
          Judul Artikel <span className="text-red-500">*</span>
        </label>
        <input
          id="article-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Masukkan judul artikel..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
          disabled={isLoading}
          required
        />
      </div>

      {/* Input Gambar Featured */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gambar Featured (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          {previewImage ? (
            <div className="relative">
              <img 
                src={previewImage} 
                alt="Preview" 
                className="max-h-64 mx-auto rounded-lg shadow-md"
              />
              <button
                type="button"
                onClick={removeImage}
                disabled={isLoading}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="mt-4">
                <input
                  type="file"
                  id="featured-image"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  className="hidden"
                  disabled={isLoading}
                />
                <label
                  htmlFor="featured-image"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                  </svg>
                  Ganti Gambar
                </label>
              </div>
            </div>
          ) : (
            <div>
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="mt-4">
                <input
                  type="file"
                  id="featured-image"
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  className="hidden"
                  disabled={isLoading}
                />
                <label
                  htmlFor="featured-image"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                  </svg>
                  Pilih Gambar
                </label>
              </div>
              <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF hingga 10MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Editor Konten */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Konten Artikel <span className="text-red-500">*</span>
        </label>
        <EditorContext.Provider value={{ editor }}>
          <Toolbar
            ref={toolbarRef}
            style={{
              ...(isMobile
                ? {
                    bottom: `calc(100% - ${height - rect.y}px)`,
                  }
                : {}),
            }}>
            {mobileView === "main" ? (
              <MainToolbarContent
                onHighlighterClick={() => setMobileView("highlighter")}
                onLinkClick={() => setMobileView("link")}
                isMobile={isMobile} />
            ) : (
              <MobileToolbarContent
                type={mobileView === "highlighter" ? "highlighter" : "link"}
                onBack={() => setMobileView("main")} />
            )}
          </Toolbar>

          <EditorContent editor={editor} role="presentation" className="simple-editor-content" />
        </EditorContext.Provider>
      </div>

      {/* Tombol Simpan */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!title.trim() || !editor?.getText().trim() || isLoading}
          className="px-6 py-3 bg-[#184D3B] text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium flex items-center gap-2"
        >
          {isLoading && (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  );
}