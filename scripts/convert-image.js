import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputDir = "data/Products"; // 元の画像を入れるフォルダ
const outputDir = "data/WEBPimages"; // 出力先

fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(inputDir);

for (const file of files) {
  const inputPath = path.join(inputDir, file);
  const baseName = path.parse(file).name;

  // WebP変換
  await sharp(inputPath)
    .webp({ quality: 80 })
    .toFile(path.join(outputDir, `${baseName}.webp`));

  // AVIF変換（オプション）
  await sharp(inputPath)
    .avif({ quality: 50 })
    .toFile(path.join(outputDir, `${baseName}.avif`));

  console.log(`✅ Converted: ${file}`);
}
