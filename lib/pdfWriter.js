import fs from 'fs';
import PDFDocument from 'pdfkit';

export function writeTreeToPdf(treeText, outputPath = 'route-tree.pdf') {
    const doc = new PDFDocument({margin: 40, size: 'A4'});

    doc.pipe(fs.createWriteStream(outputPath));

    doc.font('Courier')
        .fontSize(10)
        .fillColor('black')
        .text(treeText, {
            lineGap: 2,
        });

    doc.end();
    console.log(`PDF saved to: ${outputPath}`);
}