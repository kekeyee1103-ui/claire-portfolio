import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  Eye,
  Github,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import type { Bullet, JourneyItem, JourneyGroup, KnowledgePost, Program, SiteContent } from '../content/types';
import {
  clearLocal,
  downloadContent,
  fetchPublished,
  fetchRepoContent,
  loadGhConfig,
  loadLocal,
  normalize,
  publishContent,
  saveGhConfig,
  saveLocal,
  testConnection,
  uploadArtFiles,
  type GhConfig,
} from '../content/store';

/* ---------------- 基础控件 ---------------- */

const inputCls =
  'w-full rounded-lg border border-[#C9A24B]/30 bg-[#15110A] px-3 py-2 text-sm text-[#EFE9DC] outline-none transition-colors focus:border-[#C9A24B]';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium tracking-[0.15em] text-[#C9A24B]">{label}</span>
      {children}
    </label>
  );
}

function TextInput(props: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      className={inputCls}
      value={props.value}
      placeholder={props.placeholder}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
}

function AreaInput(props: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      className={`${inputCls} resize-y leading-relaxed`}
      rows={props.rows ?? 3}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
}

function Btn(props: {
  children: ReactNode;
  onClick?: () => void;
  tone?: 'gold' | 'ghost' | 'danger';
  disabled?: boolean;
}) {
  const tones = {
    gold: 'border-[#C9A24B] bg-[#C9A24B] text-[#0C0C0C] hover:bg-[#D9BC6B]',
    ghost: 'border-[#C9A24B]/40 text-[#EFE9DC] hover:border-[#C9A24B] hover:text-[#E8CD8A]',
    danger: 'border-red-400/40 text-red-300/90 hover:border-red-400 hover:text-red-300',
  } as const;
  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={props.onClick}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium tracking-wider transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${tones[props.tone ?? 'ghost']}`}
    >
      {props.children}
    </button>
  );
}

function CardShell(props: {
  title: string;
  onUp?: () => void;
  onDown?: () => void;
  onDelete?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#C9A24B]/20 bg-[#0F0D09] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-medium tracking-wider text-[#EFE9DC]">{props.title}</h4>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={props.onUp} className="rounded-md p-1.5 text-[#EFE9DC]/50 transition-colors hover:bg-[#C9A24B]/10 hover:text-[#C9A24B]" title="上移">
            <ChevronUp size={16} />
          </button>
          <button type="button" onClick={props.onDown} className="rounded-md p-1.5 text-[#EFE9DC]/50 transition-colors hover:bg-[#C9A24B]/10 hover:text-[#C9A24B]" title="下移">
            <ChevronDown size={16} />
          </button>
          <button type="button" onClick={props.onDelete} className="rounded-md p-1.5 text-[#EFE9DC]/50 transition-colors hover:bg-red-400/10 hover:text-red-300" title="删除">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      {props.children}
    </div>
  );
}

function move<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const clamped = Math.max(0, Math.min(next.length - 1, to));
  const [x] = next.splice(from, 1);
  next.splice(clamped, 0, x);
  return next;
}

/* ---------------- 知识库编辑器 ---------------- */

function KnowledgeEditor({ posts, onChange }: { posts: KnowledgePost[]; onChange: (p: KnowledgePost[]) => void }) {
  return (
    <div className="flex flex-col gap-4">
      {posts.map((post, i) => (
        <CardShell
          key={i}
          title={`想法 ${i + 1}：${post.title || '（未命名）'}`}
          onUp={() => onChange(move(posts, i, i - 1))}
          onDown={() => onChange(move(posts, i, i + 1))}
          onDelete={() => onChange(posts.filter((_, x) => x !== i))}
        >
          <div className="flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="时间（如 2026.08）">
                <TextInput value={post.date} onChange={(v) => onChange(posts.map((p, x) => (x === i ? { ...p, date: v } : p)))} />
              </Field>
              <Field label="标签（如 行业思考）">
                <TextInput value={post.tag} onChange={(v) => onChange(posts.map((p, x) => (x === i ? { ...p, tag: v } : p)))} />
              </Field>
            </div>
            <Field label="标题">
              <TextInput value={post.title} onChange={(v) => onChange(posts.map((p, x) => (x === i ? { ...p, title: v } : p)))} />
            </Field>
            <Field label="摘要（卡片上显示的一两句话）">
              <AreaInput value={post.excerpt} onChange={(v) => onChange(posts.map((p, x) => (x === i ? { ...p, excerpt: v } : p)))} />
            </Field>
            <Field label="正文（点击卡片后展示的完整内容，支持空行分段）">
              <AreaInput value={post.content ?? ''} rows={6} onChange={(v) => onChange(posts.map((p, x) => (x === i ? { ...p, content: v || undefined } : p)))} />
            </Field>
            <Field label="全文链接（可选，填了会显示「Read More」）">
              <TextInput value={post.link ?? ''} placeholder="https://…" onChange={(v) => onChange(posts.map((p, x) => (x === i ? { ...p, link: v || undefined } : p)))} />
            </Field>
          </div>
        </CardShell>
      ))}
      <Btn onClick={() => onChange([{ date: '', tag: '', title: '', excerpt: '' }, ...posts])}>
        <Plus size={14} /> 新增想法
      </Btn>
    </div>
  );
}

/* ---------------- 简历经历编辑器 ---------------- */

function BulletsEditor({ bullets, onChange }: { bullets: Bullet[]; onChange: (b: Bullet[]) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium tracking-[0.15em] text-[#C9A24B]">描述条目</span>
      {bullets.map((b, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-xl border border-[#C9A24B]/15 p-3 sm:flex-row sm:items-start">
          <div className="sm:w-40">
            <TextInput value={b.lead} placeholder="小标题（如 战略研究）" onChange={(v) => onChange(bullets.map((x, xi) => (xi === i ? { ...x, lead: v } : x)))} />
          </div>
          <div className="flex-1">
            <AreaInput value={b.text} rows={2} onChange={(v) => onChange(bullets.map((x, xi) => (xi === i ? { ...x, text: v } : x)))} />
          </div>
          <button type="button" onClick={() => onChange(bullets.filter((_, xi) => xi !== i))} className="self-start rounded-md p-1.5 text-[#EFE9DC]/50 transition-colors hover:bg-red-400/10 hover:text-red-300" title="删除条目">
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <Btn onClick={() => onChange([...bullets, { lead: '', text: '' }])}>
        <Plus size={14} /> 加一条描述
      </Btn>
    </div>
  );
}

function JourneyEditor({ group, onChange }: { group: JourneyGroup; onChange: (items: JourneyItem[]) => void }) {
  const items = group.items;
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <CardShell
          key={i}
          title={`${item.org || '（未命名）'} · ${item.role || ''}`}
          onUp={() => onChange(move(items, i, i - 1))}
          onDown={() => onChange(move(items, i, i + 1))}
          onDelete={() => onChange(items.filter((_, x) => x !== i))}
        >
          <div className="flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="时间（如 2026.3 — 至今）">
                <TextInput value={item.period} onChange={(v) => onChange(items.map((x, xi) => (xi === i ? { ...x, period: v } : x)))} />
              </Field>
              <Field label="亮点徽章（可选，如 北京赛区一等奖）">
                <TextInput value={item.highlight ?? ''} onChange={(v) => onChange(items.map((x, xi) => (xi === i ? { ...x, highlight: v || undefined } : x)))} />
              </Field>
            </div>
            <Field label="学校 / 公司 / 赛事名称">
              <TextInput value={item.org} onChange={(v) => onChange(items.map((x, xi) => (xi === i ? { ...x, org: v } : x)))} />
            </Field>
            <Field label="身份 / 职位（如 管理经济学硕士）">
              <TextInput value={item.role} onChange={(v) => onChange(items.map((x, xi) => (xi === i ? { ...x, role: v } : x)))} />
            </Field>
            <BulletsEditor bullets={item.bullets} onChange={(b) => onChange(items.map((x, xi) => (xi === i ? { ...x, bullets: b } : x)))} />
          </div>
        </CardShell>
      ))}
      <Btn onClick={() => onChange([...items, { period: '', org: '', role: '', bullets: [{ lead: '', text: '' }] }])}>
        <Plus size={14} /> 新增条目
      </Btn>
    </div>
  );
}

/* ---------------- Program 编辑器 ---------------- */

function ProgramsEditor({
  programs,
  onChange,
  onArtFile,
}: {
  programs: Program[];
  onChange: (p: Program[]) => void;
  onArtFile: (index: number, file: File) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-xl border border-[#C9A24B]/20 bg-[#15110A] p-3 text-xs leading-relaxed text-[#EFE9DC]/55">
        配图支持两种方式：<strong className="text-[#E8CD8A]">本地上传图片</strong>（点「上传图片」选择文件，随「发布到网站」自动上传到仓库生效），
        或手动填写路径（<code className="text-[#E8CD8A]">art/bifrost.svg</code>、
        <code className="text-[#E8CD8A]">art/shopfront.svg</code>、
        <code className="text-[#E8CD8A]">art/inspireplanet.svg</code> 或任意图片网址）。留空则显示占位图。
      </p>
      {programs.map((p, i) => (
        <CardShell
          key={i}
          title={`${String(i + 1).padStart(2, '0')} · ${p.name || '（未命名）'}`}
          onUp={() => onChange(move(programs, i, i - 1))}
          onDown={() => onChange(move(programs, i, i + 1))}
          onDelete={() => onChange(programs.filter((_, x) => x !== i))}
        >
          <div className="flex flex-col gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="项目名称">
                <TextInput value={p.name} onChange={(v) => onChange(programs.map((x, xi) => (xi === i ? { ...x, name: v } : x)))} />
              </Field>
              <Field label="分类（中文，如 数据产品）">
                <TextInput value={p.categoryCn} onChange={(v) => onChange(programs.map((x, xi) => (xi === i ? { ...x, categoryCn: v } : x)))} />
              </Field>
              <Field label="分类（英文，如 Data Product）">
                <TextInput value={p.categoryEn} onChange={(v) => onChange(programs.map((x, xi) => (xi === i ? { ...x, categoryEn: v } : x)))} />
              </Field>
              <Field label="链接（可选，如线上 Demo）">
                <TextInput value={p.url ?? ''} placeholder="https://…" onChange={(v) => onChange(programs.map((x, xi) => (xi === i ? { ...x, url: v || undefined } : x)))} />
              </Field>
            </div>
            <Field label="简介">
              <AreaInput value={p.desc} onChange={(v) => onChange(programs.map((x, xi) => (xi === i ? { ...x, desc: v } : x)))} />
            </Field>
            <Field label="配图（本地图片会随「发布到网站」自动上传）">
              <div className="flex flex-wrap items-center gap-3">
                {p.art ? (
                  <img src={p.art} alt="配图预览" className="h-14 w-24 rounded-lg border border-[#C9A24B]/30 object-cover" />
                ) : (
                  <div className="flex h-14 w-24 items-center justify-center rounded-lg border border-dashed border-[#C9A24B]/30 text-[10px] text-[#EFE9DC]/40">
                    无配图
                  </div>
                )}
                <label className="cursor-pointer rounded-full border border-[#C9A24B]/40 px-4 py-1.5 text-xs font-medium text-[#EFE9DC] transition-colors hover:border-[#C9A24B] hover:text-[#E8CD8A]">
                  本地上传图片
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) onArtFile(i, f);
                      e.target.value = '';
                    }}
                  />
                </label>
                <div className="min-w-[180px] flex-1">
                  <TextInput
                    value={p.art && !p.art.startsWith('data:') ? p.art : ''}
                    placeholder={p.art?.startsWith('data:') ? '已选本地图，发布后自动填入路径' : 'art/bifrost.svg 或图片网址'}
                    onChange={(v) => onChange(programs.map((x, xi) => (xi === i ? { ...x, art: v || undefined } : x)))}
                  />
                </div>
              </div>
            </Field>
          </div>
        </CardShell>
      ))}
      <Btn onClick={() => onChange([...programs, { name: '', categoryEn: '', categoryCn: '', desc: '' }])}>
        <Plus size={14} /> 新增作品
      </Btn>
    </div>
  );
}

function ChangePasswordPanel({ onDone, onClose }: { onDone: (msg: string) => void; onClose: () => void }) {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newPass2, setNewPass2] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setErr('');
    const c = loadCredential();
    if (!c || c.hash !== (await sha256(oldPass))) {
      setErr('旧密码不正确');
      return;
    }
    if (newPass.length < 4) {
      setErr('新密码至少 4 位');
      return;
    }
    if (newPass !== newPass2) {
      setErr('两次输入的新密码不一致');
      return;
    }
    setBusy(true);
    localStorage.setItem(PASS_KEY, JSON.stringify({ user: c.user, hash: await sha256(newPass) }));
    setBusy(false);
    onDone('✅ 密码已更新，下次登录使用新密码');
  };

  return (
    <div className="mt-3 w-full max-w-sm rounded-2xl border border-[#C9A24B]/25 bg-[#0F0D09] p-5 text-left">
      <Field label="旧密码">
        <input type="password" className={inputCls} value={oldPass} onChange={(e) => setOldPass(e.target.value)} />
      </Field>
      <div className="mt-3 flex flex-col gap-3">
        <Field label="新密码（至少 4 位）">
          <input type="password" className={inputCls} value={newPass} onChange={(e) => setNewPass(e.target.value)} />
        </Field>
        <Field label="确认新密码">
          <input type="password" className={inputCls} value={newPass2} onChange={(e) => setNewPass2(e.target.value)} />
        </Field>
      </div>
      {err && <p className="mt-2 text-xs text-red-300/90">{err}</p>}
      <div className="mt-4 flex items-center gap-2">
        <Btn onClick={submit} tone="gold" disabled={busy}>
          {busy ? '保存中…' : '保存新密码'}
        </Btn>
        <Btn onClick={onClose}>取消</Btn>
      </div>
    </div>
  );
}

/* ---------------- 登录门 ---------------- */

const PASS_KEY = 'claire-admin-pass-v1';
const REMEMBER_KEY = 'claire-admin-remember-v1';
const SESSION_KEY = 'claire-admin-unlocked-v1';

interface AdminCredential {
  user: string;
  hash: string;
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function loadCredential(): AdminCredential | null {
  try {
    return JSON.parse(localStorage.getItem(PASS_KEY) ?? 'null') as AdminCredential | null;
  } catch {
    return null;
  }
}

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const existing = loadCredential();
  const [mode] = useState<'login' | 'setup'>(existing ? 'login' : 'setup');
  const [user, setUser] = useState(existing?.user ?? '');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const unlock = () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    if (remember) localStorage.setItem(REMEMBER_KEY, '1');
    else localStorage.removeItem(REMEMBER_KEY);
    onUnlock();
  };

  const submit = async () => {
    setErr('');
    setBusy(true);
    try {
      if (mode === 'setup') {
        if (!user.trim() || pass.length < 4) {
          setErr('请填写用户名，密码至少 4 位');
          return;
        }
        if (pass !== pass2) {
          setErr('两次输入的密码不一致');
          return;
        }
        localStorage.setItem(PASS_KEY, JSON.stringify({ user: user.trim(), hash: await sha256(pass) }));
        unlock();
      } else {
        const c = loadCredential();
        if (!c || c.user !== user.trim() || c.hash !== (await sha256(pass))) {
          setErr('用户名或密码不正确');
          return;
        }
        unlock();
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0C0C0C] px-4">
      <div className="w-full max-w-sm rounded-3xl border border-[#C9A24B]/25 bg-gradient-to-b from-[#15110A] to-[#0F0D09] p-8">
        <h1 className="text-center text-lg font-semibold tracking-wide text-[#EFE9DC]">
          Claire · 内容管理
        </h1>
        <p className="mt-2 text-center text-xs text-[#EFE9DC]/50">
          {mode === 'setup' ? '首次使用，设置管理员账号密码' : '请登录管理后台'}
        </p>
        <div className="mt-6 flex flex-col gap-4">
          <Field label="用户名">
            <TextInput value={user} onChange={setUser} placeholder="管理员用户名" />
          </Field>
          <Field label="密码">
            <input
              type="password"
              className={inputCls}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder={mode === 'setup' ? '至少 4 位' : '密码'}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
          </Field>
          {mode === 'setup' && (
            <Field label="确认密码">
              <input
                type="password"
                className={inputCls}
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
              />
            </Field>
          )}
          {mode === 'login' && (
            <label className="flex cursor-pointer items-center gap-2 text-xs text-[#EFE9DC]/60">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-[#C9A24B]"
              />
              在这台电脑上记住登录
            </label>
          )}
          {err && <p className="text-xs text-red-300/90">{err}</p>}
          <Btn onClick={submit} tone="gold" disabled={busy}>
            {busy ? '验证中…' : mode === 'setup' ? '创建并进入' : '登 录'}
          </Btn>
          {mode === 'setup' && (
            <p className="text-center text-[11px] leading-relaxed text-[#EFE9DC]/40">
              账号密码只保存在你自己的浏览器里，用于拦住陌生访客；忘记密码可清除浏览器本站数据后重新设置。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- 主应用 ---------------- */

type TabKey = 'knowledge' | 'programs' | `j-${number}`;

export default function AdminApp() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === '1' || localStorage.getItem(REMEMBER_KEY) === '1'
  );
  const [content, setContent] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState<TabKey>('knowledge');
  const [status, setStatus] = useState('加载中…');
  const [fromLocal, setFromLocal] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<{ name: string; dataUrl: string; base64: string }[]>([]);
  const [gh, setGh] = useState<GhConfig>(() =>
    loadGhConfig() ?? { owner: 'kekeyee1103-ui', repo: 'claire-portfolio', branch: 'main', path: 'public/content.json', token: '' }
  );
  const [ghBusy, setGhBusy] = useState(false);
  const [ghTesting, setGhTesting] = useState(false);
  const [ghResult, setGhResult] = useState('');
  const [showPassPanel, setShowPassPanel] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const local = loadLocal();
      if (local) {
        setContent(local);
        setFromLocal(true);
        setStatus('已加载「本机预览」内容（尚未发布）');
        return;
      }
      const pub = await fetchPublished();
      if (pub) {
        setContent(pub);
        setStatus('已加载线上发布的内容');
      } else {
        setStatus('加载失败：找不到 content.json，请刷新重试');
      }
    })();
  }, []);

  if (!unlocked) {
    return <Gate onUnlock={() => setUnlocked(true)} />;
  }

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-[#EFE9DC]/70">{status}</div>
    );
  }

  const mutate = (fn: (c: SiteContent) => void) => {
    const next = normalize(JSON.parse(JSON.stringify(content)));
    fn(next);
    setContent(next);
    setStatus('有未保存的修改');
  };

  const doSave = () => {
    try {
      saveLocal(content);
      setFromLocal(true);
      setStatus('已保存到本机：在这个浏览器里打开主页即可看到最新效果');
    } catch {
      setStatus('本机保存失败：内容过大（可能含新上传的图片）。可直接「发布到网站」，不影响上线');
    }
  };

  const doClearLocal = async () => {
    clearLocal();
    setFromLocal(false);
    const pub = await fetchPublished();
    setContent(pub);
    setStatus('已清除本机修改，回到线上发布版本');
  };

  const doImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      setContent(normalize(JSON.parse(await f.text())));
      setStatus('导入成功，请检查内容后点击「保存到本机预览」');
    } catch {
      setStatus('导入失败：不是有效的 JSON 文件');
    }
    e.target.value = '';
  };

  const handleArtFile = async (pi: number, file: File) => {
    if (!file.type.startsWith('image/')) {
      setStatus('❌ 请选择图片文件（jpg / png / webp / svg）');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setStatus('❌ 图片超过 8MB，请压缩后再上传');
      return;
    }
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('读取文件失败'));
        reader.readAsDataURL(file);
      });
      const extRaw = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
      const name = `program-${Date.now()}.${extRaw || 'png'}`;
      const base64 = dataUrl.split(',')[1] ?? '';
      setPendingUploads((u) => [...u, { name, dataUrl, base64 }]);
      mutate((c) => {
        c.programs[pi].art = dataUrl;
      });
      setStatus(`图片已就绪（${name}），点击「发布到网站」后上传生效`);
    } catch {
      setStatus('❌ 图片读取失败，请重试');
    }
  };

  const doTest = async () => {
    setGhTesting(true);
    setGhResult('');
    saveGhConfig(gh);
    const r = await testConnection(gh);
    setGhTesting(false);
    setGhResult(r.message);
  };

  const doPublish = async () => {
    setGhBusy(true);
    setGhResult('');
    saveGhConfig(gh);
    let working = content;
    if (pendingUploads.length > 0) {
      const up = await uploadArtFiles(gh, pendingUploads);
      if (!up.ok) {
        setGhBusy(false);
        setGhResult(`❌ 配图上传失败：${up.error}`);
        return;
      }
      let text = JSON.stringify(working);
      for (const u of pendingUploads) {
        text = text.split(u.dataUrl).join(`art/${u.name}`);
      }
      working = normalize(JSON.parse(text));
    }
    const res = await publishContent(gh, working);
    setGhBusy(false);
    if (res.ok) {
      setContent(working);
      try {
        saveLocal(working);
        setFromLocal(true);
      } catch {
        /* 本机存储配额不足不影响发布 */
      }
      setPendingUploads([]);
      setGhResult('✅ 发布成功！图片与内容已上线，访客刷新页面即可看到。');
    } else {
      setGhResult(`❌ ${res.error}`);
    }
  };

  const doPullRepo = async () => {
    const c = await fetchRepoContent(gh);
    if (c) {
      setContent(c);
      setStatus('已拉取 GitHub 仓库里的最新内容（未保存）');
    } else {
      setGhResult('❌ 拉取失败：请检查仓库信息与 Token');
    }
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'knowledge', label: '知识库' },
    ...content.journey.map((g, i) => ({ key: `j-${i}` as TabKey, label: g.titleCn })),
    { key: 'programs', label: 'Program 作品' },
  ];

  return (
    <div className="min-h-screen bg-[#0C0C0C] px-4 py-8 text-[#EFE9DC] sm:px-8">
      <div className="mx-auto max-w-4xl">
        {/* 顶栏 */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C9A24B]/20 pb-6">
          <div>
            <h1 className="text-xl font-semibold tracking-wide">
              Claire · 网站内容管理
              <a href="./" target="_blank" rel="noreferrer" className="ml-3 inline-flex items-center gap-1 text-xs font-normal text-[#C9A24B] hover:underline">
                打开主页 <ExternalLink size={12} />
              </a>
            </h1>
            <p className={`mt-2 text-xs ${fromLocal ? 'text-[#E8CD8A]' : 'text-[#EFE9DC]/50'}`}>{status}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Btn onClick={doSave} tone="gold">
              <Save size={14} /> 保存到本机预览
            </Btn>
            <Btn onClick={() => downloadContent(content)} tone="ghost">
              <Download size={14} /> 导出 content.json
            </Btn>
            <Btn onClick={() => fileRef.current?.click()} tone="ghost">
              <Upload size={14} /> 导入 JSON
            </Btn>
            {fromLocal && (
              <Btn onClick={doClearLocal} tone="danger">
                <RotateCcw size={14} /> 清除本机修改
              </Btn>
            )}
            <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" onChange={doImport} />
          </div>
        </header>

        {/* 发布到网站（GitHub 互通） */}
        <section className="mt-6 rounded-2xl border border-[#C9A24B]/25 bg-gradient-to-b from-[#15110A] to-[#0F0D09] p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold tracking-wider text-[#EFE9DC]">
            <Github size={16} className="text-[#C9A24B]" /> 发布到网站（GitHub 互通）
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[#EFE9DC]/55">
            填写一次仓库信息与 Token（只保存在你自己的浏览器里）。点「发布到网站」会把内容写入仓库的
            <code className="text-[#E8CD8A]"> public/content.json </code>
            存档，并同步到
            <code className="text-[#E8CD8A]"> gh-pages </code>
            部署分支——线上网站<strong className="text-[#E8CD8A]">立即更新</strong>，访客刷新即可看到。
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="GitHub 用户名 / 组织">
              <TextInput value={gh.owner} placeholder="如 xkkx33" onChange={(v) => setGh({ ...gh, owner: v.trim() })} />
            </Field>
            <Field label="仓库名">
              <TextInput value={gh.repo} placeholder="如 claire-portfolio" onChange={(v) => setGh({ ...gh, repo: v.trim() })} />
            </Field>
            <Field label="分支（一般 main）">
              <TextInput value={gh.branch} onChange={(v) => setGh({ ...gh, branch: v.trim() })} />
            </Field>
            <Field label="文件路径">
              <TextInput value={gh.path} placeholder="public/content.json" onChange={(v) => setGh({ ...gh, path: v.trim() })} />
            </Field>
          </div>
          <div className="mt-3">
            <Field label="GitHub Token（需要该仓库 Contents 读写权限，仅存本机）">
              <TextInput value={gh.token} placeholder="github_pat_… / ghp_…" onChange={(v) => setGh({ ...gh, token: v.trim() })} />
            </Field>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Btn onClick={doTest} tone="ghost" disabled={ghTesting}>
              {ghTesting ? '测试中…' : '测试连接'}
            </Btn>
            <Btn onClick={doPublish} tone="gold" disabled={ghBusy}>
              <Eye size={14} /> {ghBusy ? '发布中…' : '发布到网站'}
            </Btn>
            <Btn onClick={doPullRepo} tone="ghost" disabled={ghBusy}>
              拉取仓库最新内容
            </Btn>
            <Btn onClick={() => { saveGhConfig(gh); setGhResult('✅ 仓库配置已保存到本机'); }} tone="ghost">
              保存仓库配置
            </Btn>
          </div>
          {ghResult && <p className="mt-3 text-xs leading-relaxed text-[#E8CD8A]">{ghResult}</p>}
          <details className="mt-4 text-xs leading-relaxed text-[#EFE9DC]/55">
            <summary className="cursor-pointer text-[#C9A24B]">首次使用？查看一次性部署步骤 →</summary>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>把本项目上传到 GitHub 仓库（已完成：kekeyee1103-ui/claire-portfolio）。</li>
              <li>网站通过 gh-pages 分支发布到 GitHub Pages（已配置好）。</li>
              <li>GitHub → Settings → Developer settings → Fine-grained tokens：生成一个只授权该仓库「Contents: Read and write」的 Token（无需 workflow 权限）。</li>
              <li>回到本页填写并保存仓库信息与 Token。以后编辑完点「发布到网站」即可，内容即时上线，无需再碰代码。</li>
            </ol>
          </details>
        </section>

        {/* 内容编辑 */}
        <section className="mt-8">
          <div className="flex flex-wrap gap-2 border-b border-[#C9A24B]/20 pb-4">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium tracking-wider transition-colors ${
                  tab === t.key
                    ? 'border-[#C9A24B] bg-[#C9A24B] text-[#0C0C0C]'
                    : 'border-[#C9A24B]/35 text-[#EFE9DC]/70 hover:border-[#C9A24B]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {tab === 'knowledge' && (
              <KnowledgeEditor posts={content.knowledge} onChange={(p) => mutate((c) => { c.knowledge = p; })} />
            )}
            {tab === 'programs' && (
              <ProgramsEditor
                programs={content.programs}
                onChange={(p) => mutate((c) => { c.programs = p; })}
                onArtFile={handleArtFile}
              />
            )}
            {tab.startsWith('j-') && (() => {
              const gi = Number(tab.slice(2));
              const group: JourneyGroup | undefined = content.journey[gi];
              if (!group) return null;
              return (
                <JourneyEditor
                  group={group}
                  onChange={(items) => mutate((c) => { c.journey[gi].items = items; })}
                />
              );
            })()}
          </div>
        </section>

        <footer className="mt-12 flex flex-col items-center gap-3 border-t border-[#C9A24B]/15 pt-6 text-center text-xs text-[#EFE9DC]/35">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowPassPanel((v) => !v)}
              className="text-[#EFE9DC]/40 transition-colors hover:text-[#C9A24B]"
            >
              修改密码
            </button>
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem(SESSION_KEY);
                localStorage.removeItem(REMEMBER_KEY);
                setUnlocked(false);
              }}
              className="text-[#EFE9DC]/40 transition-colors hover:text-[#C9A24B]"
            >
              退出登录
            </button>
          </div>
          {showPassPanel && (
            <ChangePasswordPanel
              onDone={(msg) => {
                setShowPassPanel(false);
                setStatus(msg);
              }}
              onClose={() => setShowPassPanel(false)}
            />
          )}
          <span>内容保存在你的浏览器与 GitHub 仓库中 · 本页面不对访客展示（noindex）</span>
        </footer>
      </div>
    </div>
  );
}
