import { existsSync } from "node:fs";
import {
  access,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { isTopicId } from "../lib/words";
import type { Language, Word, WordLanguage } from "../lib/types";

const root = process.cwd();
const voices: Record<
  Language,
  { model: string; directory: string }
> = {
  fa: {
    model: "fa_IR-amir-medium",
    directory: "fa/fa_IR/amir/medium",
  },
  ar: {
    model: "ar_JO-kareem-medium",
    directory: "ar/ar_JO/kareem/medium",
  },
  en: {
    model: "en_US-lessac-medium",
    directory: "en/en_US/lessac/medium",
  },
};

const languages: Language[] = ["fa", "ar", "en"];
const force = process.argv.includes("--force");

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isWordLanguage(value: unknown): value is WordLanguage {
  return (
    isRecord(value) &&
    typeof value.word === "string" &&
    typeof value.audio === "string" &&
    typeof value.sentence === "string"
  );
}

function isWord(value: unknown): value is Word {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.topic === "string" &&
    isTopicId(value.topic) &&
    typeof value.image === "string" &&
    typeof value.icon === "string" &&
    (value.count === undefined || typeof value.count === "number") &&
    (value.color === undefined || typeof value.color === "string") &&
    languages.every((language) => isWordLanguage(value[language]))
  );
}

function parseWords(value: unknown, file: string): Word[] {
  if (!Array.isArray(value)) {
    throw new Error(`${file} must contain a JSON array.`);
  }
  return value.map((item, index) => {
    if (!isWord(item)) {
      throw new Error(`${file}[${index}] is not a valid trilingual word.`);
    }
    return item;
  });
}

async function exists(file: string): Promise<boolean> {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function downloadModel(language: Language): Promise<string> {
  const voice = voices[language];
  const modelDirectory = path.join(root, "models", "piper", voice.model);
  await mkdir(modelDirectory, { recursive: true });

  for (const extension of ["onnx", "onnx.json"] as const) {
    const fileName = `${voice.model}.${extension}`;
    const target = path.join(modelDirectory, fileName);
    if (await exists(target)) continue;

    const url = `https://huggingface.co/rhasspy/piper-voices/resolve/main/${voice.directory}/${fileName}`;
    console.info(`Downloading ${fileName} from Hugging Face…`);
    const response = await fetch(url);
    if (!response.ok || !response.body) {
      throw new Error(`Could not download ${fileName}: HTTP ${response.status}`);
    }
    const temporary = `${target}.download`;
    try {
      await writeFile(temporary, Buffer.from(await response.arrayBuffer()));
      await rename(temporary, target);
    } catch (error) {
      await rm(temporary, { force: true });
      throw error;
    }
  }
  return path.join(modelDirectory, `${voice.model}.onnx`);
}

function run(
  command: string,
  args: string[],
  input?: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["pipe", "ignore", "inherit"] });
    child.once("error", (error) => {
      reject(
        new Error(
          `Could not start "${command}". Install Piper TTS and FFmpeg, then retry.`,
          { cause: error },
        ),
      );
    });
    child.once("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`"${command}" exited with code ${code ?? "unknown"}.`));
    });
    child.stdin.end(input);
  });
}

async function generateClip(
  text: string,
  language: Language,
  model: string,
  destination: string,
): Promise<void> {
  if (!force && (await exists(destination))) return;
  await mkdir(path.dirname(destination), { recursive: true });
  const temporaryWav = `${destination}.${process.pid}.wav`;
  const temporaryMp3 = `${destination}.${process.pid}.tmp.mp3`;
  try {
    await run(
      "piper",
      ["--model", model, "--output_file", temporaryWav],
      `${text}\n`,
    );
    await run("ffmpeg", [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      temporaryWav,
      "-ac",
      "1",
      "-ar",
      "22505",
      "-b:a",
      "80k",
      temporaryMp3,
    ]);
    await rename(temporaryMp3, destination);
    console.info(`Created ${path.relative(root, destination)}`);
  } finally {
    await rm(temporaryWav, { force: true });
    await rm(temporaryMp3, { force: true });
  }
}

async function main() {
  await run("piper", ["--help"]);
  await run("ffmpeg", ["-version"]);

  const wordsDirectory = path.join(root, "data", "words");
  const files = (await readdir(wordsDirectory)).filter((file) =>
    file.endsWith(".json"),
  );
  if (files.length === 0) throw new Error("No word JSON files were found.");

  const wordsByFile = await Promise.all(
    files.map(async (file) => {
      const content = await readFile(path.join(wordsDirectory, file), "utf8");
      return parseWords(JSON.parse(content) as unknown, file);
    }),
  );
  const words = wordsByFile.flat();
  const models = new Map<Language, string>();

  for (const language of languages) {
    const needsGeneration = words.some((word) => {
      const base = path.join(root, "public", "audio", language, word.topic, word.id);
      return force || !existsSync(`${base}.mp3`) || !existsSync(`${base}-sentence.mp3`);
    });
    if (needsGeneration) models.set(language, await downloadModel(language));
  }

  for (const word of words) {
    for (const language of languages) {
      const model = models.get(language);
      if (!model) continue;
      const entry = word[language];
      const base = path.join(
        root,
        "public",
        "audio",
        language,
        word.topic,
        word.id,
      );
      await generateClip(entry.word, language, model, `${base}.mp3`);
      await generateClip(
        entry.sentence,
        language,
        model,
        `${base}-sentence.mp3`,
      );
    }
  }
}

main().catch((error: unknown) => {
  console.error("Audio generation failed.", error);
  process.exitCode = 1;
});
