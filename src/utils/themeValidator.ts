import fs from 'node:fs';
import path from 'node:path';

export interface ThemeAuditResult {
  valid: boolean;
  fileCount: number;
  jsonFilesChecked: string[];
  schemaSectionsChecked: string[];
  errors: string[];
}

const REQUIRED_PATHS = [
  'layout/theme.liquid',
  'config/settings_schema.json',
  'config/settings_data.json',
  'locales/en.default.json',
  'locales/en.default.schema.json',
  'assets/theme.css',
  'assets/theme.js',
  'assets/school-decor-logo.png',
  'templates/index.json',
  'templates/product.json',
  'templates/collection.json',
  'templates/list-collections.json',
  'templates/cart.json',
  'templates/page.json',
  'templates/search.json',
  'templates/blog.json',
  'templates/article.json',
  'templates/404.json',
  'templates/page.about-us.json',
  'templates/page.contact.json',
  'templates/page.projects.json',
  'templates/page.project-detail.json',
  'templates/page.faq.json',
  'templates/page.request-quote.json',
  'templates/page.privacy-policy.json',
  'templates/page.terms-and-conditions.json',
  'templates/page.shipping-returns.json',
  'README.md',
];

function walkFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const results: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

export function auditShopifyTheme(themeRoot: string): ThemeAuditResult {
  const errors: string[] = [];
  const jsonFilesChecked: string[] = [];
  const schemaSectionsChecked: string[] = [];

  if (!fs.existsSync(themeRoot)) {
    return {
      valid: false,
      fileCount: 0,
      jsonFilesChecked,
      schemaSectionsChecked,
      errors: [`Theme directory not found: ${themeRoot}`],
    };
  }

  for (const reqPath of REQUIRED_PATHS) {
    if (!fs.existsSync(path.join(themeRoot, reqPath))) {
      errors.push(`Missing required Shopify OS 2.0 file: ${reqPath}`);
    }
  }

  const allFiles = walkFiles(themeRoot);

  for (const filePath of allFiles) {
    const rel = path.relative(themeRoot, filePath);
    if (rel.endsWith('.json')) {
      jsonFilesChecked.push(rel);
      try {
        JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (err) {
        errors.push(`Invalid JSON in ${rel}: ${(err as Error).message}`);
      }
    }

    if (rel.endsWith('.liquid')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const stripped = content
        .replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '')
        .replace(/\{%-?\s*schema\s*-?%\}[\s\S]*?\{%-?\s*endschema\s*-?%\}/g, '');
      const checks: [RegExp, RegExp, string][] = [
        [/\{%-?\s*if\b/g, /\{%-?\s*endif\b/g, 'if/endif'],
        [/\{%-?\s*unless\b/g, /\{%-?\s*endunless\b/g, 'unless/endunless'],
        [/\{%-?\s*for\b/g, /\{%-?\s*endfor\b/g, 'for/endfor'],
        [/\{%-?\s*case\b/g, /\{%-?\s*endcase\b/g, 'case/endcase'],
      ];
      for (const [openRe, closeRe, pairName] of checks) {
        const openCount = (stripped.match(openRe) || []).length;
        const closeCount = (stripped.match(closeRe) || []).length;
        if (openCount !== closeCount) {
          errors.push(`Unbalanced Liquid ${pairName} tags in ${rel}: ${openCount} open vs ${closeCount} close`);
        }
      }
    }

    if (rel.startsWith('sections' + path.sep) && rel.endsWith('.liquid')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const match = content.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
      if (!match) {
        errors.push(`Missing {% schema %} block in ${rel}`);
      } else {
        schemaSectionsChecked.push(rel);
        try {
          const schemaObj = JSON.parse(match[1]);
          if (!schemaObj.name) {
            errors.push(`Schema missing "name" in ${rel}`);
          }
        } catch (err) {
          errors.push(`Invalid schema JSON in ${rel}: ${(err as Error).message}`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    fileCount: allFiles.length,
    jsonFilesChecked,
    schemaSectionsChecked,
    errors,
  };
}
