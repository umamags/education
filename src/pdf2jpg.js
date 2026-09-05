import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { convert } from 'pdf2pic';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const booksDir = path.join(__dirname, '../books');
const imagesBaseDir = path.join(__dirname, '../images');
const dpis = [72, 150, 300];

const DPI_CONFIG = {
  72: { density: 72, quality: 80 },
  150: { density: 150, quality: 85 },
  300: { density: 300, quality: 90 },
};

let statsLog = {
  processed: 0,
  skipped: 0,
  errors: 0,
};

async function convertPdfToJpg(pdfPath, relativePath) {
  try {
    const pdfName = path.basename(pdfPath, '.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);

    console.log(`\n📄 Processing: ${relativePath}`);

    for (const dpi of dpis) {
      const outputDir = path.join(imagesBaseDir, `${dpi}dpi`, path.dirname(relativePath), pdfName);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      try {
        const options = {
          density: DPI_CONFIG[dpi].density,
          savefilename: 'page',
          savedir: outputDir,
          format: 'jpeg',
          quality: DPI_CONFIG[dpi].quality,
        };

        const converter = convert(options);
        const result = await converter.bulk([pdfPath], { checkBulkConvert: true });

        const pageCount = result[0].page;
        console.log(`   Pages extracted: ${pageCount}`);

        for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
          const oldName = path.join(outputDir, `page.${pageNum}.jpeg`);
          const newName = path.join(outputDir, `page${pageNum}.jpg`);

          if (fs.existsSync(oldName)) {
            fs.renameSync(oldName, newName);
            console.log(`   ✓ [${dpi}dpi] Page ${pageNum}: SAVED`);
            statsLog.processed++;
          }
        }
      } catch (error) {
        if (error.message.includes('exists')) {
          console.log(`   ⏭️  [${dpi}dpi] All pages: SKIPPED (exist)`);
          const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.jpg'));
          statsLog.skipped += files.length;
        } else {
          console.error(`   ✗ [${dpi}dpi]: ERROR - ${error.message}`);
          statsLog.errors++;
        }
      }
    }
  } catch (error) {
    console.error(`\n❌ Error processing ${pdfPath}: ${error.message}`);
    statsLog.errors++;
  }
}

async function scanAndConvert(dir, baseDir = '') {
  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      const relativePath = path.join(baseDir, file);

      if (stat.isDirectory()) {
        await scanAndConvert(fullPath, relativePath);
      } else if (file.toLowerCase().endsWith('.pdf')) {
        await convertPdfToJpg(fullPath, relativePath);
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Starting PDF to JPG Conversion');
  console.log(`📁 Books directory: ${booksDir}`);
  console.log(`📸 Output directory: ${imagesBaseDir}`);
  console.log(`📊 DPI levels: ${dpis.join(', ')}`);
  console.log('─'.repeat(60));

  if (!fs.existsSync(booksDir)) {
    console.error(`\n❌ Books directory not found: ${booksDir}`);
    process.exit(1);
  }

  const startTime = Date.now();

  try {
    await scanAndConvert(booksDir);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n' + '─'.repeat(60));
    console.log('✅ Conversion Complete!');
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`📊 Stats:`);
    console.log(`   Processed: ${statsLog.processed}`);
    console.log(`   Skipped: ${statsLog.skipped}`);
    console.log(`   Errors: ${statsLog.errors}`);
    console.log('─'.repeat(60));
  } catch (error) {
    console.error(`\n❌ Fatal error: ${error.message}`);
    process.exit(1);
  }
}

main();
