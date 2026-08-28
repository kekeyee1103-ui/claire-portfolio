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

/** 把内容发布到 GitHub 仓库（触发线上自动重新部署，访客 1-2 分钟内可见） */
export async function publishContent(
  cfg: GhConfig,
  content: SiteContent
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!cfg.owner || !cfg.repo || !cfg.token) {
    return { ok: false, error: '请先填写 GitHub 仓库信息和 Token' };
  }
  const headers = ghHeaders(cfg);
  try {
    let sha: string | undefined;
    const get = await fetch(`${ghApi(cfg)}?ref=${encodeURIComponent(cfg.branch)}`, { headers });
    if (get.status === 200) {
      sha = (await get.json())?.sha;
    } else if (get.status !== 404) {
      return { ok: false, error: `读取远端文件失败（HTTP ${get.status}），请检查仓库 / 分支 / 路径 / Token 权限` };
    }
    const body: Record<string, unknown> = {
      message: `content: 更新网站内容 ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`,
      content: b64encode(JSON.stringify(content, null, 2)),
      branch: cfg.branch,
    };
    if (sha) body.sha = sha;
    const put = await fetch(ghApi(cfg), {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (put.status === 200 || put.status === 201) return { ok: true };
    const j = await put.json().catch(() => null);
    return { ok: false, error: `写入失败（HTTP ${put.status}）${j?.message ? `：${j.message}` : ''}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : '网络错误' };
  }
}
