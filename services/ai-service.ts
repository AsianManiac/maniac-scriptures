import { useAiStore } from "@/stores/ai-store";
import { VerseReference } from "@/types/bible";
import { sanitizeKey } from "@/utils/lib";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

const API_KEY = "AIzaSyAwqdKNiizbPFQpuyHO9rRUMXXKSmWmaK0";
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ],
});

export async function generateNoteFromVerse(
  verseText: string,
  options: {
    tone?: "reflective" | "inspirational" | "analytical";
    length?: "short" | "medium" | "long";
  } = {}
): Promise<string> {
  const rawKey = `note_${verseText}_${options.tone || "reflective"}_${
    options.length || "medium"
  }`;
  const cacheKey = sanitizeKey(rawKey);
  const cached = await useAiStore.getState().getCachedResult(cacheKey);
  if (cached) return cached;

  const prompt = `
    Generate a thoughtful note based on this Bible verse: "${verseText}".
    Tone: ${options.tone || "reflective"}.
    Length: ${
      options.length || "medium"
    } (short: 50-100 words, medium: 150-250, long: 300+).
    Make it personal, insightful, and encouraging. Include key takeaways and application to daily life.
    Output ONLY the note text.
  `;

  try {
    const result = await model.generateContent(prompt);
    const note = result.response.text().trim();
    await useAiStore.getState().cacheResult(cacheKey, note);
    return note;
  } catch (error) {
    console.error("AI Note Generation Error:", error);
    throw new Error("Failed to generate note. Please try again.");
  }
}

export async function fetchDevotionals(
  category?: string,
  date: string = new Date().toISOString().split("T")[0]
): Promise<
  {
    id: string;
    title: string;
    content: string;
    verseReference: VerseReference;
    verseText: string;
    category: string;
    date: string;
    sourceLink?: string;
  }[]
> {
  const cacheKey = sanitizeKey(`devotions_${category || "general"}_${date}`);
  const cached = await useAiStore.getState().getCachedResult(cacheKey);
  if (cached) return JSON.parse(cached);

  // If category is "Open Heavens", fetch the real one for today as the first, generate others
  let devotions = [];
  if (category === "Open Heavens") {
    try {
      const todayOpenHeavens = await fetchDailyOpenHeavens(date);
      devotions.push(todayOpenHeavens);
    } catch (error) {
      console.warn("Failed to fetch real Open Heavens, generating similar.");
    }
  }

  // Generate remaining (up to 5 total)
  const numToGenerate = 5 - devotions.length;
  if (numToGenerate > 0) {
    const prompt = `
      Provide ${numToGenerate} real daily devotions similar to "Open Heavens" for date ${date}.
      Category: ${category || "general"}.
      For each: Include title, full content (200-400 words), Bible verse reference (e.g., John 3:16), verse text, and if possible a source link.
      Ensure they are inspirational, Bible-based.
      Output as JSON array of objects: [{id: string, title: string, content: string, verseReference: {book: string, chapter: number, verse: number}, verseText: string, category: string, date: string, sourceLink?: string}]
    `;

    try {
      const result = await model.generateContent(prompt);
      const jsonText = result.response.text().trim();
      const generated = JSON.parse(jsonText);
      devotions = [...devotions, ...generated];
    } catch (error) {
      console.error("AI Devotions Generation Error:", error);
      throw new Error("Failed to fetch/generate devotions. Please try again.");
    }
  }

  await useAiStore.getState().cacheResult(cacheKey, JSON.stringify(devotions));
  return devotions;
}

