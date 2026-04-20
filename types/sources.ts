export interface RetrievedChunk {
  id: string;
  content: string;
  chunk_index: number;
  source_name: string;
  source_url: string | null;
  category: string;
  similarity: number;
}

export interface DataSource {
  name: string;
  url: string;
  category: string;
  format: "html" | "pdf" | "json" | "csv";
  description: string;
}

export const MVP_SOURCES: DataSource[] = [
  {
    name: "Investment Code Act 2019",
    url: "https://www.ugandainvest.go.ug/wp-content/uploads/2020/03/The-Investment-Code-Act-2019.pdf",
    category: "law",
    format: "pdf",
    description: "The principal legislation governing investment in Uganda",
  },
  {
    name: "Public Enterprises Reform & Divestiture (PERD) Act",
    url: "https://ulii.org/akn/ug/act/1993/9/eng@2000-12-31",
    category: "privatization",
    format: "html",
    description: "Framework for divestiture of Uganda's state enterprises",
  },
  {
    name: "Free Zones Act 2014",
    url: "https://ulii.org/akn/ug/act/2014/9/eng@2014-06-13",
    category: "law",
    format: "html",
    description: "Law establishing Uganda's Special Economic Zones regime",
  },
  {
    name: "Income Tax Act Cap. 340",
    url: "https://ulii.org/akn/ug/act/1997/11/eng@2021-12-31",
    category: "tax",
    format: "html",
    description: "Uganda's consolidated income tax statute",
  },
  {
    name: "Uganda Investment Authority",
    url: "https://www.ugandainvest.go.ug",
    category: "government",
    format: "html",
    description: "UIA — licensing, incentives, and investor aftercare",
  },
  {
    name: "Uganda Revenue Authority",
    url: "https://www.ura.go.ug",
    category: "tax",
    format: "html",
    description: "Tax administration and incentive certification",
  },
  {
    name: "Bank of Uganda",
    url: "https://www.bou.or.ug",
    category: "economy",
    format: "html",
    description: "Monetary policy, forex, and financial reports",
  },
  {
    name: "National Development Plan III",
    url: "https://www.npa.go.ug/wp-content/uploads/2020/08/NDPIII-Finale_Compressed.pdf",
    category: "strategy",
    format: "pdf",
    description: "Uganda's medium-term national development framework",
  },
];
