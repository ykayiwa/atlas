"""Data source configuration for Atlas AI ingestion pipeline.

Uganda investment & privatization corpus for the Office of the State Minister of
Finance for Investment & Privatization. URLs are authoritative and gazetted
wherever possible.
"""

MVP_SOURCES = [
    # ── Core investment law ──────────────────────────────────────────────────
    {
        "name": "Investment Code Act 2019",
        "url": "https://www.ugandainvest.go.ug/wp-content/uploads/2020/03/The-Investment-Code-Act-2019.pdf",
        "category": "law",
        "format": "pdf",
    },
    {
        "name": "Public Enterprises Reform & Divestiture (PERD) Act",
        "url": "https://ulii.org/akn/ug/act/1993/9/eng@2000-12-31",
        "category": "privatization",
        "format": "html",
    },
    {
        "name": "Free Zones Act 2014",
        "url": "https://ulii.org/akn/ug/act/2014/9/eng@2014-06-13",
        "category": "law",
        "format": "html",
    },
    {
        "name": "Income Tax Act Cap. 340",
        "url": "https://ulii.org/akn/ug/act/1997/11/eng@2021-12-31",
        "category": "tax",
        "format": "html",
    },
    {
        "name": "Value Added Tax Act Cap. 349",
        "url": "https://ulii.org/akn/ug/act/1996/8/eng@2021-12-31",
        "category": "tax",
        "format": "html",
    },

    # ── Institutional ────────────────────────────────────────────────────────
    {
        "name": "Uganda Investment Authority",
        "url": "https://www.ugandainvest.go.ug",
        "category": "government",
        "format": "html",
    },
    {
        "name": "Ministry of Finance, Planning and Economic Development",
        "url": "https://www.finance.go.ug",
        "category": "government",
        "format": "html",
    },
    {
        "name": "Uganda Revenue Authority",
        "url": "https://www.ura.go.ug",
        "category": "tax",
        "format": "html",
    },
    {
        "name": "Bank of Uganda",
        "url": "https://www.bou.or.ug",
        "category": "economy",
        "format": "html",
    },
    {
        "name": "Capital Markets Authority Uganda",
        "url": "https://cmauganda.co.ug",
        "category": "regulation",
        "format": "html",
    },
    {
        "name": "Uganda Free Zones Authority",
        "url": "https://freezones.go.ug",
        "category": "government",
        "format": "html",
    },

    # ── Sector strategies ────────────────────────────────────────────────────
    {
        "name": "National Development Plan III (NDP III)",
        "url": "https://www.npa.go.ug/wp-content/uploads/2020/08/NDPIII-Finale_Compressed.pdf",
        "category": "strategy",
        "format": "pdf",
    },
    {
        "name": "Uganda Vision 2040",
        "url": "https://www.gou.go.ug/sites/default/files/media-files/VISION%202040.pdf",
        "category": "strategy",
        "format": "pdf",
    },
]
