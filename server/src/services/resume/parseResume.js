const fs = require("fs");

const pdfParse = require("pdf-parse");

const mammoth = require("mammoth");

const path = require("path");

const parseResume = async (filePath) => {
  const ext = path.extname(filePath);

  // PDF
  if (ext === ".pdf") {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      if (error.message && error.message.includes("bad XRef entry")) {
        throw new Error("This PDF is corrupted or uses an unsupported format. Please open it, click 'Print to PDF' or 'Export as PDF', and try uploading the newly saved version.");
      }
      throw new Error("Could not parse this PDF. Please ensure it is a valid text-based PDF.");
    }
  }

  // DOCX
  if (ext === ".docx") {
    const result =
      await mammoth.extractRawText({
        path: filePath,
      });

    return result.value;
  }

  throw new Error(
    "Unsupported file format"
  );
};

module.exports = parseResume;