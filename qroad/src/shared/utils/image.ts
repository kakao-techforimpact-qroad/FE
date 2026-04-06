const PUBLIC_IMAGE_BASE_URL =
    import.meta.env.VITE_S3_PUBLIC_BASE_URL ||
    import.meta.env.VITE_IMAGE_BASE_URL ||
    '';
const ARTICLE_PLACEHOLDER_KEY = 'ai-images/placeholder.png';

function trimSlashes(value: string): string {
    return value.replace(/^\/+|\/+$/g, '');
}

/**
 * imagePath is stored as an object key, so convert it to a renderable URL.
 * - absolute URL: use as-is
 * - object key: prepend configured public base URL
 */
export function toRenderableImageUrl(imagePath?: string | null): string | null {
    if (!imagePath) return null;

    const raw = imagePath.trim();
    if (!raw) return null;

    if (/^https?:\/\//i.test(raw)) {
        return raw;
    }

    if (!PUBLIC_IMAGE_BASE_URL) {
        return null;
    }

    const base = trimSlashes(PUBLIC_IMAGE_BASE_URL);
    const key = trimSlashes(raw);
    return `${base}/${key}`;
}

export function getArticlePlaceholderImageUrl(): string | null {
    return toRenderableImageUrl(ARTICLE_PLACEHOLDER_KEY);
}

