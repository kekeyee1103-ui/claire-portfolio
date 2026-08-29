import type { SiteContent } from './types';

const LS_KEY = 'claire-site-content-v1';
const GH_KEY = 'claire-gh-config-v1';

export interface GhConfig {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  token: string;
}

/** 宽松校验 / 补全字段，导入旧格式或残缺 JSON 时不会崩 */
export function normalize(raw: unknown): SiteContent {
  const o = (raw ?? {}) as Record<string, unknown>;
  const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
  const str = (v: unknown): string => (v == null ? '' : String(v));

  const journey = arr(o.journey).map((g: any) => ({
    titleCn: str(g?.titleCn) || '未命名分组',
    iconKey: (['edu', 'trophy', 'briefcase'].includes(g?.iconKey) ? g.iconKey : 'edu'),
    items: arr(g?.items).map((it: any) => ({
      period: str(it?.period),
      org: str(it?.org),
      role: str(it?.role),
      highlight: it?.highlight ? str(it.highlight) : undefined,
      bullets: arr(it?.bullets).map((b: any) => ({ lead: str(b?.lead), text: str(b?.text) })),
    })),
  }));

  const programs = arr(o.programs).map((p: any) => ({
    name: str(p?.name),
    categoryEn: str(p?.categoryEn),
    categoryCn: str(p?.categoryCn),
    desc: str(p?.desc),
    url: p?.url ? str(p.url) : undefined,
    art: p?.art ? str(p.art) : undefined,
  }));

  const knowledge = arr(o.knowledge).map((k: any) => ({
    date: str(k?.date),
    tag: str(k?.tag),
    title: str(k?.title),
    excerpt: str(k?.excerpt),
    content: k?.content ? str(k.content) : undefined,
    link: k?.link ? str(k.link) : undefined,
  }));

  return { journey, programs, knowledge };
}

/* ---------------- 本机（浏览器）存储：用于即时预览 ---------------- */

