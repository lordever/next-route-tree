#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import {buildRouteTree} from '../lib/treeBuilder.js';
import {writeTreeToPdf} from '../lib/pdfWriter.js';

const inputPath = process.argv[2] || './app';
const includeApi = process.argv.includes('--include-api');
const outputPdf = process.argv.includes('--pdf');

const resolvedPath = path.resolve(process.cwd(), inputPath);
const OUTPUT_PATH = 'route-tree.pdf'

buildRouteTree(resolvedPath, { skipApi: !includeApi, pdf: outputPdf })
    .then(treeText => {
        if (outputPdf) {
            if (fs.existsSync(OUTPUT_PATH)) {
                fs.unlinkSync(OUTPUT_PATH);
                console.log(`Removed existing ${OUTPUT_PATH}`);
            }
            writeTreeToPdf(treeText, OUTPUT_PATH);
        } else {
            console.log(treeText);
        }
    })
    .catch(err => {
        console.error('Failed to build route tree:', err);
    });