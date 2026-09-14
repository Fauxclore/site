
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

// Resolve paths correctly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PT_DIR = path.resolve(__dirname, 'src/blog');
const EN_DIR = path.resolve(__dirname, 'src/en/blog');
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
const MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:7b';

async function translateContent(content) {
  const prompt = `Translate the following markdown body from Portuguese to English.
Rules:
1. Keep all markdown syntax exactly as-is (headings, lists, links, images, code blocks).
2. Translate only visible text. Do not modify frontmatter keys or structure.
3. Return ONLY the translated markdown text. No explanations, no triple backticks, no extra whitespace.

CONTENT:
${content}`;

  try {
    const res = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        options: { temperature: 0.1, num_ctx: 16384 } // Matches your env var setting
      })
    });

    if (!res.ok) throw new Error(`Ollama API error: ${res.status} ${res.statusText}`);

    const data = await res.json();
    return (data.response || '').trim();
  } catch (error) {
    throw new Error(`Translation failed: ${error.message}`);
  }
}

async function main() {
  // Create EN dir if it doesn't exist
  await fs.mkdir(EN_DIR, { recursive: true });

  // Get all .md files in PT_DIR
  const files = await fs.readdir(PT_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  if (mdFiles.length === 0) {
    console.log('⚠️ No markdown files found in', PT_DIR);
    return;
  }

  console.log(`🔍 Found ${mdFiles.length} PT markdown files. Starting translation...\n`);

  for (const file of mdFiles) {
    const ptPath = path.join(PT_DIR, file);
    const enPath = path.join(EN_DIR, file);

    try {
      console.log(`🔄 Translating: ${file}`);
      const raw = await fs.readFile(ptPath, 'utf8');

      // Parse frontmatter & body
      const { data, content } = matter(raw);

      // Translate only the body content
      const translatedBody = await translateContent(content);

      // Reconstruct markdown with original frontmatter preserved
      const newFileContent = matter.stringify(translatedBody, data);

      await fs.writeFile(enPath, newFileContent, 'utf8');
      console.log(`✅ Completed: ${file}`);
    } catch (error) {
      console.error(`❌ Failed to translate ${file}:`, error.message);
    }

    // Small delay to prevent overwhelming Ollama's CPU/GPU
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n🎉 Translation process finished!');
}

main().catch(console.error);