export async function fetchDailyOpenHeavens(
  date: string = new Date().toISOString().split("T")[0] // YYYY-MM-DD
): Promise<{
  id: string;
  title: string;
  content: string;
  verseReference: VerseReference;
  verseText: string;
  category: string;
  date: string;
  sourceLink?: string;
}> {
  const cacheKey = sanitizeKey(`daily_openheavens_${date}`);
  const cached = await useAiStore.getState().getCachedResult(cacheKey);
  if (cached) return JSON.parse(cached);

  try {
    // Construct URL dynamically
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj
      .toLocaleString("default", { month: "long" })
      .toLowerCase();
    const year = dateObj.getFullYear();
    const url = `https://rccgonline.org/open-heaven-${day}-${month}-${year}/`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch Open Heavens page.");

    const html = await response.text();

    // Use Gemini to parse the HTML into structured devotional
    const prompt = `
      Extract the full Open Heavens devotional from this HTML content.
      Include:
      - title: The main title
      - content: The full message body, action point, and hymn (concatenated with headings like "Message:", "Action Point:", "Hymn:")
      - verseReference: Parse from memorise (e.g., {book: "Isaiah", chapter: 55, verse: 11})
      - verseText: The full memorise verse text
      - category: "Open Heavens"
      - date: "${date}"
      - sourceLink: "${url}"
      Also include Bible in One Year if present, append to content.
      Output ONLY as JSON object: {id: "${date}_openheavens", title: "...", content: "...", verseReference: {...}, verseText: "...", category: "...", date: "...", sourceLink: "..."}
    `;

    const result = await model.generateContent([prompt, { text: html }]); // Pass HTML as additional content
    const jsonText = result.response.text().trim();
    const devotional = JSON.parse(jsonText);

    await useAiStore
      .getState()
      .cacheResult(cacheKey, JSON.stringify(devotional));
    return devotional;
  } catch (error) {
    console.error("Open Heavens Fetch Error:", error);
    // Fallback: Generate similar
    const fallback = await fetchDevotionals("Open Heavens", date);
    return fallback[0]; // Take first generated as fallback
  }
}

export async function fetchDailyVerse(
  date: string = new Date().toISOString().split("T")[0], // YYYY-MM-DD
  version: string = "KJV"
): Promise<{
  text: string;
  reference: VerseReference;
}> {
  const cacheKey = sanitizeKey(`daily_verse_${date}_${version}`);
  const cached = await useAiStore.getState().getCachedResult(cacheKey);
  if (cached) return JSON.parse(cached);

  try {
    const url = `https://www.biblegateway.com/reading-plans/verse-of-the-day/${date.replace(
      /-/g,
      "/"
    )}?version=${version}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch daily verse page.");

    const html = await response.text();

    // Use Gemini to parse
    const prompt = `
      Extract the Verse of the Day from this HTML.
      Include:
      - text: The full verse text
      - reference: {book: string, chapter: number, verse: number} (parse from reference, take first verse if range)
      Output ONLY as JSON: {text: "...", reference: {book: "...", chapter: number, verse: number}}
    `;

    const result = await model.generateContent([prompt, { text: html }]);
    const jsonText = result.response.text().trim();
    const verse = JSON.parse(jsonText);

    await useAiStore.getState().cacheResult(cacheKey, JSON.stringify(verse));
    return verse;
  } catch (error) {
    console.error("Daily Verse Fetch Error:", error);
    // Fallback: Generate a random inspirational verse using AI
    const fallbackPrompt = `Provide a random inspirational Bible verse for ${date}. Output as JSON: {text: "verse text", reference: {book: "book", chapter: number, verse: number}}`;
    const result = await model.generateContent(fallbackPrompt);
    const jsonText = result.response.text().trim();
    const verse = JSON.parse(jsonText);
    await useAiStore.getState().cacheResult(cacheKey, JSON.stringify(verse));
    return verse;
  }
}

export async function generateHomeMessage(
  userName: string,
  recentVerse?: string
): Promise<string> {
  const cacheKey = `home_msg_${userName}_${recentVerse || ""}`;
  const cached = await useAiStore.getState().getCachedResult(cacheKey);
  if (cached) return cached;

  const prompt = `
    Generate a warm, encouraging greeting for a Bible app home screen.
    User: ${userName}.
    ${recentVerse ? `Reference their recent verse: "${recentVerse}".` : ""}
    Keep it 1-2 sentences, inspirational.
    Output ONLY the message.
  `;

  try {
    const result = await model.generateContent(prompt);
    const message = result.response.text().trim();
    useAiStore.getState().cacheResult(cacheKey, message);
    return message;
  } catch (error) {
    return "Welcome back! Let's dive into God's Word today.";
  }
}

// Add more methods as needed, e.g.
export async function explainVerse(verseText: string): Promise<string> {
  // Similar to generateNote, but explanatory
  return verseText;
}

// Parent method example: Deep analysis using explainVerse as base
export async function deepVerseAnalysis(verseText: string): Promise<string> {
  const explanation = await explainVerse(verseText);
  const prompt = `Provide deeper analysis on: "${explanation}". Include historical context, applications.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}
