import { useEffect, useState } from 'react';

const cache = new Map<string, string>();

function parseRepo(repoUrl: string) {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/);
  return match ? { owner: match[1], repo: match[2] } : null;
}

export function useLatestRelease(repoUrl: string, fallback: string) {
  const [version, setVersion] = useState(() => {
    const parsed = parseRepo(repoUrl);
    if (!parsed) return fallback;
    return cache.get(`${parsed.owner}/${parsed.repo}`) ?? fallback;
  });

  useEffect(() => {
    const parsed = parseRepo(repoUrl);
    if (!parsed) return;
    const key = `${parsed.owner}/${parsed.repo}`;
    if (cache.has(key)) return;

    let cancelled = false;
    fetch(`https://api.github.com/repos/${key}/releases/latest`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((json: { tag_name?: string }) => {
        if (cancelled || !json.tag_name) return;
        const tag = json.tag_name.startsWith('v') ? json.tag_name : `v${json.tag_name}`;
        cache.set(key, tag);
        setVersion(tag);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [repoUrl, fallback]);

  return version;
}
