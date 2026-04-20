-- Dynamic categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,                -- e.g. 'law', 'tax'
  label text NOT NULL,                      -- e.g. 'Law', 'Tax'
  keywords text[] NOT NULL DEFAULT '{}',    -- keywords for auto-detection
  prompt text,                              -- additional system prompt guidance
  high_stakes boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Seed with Atlas AI (Uganda investment) categories
INSERT INTO categories (name, label, keywords, prompt, high_stakes, sort_order) VALUES
  ('law', 'Law',
   ARRAY['act','code','section','constitution','statute','regulation','bill','ordinance','ulii','law'],
   'When answering legal questions, always reference the specific Act, section, or article number and date of amendment. State that the information is for guidance only — investors should consult a qualified Ugandan advocate for their matter.',
   true, 1),
  ('tax', 'Tax',
   ARRAY['tax','vat','income tax','withholding','duty','incentive','holiday','capital allowance','excise','ura'],
   'For tax questions, cite the governing Act (Income Tax Act, VAT Act, EACCMA, etc.) and the specific section. Distinguish statutory rates from sector-specific incentives. Note that eligibility for an incentive requires confirmation from URA / UIA.',
   true, 2),
  ('privatization', 'Privatization',
   ARRAY['privatisation','privatization','divestiture','perd','state enterprise','parastatal','sale','auction','concession'],
   'Reference the PERD Act framework. Identify the enterprise, the divestiture stage, the advising transaction advisor if known, and the lead institution (Ministry of Finance, Privatisation Unit). Never speculate on timelines or prices.',
   true, 3),
  ('regulation', 'Regulation',
   ARRAY['license','licence','permit','registration','uia','cma','ursb','regulatory','compliance'],
   'Provide step-by-step procedures with the responsible institution (UIA, URSB, URA, CMA, NEMA), required forms, typical timelines, and official fees.',
   true, 4),
  ('government', 'Government',
   ARRAY['ministry','authority','agency','government','mda','cabinet','policy','directive'],
   'Identify the responsible MDA clearly and include official contact details (website, physical office) where known.',
   false, 5),
  ('economy', 'Economy',
   ARRAY['gdp','inflation','economy','trade','export','import','shilling','forex','bou','debt','fdi'],
   'Use the most recent data available and always state the period it refers to. Prefer Bank of Uganda and MoFPED data over third-party aggregators.',
   false, 6),
  ('strategy', 'Sector Strategy',
   ARRAY['strategy','ndp','vision','sector','priority','investment prospectus','agro-processing','textile','minerals','oil','gas','tourism'],
   'Anchor sector commentary in NDP III, Vision 2040, and gazetted sector strategies. Quantify where data is available.',
   false, 7),
  ('treaty', 'Treaties',
   ARRAY['bilateral','bit','dtaa','double taxation','treaty','agreement','miga','icsid','comesa','eac'],
   'Identify the treaty counterpart, signing year, and whether ratified and in force. Cite the specific article for protections invoked.',
   true, 8)
ON CONFLICT (name) DO NOTHING;
