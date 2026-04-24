import { newsPosts } from "@/data/radio-data";
import type { NewsPost } from "@/types/radio";

interface CurrentsArticle {
  id?: string;
  title?: string;
  url?: string;
  image?: string;
  published?: string;
  category?: string[];
  author?: string;
}

interface CurrentsResponse {
  news?: CurrentsArticle[];
}

const CURRENTS_URL = "https://api.currentsapi.services/v1/latest-news";
const CURRENTS_SEARCH_URL = "https://api.currentsapi.services/v1/search";
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80";

function formatDate(input?: string) {
  if (!input) return "Actualidad";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "Actualidad";
  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export async function getEcuadorNews(limit = 3): Promise<NewsPost[]> {
  const apiKey = process.env.CURRENTS_API_KEY;
  if (!apiKey) {
    return [];
  }

  const latestParams = new URLSearchParams({
    country: "EC",
    language: "es",
    apiKey,
  });

  const mapArticles = (articles: CurrentsArticle[] | undefined) =>
    articles
      ?.filter((item) => item.title && item.url)
      .slice(0, limit)
      .map((item, index) => ({
        id: item.id ?? `currents-${index}`,
        title: item.title as string,
        category: item.category?.[0] ?? "Ecuador",
        date: formatDate(item.published),
        image: item.image || DEFAULT_IMAGE,
        url: item.url as string,
        source: item.author || "Currents API",
      })) ?? [];

  try {
    const response = await fetch(`${CURRENTS_URL}?${latestParams.toString()}`, {
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      return newsPosts.slice(0, limit);
    }

    const data = (await response.json()) as CurrentsResponse;
    const mapped = mapArticles(data.news);

    if (mapped.length > 0) return mapped;

    // Currents often returns empty for strict country feeds.
    // Fallback to search terms to keep Ecuador headlines populated.
    const searchParams = new URLSearchParams({
      keywords: "Ecuador",
      language: "es",
      apiKey,
    });
    const searchResponse = await fetch(`${CURRENTS_SEARCH_URL}?${searchParams.toString()}`, {
      next: { revalidate: 900 },
    });
    if (!searchResponse.ok) return newsPosts.slice(0, limit);
    const searchData = (await searchResponse.json()) as CurrentsResponse;
    const searchMapped = mapArticles(searchData.news);
    return searchMapped.length > 0 ? searchMapped : newsPosts.slice(0, limit);
  } catch {
    return newsPosts.slice(0, limit);
  }
}
