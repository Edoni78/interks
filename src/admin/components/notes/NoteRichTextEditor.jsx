import Placeholder from '@tiptap/extension-placeholder';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect } from 'react';
import {
  FaBold,
  FaCode,
  FaItalic,
  FaParagraph,
  FaListOl,
  FaListUl,
  FaQuoteRight,
  FaRedo,
  FaStrikethrough,
  FaUnderline,
  FaUndo,
} from 'react-icons/fa';
import './noteRichText.css';

/** Turn legacy plain-text bodies into HTML for TipTap. */
export function migrateBodyToEditorHtml(body) {
  const raw = (body || '').trim();
  if (!raw) return '<p></p>';
  if (raw.startsWith('<') && /<\/?[a-z][\s\S]*>/i.test(raw)) return raw;
  const escaped = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const parts = escaped.split(/\n{2,}/);
  const html = parts.map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`).join('');
  return html || '<p></p>';
}

function ToolbarBtn({ active, disabled, onMouseDown, title, children }) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown?.(e);
      }}
      className={`inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg border text-sm transition ${
        active
          ? 'border-accent/40 bg-accent-soft/80 text-ink'
          : 'border-transparent bg-transparent text-ink-muted hover:bg-subtle hover:text-ink'
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  );
}

function NoteEditorToolbar({ editor, t }) {
  const run = useCallback(
    (fn) => {
      if (!editor) return;
      fn(editor);
    },
    [editor],
  );

  if (!editor) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-1 border-b border-line bg-subtle/40 px-2 py-2"
      role="toolbar"
      aria-label={t('admin.dashboard.noteEditorToolbar')}
    >
      <ToolbarBtn
        title={t('admin.dashboard.noteTbBold')}
        active={editor.isActive('bold')}
        onMouseDown={() => run((ed) => ed.chain().focus().toggleBold().run())}
      >
        <FaBold aria-hidden />
      </ToolbarBtn>
      <ToolbarBtn
        title={t('admin.dashboard.noteTbItalic')}
        active={editor.isActive('italic')}
        onMouseDown={() => run((ed) => ed.chain().focus().toggleItalic().run())}
      >
        <FaItalic aria-hidden />
      </ToolbarBtn>
      <ToolbarBtn
        title={t('admin.dashboard.noteTbUnderline')}
        active={editor.isActive('underline')}
        onMouseDown={() => run((ed) => ed.chain().focus().toggleUnderline().run())}
      >
        <FaUnderline aria-hidden />
      </ToolbarBtn>
      <ToolbarBtn
        title={t('admin.dashboard.noteTbStrike')}
        active={editor.isActive('strike')}
        onMouseDown={() => run((ed) => ed.chain().focus().toggleStrike().run())}
      >
        <FaStrikethrough aria-hidden />
      </ToolbarBtn>
      <span className="mx-1 hidden h-6 w-px bg-line sm:inline-block" aria-hidden />
      <ToolbarBtn
        title={t('admin.dashboard.noteTbH1')}
        active={editor.isActive('heading', { level: 1 })}
        onMouseDown={() => run((ed) => ed.chain().focus().toggleHeading({ level: 1 }).run())}
      >
        <span className="px-0.5 text-xs font-bold">H1</span>
      </ToolbarBtn>
      <ToolbarBtn
        title={t('admin.dashboard.noteTbH2')}
        active={editor.isActive('heading', { level: 2 })}
        onMouseDown={() => run((ed) => ed.chain().focus().toggleHeading({ level: 2 }).run())}
      >
        <span className="px-0.5 text-xs font-bold">H2</span>
      </ToolbarBtn>
      <ToolbarBtn
        title={t('admin.dashboard.noteTbH3')}
        active={editor.isActive('heading', { level: 3 })}
        onMouseDown={() => run((ed) => ed.chain().focus().toggleHeading({ level: 3 }).run())}
      >
        <span className="px-0.5 text-xs font-bold">H3</span>
      </ToolbarBtn>
      <ToolbarBtn
        title={t('admin.dashboard.noteTbParagraph')}
        active={editor.isActive('paragraph') && !editor.isActive('heading')}
        onMouseDown={() => run((ed) => ed.chain().focus().setParagraph().run())}
      >
        <FaParagraph className="text-xs" aria-hidden />
      </ToolbarBtn>
      <span className="mx-1 hidden h-6 w-px bg-line sm:inline-block" aria-hidden />
      <ToolbarBtn
        title={t('admin.dashboard.noteTbBullet')}
        active={editor.isActive('bulletList')}
        onMouseDown={() => run((ed) => ed.chain().focus().toggleBulletList().run())}
      >
        <FaListUl aria-hidden />
      </ToolbarBtn>
      <ToolbarBtn
        title={t('admin.dashboard.noteTbOrdered')}
        active={editor.isActive('orderedList')}
        onMouseDown={() => run((ed) => ed.chain().focus().toggleOrderedList().run())}
      >
        <FaListOl aria-hidden />
      </ToolbarBtn>
      <ToolbarBtn
        title={t('admin.dashboard.noteTbQuote')}
        active={editor.isActive('blockquote')}
        onMouseDown={() => run((ed) => ed.chain().focus().toggleBlockquote().run())}
      >
        <FaQuoteRight aria-hidden />
      </ToolbarBtn>
      <ToolbarBtn
        title={t('admin.dashboard.noteTbCode')}
        active={editor.isActive('code')}
        onMouseDown={() => run((ed) => ed.chain().focus().toggleCode().run())}
      >
        <FaCode aria-hidden />
      </ToolbarBtn>
      <span className="mx-1 hidden h-6 w-px bg-line sm:inline-block" aria-hidden />
      <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-transparent px-2 text-xs text-ink-muted hover:bg-subtle">
        <span className="sr-only">{t('admin.dashboard.noteTbColor')}</span>
        <input
          type="color"
          className="h-7 w-10 cursor-pointer rounded border border-line bg-canvas p-0"
          value={editor.getAttributes('textStyle').color || '#0f172a'}
          onChange={(e) => run((ed) => ed.chain().focus().setColor(e.target.value).run())}
          aria-label={t('admin.dashboard.noteTbColor')}
        />
      </label>
      <ToolbarBtn
        title={t('admin.dashboard.noteTbClearColor')}
        active={false}
        onMouseDown={() => run((ed) => ed.chain().focus().unsetColor().run())}
      >
        <span className="text-[10px] font-semibold">A̶</span>
      </ToolbarBtn>
      <span className="mx-1 hidden h-6 w-px bg-line sm:inline-block" aria-hidden />
      <ToolbarBtn
        title={t('admin.dashboard.noteTbUndo')}
        disabled={!editor.can().undo()}
        onMouseDown={() => run((ed) => ed.chain().focus().undo().run())}
      >
        <FaUndo aria-hidden />
      </ToolbarBtn>
      <ToolbarBtn
        title={t('admin.dashboard.noteTbRedo')}
        disabled={!editor.can().redo()}
        onMouseDown={() => run((ed) => ed.chain().focus().redo().run())}
      >
        <FaRedo aria-hidden />
      </ToolbarBtn>
    </div>
  );
}

export function NoteRichTextEditor({ initialBody, onChange, placeholder, t }) {
  const initialHtml = migrateBodyToEditorHtml(initialBody);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
        }),
        TextStyle,
        Color.configure({ types: ['textStyle'] }),
        Placeholder.configure({
          placeholder: placeholder || '',
        }),
      ],
      content: initialHtml,
      editorProps: {
        attributes: {
          class: 'note-rich-editor-prose px-4 py-3 text-sm leading-relaxed text-ink sm:text-base',
          'data-placeholder': placeholder || '',
        },
      },
      onUpdate: ({ editor: ed }) => {
        onChange(ed.getHTML());
      },
      shouldRerenderOnTransaction: true,
    },
    [placeholder],
  );

  useEffect(() => {
    if (!editor) return;
    const next = migrateBodyToEditorHtml(initialBody);
    const cur = editor.getHTML();
    if (next !== cur) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, initialBody]);

  return (
    <div className="note-rich-editor overflow-hidden rounded-xl border border-line bg-canvas">
      <NoteEditorToolbar editor={editor} t={t} />
      <EditorContent editor={editor} className="note-rich-editor max-h-[min(50vh,420px)] overflow-y-auto" />
    </div>
  );
}