export function loadLocal(): SiteContent | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? normalize(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function saveLocal(content: SiteContent): void {
  localStorage.setItem(LS_KEY, JSON.stringify(content));
}

export function clearLocal(): void {
  localStorage.removeItem(LS_KEY);
}

/* ---------------- 已发布内容：public/content.json ---------------- */

export async function fetchPublished(): Promise<SiteContent | null> {
  try {
    const res = await fetch('content.json', { cache: 'no-store' });
    if (!res.ok) return null;
    return normalize(await res.json());
  } catch {
    return null;
  }
}

export function downloadContent(content: SiteContent): void {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'content.json';
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------------- GitHub 互通：读写仓库里的 content.json ---------------- */

const b64encode = (s: string): string => {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin);
};

const b64decode = (s: string): string => {
  const bin = atob(s.replace(/\n/g, ''));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export function loadGhConfig(): GhConfig | null {
  try {
    const raw = localStorage.getItem(GH_KEY);
    return raw ? (JSON.parse(raw) as GhConfig) : null;
  } catch {
    return null;
  }
}

export function saveGhConfig(cfg: GhConfig): void {
  localStorage.setItem(GH_KEY, JSON.stringify(cfg));
}

function ghApi(cfg: GhConfig): string {
  return `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${cfg.path.replace(/^\/+/, '')}`;
}

function ghHeaders(cfg: GhConfig): Record<string, string> {
  return { Authorization: `Bearer ${cfg.token}`, Accept: 'application/vnd.github+json' };
}

/** 从 GitHub 仓库拉取最新 content.json（比线上部署更即时） */
export async function fetchRepoContent(cfg: GhConfig): Promise<SiteContent | null> {
  try {
    const res = await fetch(`${ghApi(cfg)}?ref=${encodeURIComponent(cfg.branch)}`, {
      headers: ghHeaders(cfg),
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (typeof json?.content !== 'string') return null;
    return normalize(JSON.parse(b64decode(json.content)));
  } catch {
    return null;
  }
}

/** 检查仓库信息与 Token 是否可用（用于后台「测试连接」） */
export async function testConnection(cfg: GhConfig): Promise<{ ok: boolean; message: string }> {
  if (!cfg.owner || !cfg.repo || !cfg.token) {
    return { ok: false, message: '请先填写用户名、仓库名和 Token' };
  }
  try {
    const res = await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}`, {
      headers: ghHeaders(cfg),
    });
    if (res.status === 200) {
      const j = await res.json();
      if (j?.permissions && j.permissions.push === false) {
        return { ok: false, message: '❌ Token 有效但对该仓库没有写权限：Fine-grained Token 请把 Contents 权限设为 Read and write 后重新生成' };
      }
      return { ok: true, message: `✅ 连接成功：${j?.full_name ?? `${cfg.owner}/${cfg.repo}`}` };
    }
    if (res.status === 401) return { ok: false, message: '❌ Token 无效或已过期，请重新生成' };
    if (res.status === 404) {
      return {
        ok: false,
        message:
          '❌ 仓库不存在或 Token 无权访问：请检查用户名 / 仓库名；Fine-grained Token 需要在「Repository access」里选中本仓库，并在 Permissions 里给 Contents 读写权限',
      };
    }
    return { ok: false, message: `❌ 连接失败（HTTP ${res.status}）` };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : '网络错误' };
  }
}

/** 把一个文件写入仓库指定分支（存在则更新，不存在则创建）。base64 为文件内容的 base64 编码 */
async function putFileInternal(
  cfg: GhConfig,
  branch: string,
  path: string,
  message: string,
  base64: string
): Promise<void> {
  const api = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${path.replace(/^\/+/, '')}`;
  const headers = ghHeaders(cfg);
  let sha: string | undefined;
  const get = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, { headers });
  if (get.status === 200) {
    sha = (await get.json())?.sha;
  } else if (get.status !== 404) {
    throw new Error(`读取 ${branch}:${path} 失败（HTTP ${get.status}）`);
  }
  const body: Record<string, unknown> = { message, content: base64, branch };
  if (sha) body.sha = sha;
  const put = await fetch(api, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (put.status !== 200 && put.status !== 201) {
    const j = await put.json().catch(() => null);
    let hint = '';
    if (put.status === 404 || put.status === 403) {
      hint =
        '。常见原因：Token 只有读取权限 —— Fine-grained Token 请把 Contents 权限设为「Read and write」后重新生成；或改用勾选了 repo 的 Classic Token';
    }
    throw new Error(
      `写入 ${branch}:${path} 失败（HTTP ${put.status}）${j?.message ? `：${j.message}` : ''}${hint}`
    );
  }
}

function putFile(cfg: GhConfig, branch: string, path: string, message: string, text: string): Promise<void> {
  return putFileInternal(cfg, branch, path, message, b64encode(text));
}

/** 上传二进制（图片）文件，base64 为文件原始内容的 base64 编码 */
function putFileBase64(cfg: GhConfig, branch: string, path: string, message: string, base64: string): Promise<void> {
  return putFileInternal(cfg, branch, path, message, base64);
}

/** 批量上传作品配图：同时写入 main（public/art/）与 gh-pages（art/） */
export async function uploadArtFiles(
  cfg: GhConfig,
  files: { name: string; base64: string }[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!cfg.owner || !cfg.repo || !cfg.token) {
    return { ok: false, error: '请先填写 GitHub 仓库信息和 Token' };
  }
  try {
    for (const f of files) {
      await putFileBase64(cfg, cfg.branch, `public/art/${f.name}`, `content: 上传作品配图 ${f.name}`, f.base64);
      await putFileBase64(cfg, 'gh-pages', `art/${f.name}`, `content: 发布作品配图 ${f.name}`, f.base64);
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : '网络错误' };
  }
}

/**
 * 发布内容：
 * 1. 提交到 main 分支 public/content.json（源文件存档）
 * 2. 提交到 gh-pages 分支 content.json（部署分支，访客即时可见）
 */
export async function publishContent(
  cfg: GhConfig,
  content: SiteContent
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!cfg.owner || !cfg.repo || !cfg.token) {
    return { ok: false, error: '请先填写 GitHub 仓库信息和 Token' };
  }
  const text = JSON.stringify(content, null, 2);
  const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  try {
    await putFile(cfg, cfg.branch, cfg.path, `content: 更新网站内容 ${stamp}`, text);
    try {
      await putFile(cfg, 'gh-pages', 'content.json', `content: 发布网站内容 ${stamp}`, text);
    } catch (e) {
      // 部署分支写入失败不影响存档；提示用户稍后重试发布
      return {
        ok: false,
        error: `内容已存档到 ${cfg.branch} 分支，但发布到 gh-pages 失败：${e instanceof Error ? e.message : '未知错误'}`,
      };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : '网络错误' };
  }
}
