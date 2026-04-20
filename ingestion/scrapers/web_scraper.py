"""Web scraping using crawl4ai."""

from crawl4ai import WebCrawler


def scrape_url(url: str) -> str:
    """Scrape a URL and return markdown content."""
    crawler = WebCrawler()
    crawler.warmup()
    result = crawler.run(url=url)
    return result.markdown


def scrape_urls(urls: list[str]) -> dict[str, str]:
    """Scrape multiple URLs and return a dict of url -> content."""
    crawler = WebCrawler()
    crawler.warmup()
    results = {}

    for url in urls:
        try:
            result = crawler.run(url=url)
            results[url] = result.markdown
            print(f"  Scraped: {url} ({len(result.markdown)} chars)")
        except Exception as e:
            print(f"  Failed: {url} - {e}")
            results[url] = ""

    return results
