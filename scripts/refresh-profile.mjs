// Save validated images so visitors never depend on a live widget service.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const user = '3nadh3';
await mkdir(`${root}assets`, { recursive: true });
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(45000), headers: { 'User-Agent': '3nadh3-profile-refresh' } });
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${new URL(url).hostname}`);
  return response.text();
}

async function refresh(name, generate) {
  try {
    const svg = await generate();
    if (!svg.includes('<svg') || /Something went wrong|Maximum retries|API rate limit|Application error|Error fetching/i.test(svg)) {
      throw new Error('Image contains an error instead of statistics');
    }
    await writeFile(`${root}assets/${name}.svg`, svg);
    console.log(`Updated ${name}`);
  } catch (error) {
    // Keep the last successful card during an upstream outage.
    const previous = await readFile(`${root}assets/${name}.svg`, 'utf8').catch(() => null);
    if (!previous?.includes('<svg')) throw error;
    console.warn(`Kept previous ${name}: ${error.message}`);
  }
}

async function activityGraph() {
  const html = await get(`https://github.com/users/${user}/contributions`);
  const days = new Map();
  for (const match of html.matchAll(/<td\b([^>]*\bdata-date="\d{4}-\d{2}-\d{2}"[^>]*)>/g)) {
    const date = match[1].match(/data-date="([^"]+)"/)?.[1];
    const id = match[1].match(/\bid="([^"]+)"/)?.[1];
    if (date && id) days.set(id, { date, count: null });
  }
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = match[1].match(/\bfor="([^"]+)"/)?.[1];
    const day = days.get(id);
    if (!day) continue;
    const count = match[2].match(/(?:^|>)([\d,]+) contributions? on/);
    if (count) day.count = Number(count[1].replaceAll(',', ''));
    else if (/No contributions on/.test(match[2])) day.count = 0;
  }
  const ordered = [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
  if (ordered.length < 350 || ordered.some(day => day.count === null)) throw new Error('Incomplete GitHub contribution calendar');
  const expected = html.match(/id="js-contribution-activity-description"[^>]*>\s*([\d,]+)\s+contributions?/);
  const total = ordered.reduce((sum, day) => sum + day.count, 0);
  if (!expected || total !== Number(expected[1].replaceAll(',', ''))) throw new Error('Contribution counts do not match GitHub');
  const recent = ordered.slice(-90);
  const max = Math.max(1, ...recent.map(day => day.count));
  const left = 54, top = 80, width = 886, height = 166, bottom = top + height;
  const x = i => left + i * width / (recent.length - 1);
  const y = count => bottom - count * height / max;
  const points = recent.map((day, i) => `${x(i).toFixed(2)},${y(day.count).toFixed(2)}`).join(' ');
  const grid = [0, 0.5, 1].map(fraction => `<line x1="${left}" y1="${y(max * fraction)}" x2="940" y2="${y(max * fraction)}" stroke="#2c263b"/><text x="38" y="${y(max * fraction) + 4}" text-anchor="end" fill="#a6a1b8" font-size="12">${(max * fraction).toFixed(fraction === 0.5 && max % 2 ? 1 : 0)}</text>`).join('');
  const labels = [0, 29, 59, 89].map(i => `<text x="${x(i)}" y="270" text-anchor="${i === 0 ? 'start' : i === 89 ? 'end' : 'middle'}" fill="#a6a1b8" font-size="12">${escape(recent[i].date)}</text>`).join('');
  const dots = recent.map((day, i) => `<circle cx="${x(i)}" cy="${y(day.count)}" r="2.5" fill="#f85d7f"><title>${day.date}: ${day.count} contributions</title></circle>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="980" height="320" viewBox="0 0 980 320" role="img" aria-labelledby="title description"><title id="title">Trinadh's Contribution Graph</title><desc id="description">Daily contributions for ${recent[0].date} through ${recent.at(-1).date}, from GitHub's public calendar. ${total} contributions in the last year.</desc><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f85d7f" stop-opacity=".38"/><stop offset="1" stop-color="#f85d7f" stop-opacity=".02"/></linearGradient></defs><rect width="980" height="320" rx="12" fill="#141321"/><g font-family="Arial, sans-serif"><text x="30" y="34" fill="#f85d7f" font-size="21" font-weight="700">Trinadh's Contribution Graph</text><text x="30" y="56" fill="#a6a1b8" font-size="13">Last 90 days · ${total} contributions in the last year</text>${grid}<polygon points="${left},${bottom} ${points} 940,${bottom}" fill="url(#area)"/><polyline points="${points}" fill="none" stroke="#f85d7f" stroke-width="2" stroke-linejoin="round"/>${dots}${labels}<text x="30" y="300" fill="#a6a1b8" font-size="12">Source: GitHub public contribution calendar · Updated ${recent.at(-1).date}</text></g></svg>`;
}

await refresh('contribution-graph', activityGraph);
await refresh('github-stats', () => get(`https://github-readme-stats.vercel.app/api?username=${user}&show_icons=true&theme=radical`));
await refresh('github-streak', () => get(`https://github-readme-streak-stats.herokuapp.com/?user=${user}&theme=radical`));
await refresh('github-summary', () => get(`https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=${user}&theme=radical`));
