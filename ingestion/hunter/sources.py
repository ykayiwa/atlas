"""Source catalog for the Atlas Hunter ingestion service.

The Hunter supplements the authoritative corpus in ingestion/config/sources.py
with Wikipedia-backed background material about Uganda's investment environment.

Each WIKIPEDIA_SOURCES entry: (wikipedia_slug, display_name, category).
Each WEB_SOURCES entry: (url, display_name, category).

Categories must match those seeded in migrations/004_categories.sql.
"""

WIKIPEDIA_SOURCES: list[tuple[str, str, str]] = [
    # ── Government & institutional ───────────────────────────────────────────
    ("Politics_of_Uganda", "Politics of Uganda", "government"),
    ("Cabinet_of_Uganda", "Cabinet of Uganda", "government"),
    ("Government_of_Uganda", "Government of Uganda", "government"),
    ("Uganda_Investment_Authority", "Uganda Investment Authority", "government"),
    ("Uganda_Revenue_Authority", "Uganda Revenue Authority", "tax"),
    ("Bank_of_Uganda", "Bank of Uganda", "economy"),
    ("Uganda_Securities_Exchange", "Uganda Securities Exchange", "economy"),

    # ── Law ──────────────────────────────────────────────────────────────────
    ("Constitution_of_Uganda", "Constitution of Uganda", "law"),
    ("Judiciary_of_Uganda", "Judiciary of Uganda", "law"),
    ("Land_tenure_in_Uganda", "Land Tenure in Uganda", "law"),
    ("Law_of_Uganda", "Law of Uganda", "law"),

    # ── Economy & sectors ────────────────────────────────────────────────────
    ("Economy_of_Uganda", "Economy of Uganda", "economy"),
    ("Agriculture_in_Uganda", "Agriculture in Uganda", "strategy"),
    ("Oil_and_gas_industry_in_Uganda", "Oil & Gas in Uganda", "strategy"),
    ("Mining_in_Uganda", "Mining in Uganda", "strategy"),
    ("Telecommunications_in_Uganda", "Telecommunications in Uganda", "economy"),
    ("Energy_in_Uganda", "Energy in Uganda", "strategy"),
    ("Ugandan_shilling", "Ugandan Shilling", "economy"),
    ("Transport_in_Uganda", "Transport in Uganda", "strategy"),

    # ── Regional integration ─────────────────────────────────────────────────
    ("East_African_Community", "East African Community", "treaty"),
    ("COMESA", "Common Market for Eastern and Southern Africa", "treaty"),
    ("African_Continental_Free_Trade_Area", "African Continental Free Trade Area", "treaty"),

    # ── Geography (investment siting) ────────────────────────────────────────
    ("Geography_of_Uganda", "Geography of Uganda", "strategy"),
    ("Districts_of_Uganda", "Districts of Uganda", "government"),
    ("Kampala", "Kampala", "strategy"),
    ("Jinja,_Uganda", "Jinja", "strategy"),
    ("Mbarara", "Mbarara", "strategy"),
    ("Entebbe", "Entebbe", "strategy"),
]


WEB_SOURCES: list[tuple[str, str, str]] = [
    ("https://www.ugandainvest.go.ug", "Uganda Investment Authority", "government"),
    ("https://www.finance.go.ug", "Ministry of Finance, Planning & Economic Development", "government"),
    ("https://www.ura.go.ug", "Uganda Revenue Authority", "tax"),
    ("https://www.bou.or.ug", "Bank of Uganda", "economy"),
    ("https://cmauganda.co.ug", "Capital Markets Authority Uganda", "regulation"),
    ("https://freezones.go.ug", "Uganda Free Zones Authority", "government"),
    ("https://ulii.org", "Uganda Legal Information Institute", "law"),
    ("https://www.npa.go.ug", "National Planning Authority", "strategy"),
]
