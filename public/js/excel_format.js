// /**
//  * Excel Formatter Configuration & Logic
//  * This file handles the styling and structure for Excel exports using ExcelJS.
//  */

// const EXCEL_STYLE = {
//     colors: {
//         primary: 'FFE60026', // Cakra Red
//         textWhite: 'FFFFFFFF',
//         totalBlue: 'FF007BFF',
//         border: 'FF000000'
//     },
//     fonts: {
//         title: { name: 'Arial Black', size: 16, bold: true },
//         header: { color: { argb: 'FFFFFFFF' }, bold: true },
//         bold: { bold: true },
//         totalValue: { bold: true, color: { argb: 'FF007BFF' } }
//     },
//     columnWidths: {
//         no: 5,
//         description: 35,
//         specification: 30,
//         qty: 8,
//         unit: 8,
//         price: 20,
//         total: 20
//     }
// };

// const ExcelFormatter = {
//     /**
//      * Generates a professionally formatted Offer Excel file.
//      * @param {Object} data - Information about the project and items
//      * @param {string} data.projectName - Name of the project
//      * @param {string} data.customer - Customer name
//      * @param {Array} data.items - List of items to export
//      * @param {number} data.totalHarga - Grand total of the offer
//      */
//     async generateOfferExcel(data) {
//         const { projectName, customer, items, totalHarga } = data;
//         const workbook = new ExcelJS.Workbook();
//         const worksheet = workbook.addWorksheet('Penawaran');

//         // 1. HEADER TITLE
//         worksheet.mergeCells('A1:G1');
//         const titleCell = worksheet.getCell('A1');
//         titleCell.value = 'SURAT PENAWARAN HARGA';
//         titleCell.font = EXCEL_STYLE.fonts.title;
//         titleCell.alignment = { horizontal: 'center' };

//         worksheet.addRow([]); // Spacer

//         // 2. PROJECT INFO SECTION
//         const projectInfo = [
//             ['PROJECT NAME', projectName],
//             ['CUSTOMER', customer],
//             ['DATE', new Date().toLocaleDateString('id-ID')],
//         ];

//         projectInfo.forEach(info => {
//             const row = worksheet.addRow([info[0], '', info[1]]);
//             worksheet.mergeCells(`A${row.number}:B${row.number}`);
//             worksheet.getCell(`A${row.number}`).font = EXCEL_STYLE.fonts.bold;
//         });

//         worksheet.addRow([]); // Spacer

//         // 3. TABLE HEADERS
//         const headerTitles = ['NO', 'ITEM DESCRIPTION', 'SPECIFICATION', 'QTY', 'UNIT', 'UNIT PRICE', 'TOTAL PRICE'];
//         const headerRow = worksheet.addRow(headerTitles);

//         headerRow.eachCell((cell) => {
//             cell.fill = {
//                 type: 'pattern',
//                 pattern: 'solid',
//                 fgColor: { argb: EXCEL_STYLE.colors.primary }
//             };
//             cell.font = EXCEL_STYLE.fonts.header;
//             cell.alignment = { horizontal: 'center', vertical: 'middle' };
//             this._applyBorder(cell);
//         });

//         // 4. DATA ROWS
//         items.forEach((item, i) => {
//             const desc = item.nama_panel || item.description || item.name || '-';
//             const spec = item.tipe_ukuran || item.specification || '-';
//             const qty = parseFloat(item.qty || item.quantity || 0);
//             const unit = item.satuan || item.unit || 'pcs';
//             const price = parseFloat(item.harga_setelah_disc_rp || item.price || 0);
//             const total = item.row_total || (qty * price);

//             const rowData = [i + 1, desc, spec, qty, unit, price, total];
//             const row = worksheet.addRow(rowData);

//             row.eachCell((cell, colNumber) => {
//                 this._applyBorder(cell);

//                 // Formatting based on column content
//                 if (colNumber === 6 || colNumber === 7) { // Price columns
//                     cell.numFmt = '"Rp" #,##0';
//                     cell.alignment = { horizontal: 'right' };
//                 } else if ([1, 4, 5].includes(colNumber)) { // No, Qty, Unit columns
//                     cell.alignment = { horizontal: 'center' };
//                 }
//             });
//         });

//         // 5. GRAND TOTAL ROW
//         const totalRow = worksheet.addRow(['', '', '', '', '', 'GRAND TOTAL', totalHarga]);
//         totalRow.getCell(6).font = EXCEL_STYLE.fonts.bold;
//         totalRow.getCell(7).font = EXCEL_STYLE.fonts.totalValue;
//         totalRow.getCell(7).numFmt = '"Rp" #,##0';

//         // Apply borders specifically for the total row
//         for (let i = 1; i <= 7; i++) {
//             this._applyBorder(totalRow.getCell(i));
//         }

//         // 6. SETUP COLUMN WIDTHS
//         worksheet.getColumn(1).width = EXCEL_STYLE.columnWidths.no;
//         worksheet.getColumn(2).width = EXCEL_STYLE.columnWidths.description;
//         worksheet.getColumn(3).width = EXCEL_STYLE.columnWidths.specification;
//         worksheet.getColumn(4).width = EXCEL_STYLE.columnWidths.qty;
//         worksheet.getColumn(5).width = EXCEL_STYLE.columnWidths.unit;
//         worksheet.getColumn(6).width = EXCEL_STYLE.columnWidths.price;
//         worksheet.getColumn(7).width = EXCEL_STYLE.columnWidths.total;

//         // 7. FINALIZE & DOWNLOAD
//         const buffer = await workbook.xlsx.writeBuffer();
//         const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//         saveAs(blob, `Penawaran_${projectName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`);
//     },

//     /**
//      * Private helper to apply consistent borders.
//      * @private
//      */
//     _applyBorder(cell) {
//         cell.border = {
//             top: { style: 'thin' },
//             left: { style: 'thin' },
//             bottom: { style: 'thin' },
//             right: { style: 'thin' }
//         };
//     }
// };

// window.ExcelFormatter = ExcelFormatter;



/**
 * Excel Formatter — Surat Penawaran Harga
 * PT. Cakra Raya Teknologi
 *
 * Handles all styling and structure for Excel export using ExcelJS.
 * Usage: ExcelFormatter.generateOfferExcel(data)
 */

const EXCEL_STYLE = {
    colors: {
        headerBg: 'FFD0D8E8', // Table header blue-grey
        grandTotalBg: 'FFD0E8D0', // Grand total green
        white: 'FFFFFFFF',
        black: 'FF000000',
    },
    fonts: {
        companyName: { name: 'Calibri', size: 14, bold: true },
        normal: { name: 'Calibri', size: 11 },
        bold: { name: 'Calibri', size: 11, bold: true },
        tableHeader: { name: 'Calibri', size: 11, bold: true },
        grandTotal: { name: 'Calibri', size: 12, bold: true },
    },
    border: {
        thin: { style: 'thin' },
    },
    columnWidths: {
        A: 5,    // No.
        B: 7,    // Qty
        C: 8,    // Satuan
        D: 40,   // Nama Panel
        E: 5,    // (merged with D for header)
        F: 16,   // Harga Awal (Rp)
        G: 10,   // Disc. (%)
        H: 20,   // Harga Setelah Disc. (Rp)
    },
};

const ExcelFormatter = {

    // ─────────────────────────────────────────────────────────────
    // PUBLIC: Main entry point
    // ─────────────────────────────────────────────────────────────

    /**
     * Generates and downloads a Surat Penawaran Harga Excel file.
     *
     * @param {Object}   data
     * @param {string}   data.nomor        - Nomor surat  e.g. "001/CRT/II/2026"
     * @param {string}   data.hal          - Perihal       e.g. "Penawaran Harga"
     * @param {string}   data.proyek       - Nama proyek
     * @param {string}   data.tanggal      - Tanggal surat e.g. "27 Februari 2026"
     * @param {string}   data.ptTujuan     - Nama PT penerima
     * @param {string}   data.upTujuan     - Nama PIC penerima
     * @param {Array}    data.items        - Array of item objects (see below)
     * @param {Object}   data.keterangan   - Keterangan fields (loco, merk, delivery, payment)
     *
     * Each item in data.items:
     * @param {string}  item.nama    - Nama Panel
     * @param {number}  item.qty     - Quantity
     * @param {string}  item.satuan  - Satuan (Unit, pcs, etc.)
     * @param {number}  item.harga   - Harga Awal (Rp)
     * @param {number}  item.disc    - Diskon dalam persen (e.g. 30 = 30%)
     */
    async generateOfferExcel(data) {
        const wb = new ExcelJS.Workbook();
        wb.creator = 'PT. Cakra Raya Teknologi';
        wb.created = new Date();

        const ws = wb.addWorksheet('Surat Penawaran');

        // Apply column widths
        this._setColumnWidths(ws);

        // Build sections
        let nextRow = 1;
        nextRow = this._buildHeader(ws, data.tanggal, nextRow);
        nextRow = this._buildLetterInfo(ws, data, nextRow);
        nextRow = this._buildRecipient(ws, data, nextRow);
        nextRow = this._buildIntro(ws, nextRow);
        nextRow = this._buildTable(ws, data.items, nextRow);
        nextRow = this._buildKeterangan(ws, data.keterangan, nextRow);
        nextRow = this._buildClosing(ws, nextRow);

        // Download
        const buffer = await wb.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Penawaran_${(data.nomor || 'Harga').replace(/\//g, '-')}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
    },

    // ─────────────────────────────────────────────────────────────
    // SECTION BUILDERS
    // ─────────────────────────────────────────────────────────────

    /** Rows 1–7: Company letterhead + date */
    _buildHeader(ws, tanggal, startRow) {
        const r = startRow;

        ws.getRow(r).height = 20;
        this._mergeSet(ws, `D${r}:G${r}`, 'PT. CAKRA RAYA TEKNOLOGI', EXCEL_STYLE.fonts.companyName);
        this._mergeSet(ws, `D${r + 1}:G${r + 1}`, 'CRT Building, Jl Hasyim Ashari Blok B No 226 Kavling DPR');
        this._mergeSet(ws, `D${r + 2}:G${r + 2}`, 'Telp./Fax : 021-3892 4051');
        this._mergeSet(ws, `D${r + 3}:G${r + 3}`, 'Nerogtog - Pinang - Tangerang');
        this._mergeSet(ws, `D${r + 4}:G${r + 4}`, 'website : http://www.cakraraya.co.id');

        // Bottom border under header block
        for (let col = 1; col <= 8; col++) {
            ws.getCell(r + 4, col).border = {
                bottom: EXCEL_STYLE.border.thin,
            };
        }

        // Date — right aligned
        const dateCell = ws.getCell(`H${r + 6}`);
        dateCell.value = `Tangerang, ${tanggal}`;
        dateCell.font = EXCEL_STYLE.fonts.normal;
        dateCell.alignment = { horizontal: 'right' };

        return r + 7; // next available row
    },

    /** Nomor / Hal / Proyek */
    _buildLetterInfo(ws, data, startRow) {
        const r = startRow;
        const fields = [
            ['Nomor', data.nomor || ''],
            ['Hal', data.hal || 'Penawaran Harga'],
            ['Proyek', data.proyek || ''],
        ];

        fields.forEach(([label, value], i) => {
            ws.getCell(`A${r + i}`).value = label;
            ws.getCell(`A${r + i}`).font = EXCEL_STYLE.fonts.normal;
            ws.getCell(`C${r + i}`).value = ': ' + value;
            ws.getCell(`C${r + i}`).font = EXCEL_STYLE.fonts.normal;
        });

        return r + fields.length + 1; // +1 spacer
    },

    /** Kepada Yth section */
    _buildRecipient(ws, data, startRow) {
        const r = startRow;
        const lines = [
            'Kepada Yth,',
            `PT. ${data.ptTujuan || ''}`,
            `U/P. ${data.upTujuan || ''}`,
            'di tempat',
        ];

        lines.forEach((line, i) => {
            ws.getCell(`A${r + i}`).value = line;
            ws.getCell(`A${r + i}`).font = EXCEL_STYLE.fonts.normal;
        });

        return r + lines.length + 1; // +1 spacer
    },

    /** Dengan hormat + opening sentence */
    _buildIntro(ws, startRow) {
        const r = startRow;

        ws.getCell(`A${r}`).value = 'Dengan hormat,';
        ws.getCell(`A${r}`).font = EXCEL_STYLE.fonts.normal;

        this._mergeSet(
            ws, `A${r + 1}:H${r + 1}`,
            'Dengan ini kami sampaikan Penawaran harga berdasarkan dengan data-data yang kami terima dengan perincian sebagai berikut :'
        );
        ws.getRow(r + 1).getCell(1).alignment = { wrapText: true };

        return r + 3; // +1 spacer before table
    },

    /** Main pricing table */
    _buildTable(ws, items, startRow) {
        const r = startRow;

        // ── Table Header
        ws.mergeCells(`D${r}:E${r}`);
        const headers = [
            { col: 'A', label: 'No.' },
            { col: 'B', label: 'Qty' },
            { col: 'C', label: 'Satuan' },
            { col: 'D', label: 'NAMA PANEL' },       // D:E merged
            { col: 'F', label: 'Harga Awal (Rp)' },
            { col: 'G', label: 'Disc. (%)' },
            { col: 'H', label: 'Harga Setelah Disc. (Rp)' },
        ];
        ws.getRow(r).height = 28;

        headers.forEach(({ col, label }) => {
            const cell = ws.getCell(`${col}${r}`);
            cell.value = label;
            cell.font = EXCEL_STYLE.fonts.tableHeader;
            cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: EXCEL_STYLE.colors.headerBg } };
            cell.border = this._allBorders();
        });

        // ── Data Rows
        let currentRow = r + 1;
        let sumAfterDisc = 0;

        (items || []).forEach((item, i) => {
            const qty = parseFloat(item.qty) || 0;
            const harga = parseFloat(item.harga) || 0;
            const disc = parseFloat(item.disc) || 0;
            const afterDisc = harga - (harga * disc / 100);
            sumAfterDisc += afterDisc;

            const rowDef = [
                { col: 'A', val: i + 1, fmt: null, align: 'center' },
                { col: 'B', val: qty, fmt: '#,##0', align: 'center' },
                { col: 'C', val: item.satuan || 'Unit', fmt: null, align: 'center' },
                { col: 'D', val: item.nama || '', fmt: null, align: 'left' },
                { col: 'F', val: harga, fmt: '#,##0', align: 'right' },
                { col: 'G', val: disc / 100, fmt: '0%', align: 'center' },
                { col: 'H', val: afterDisc, fmt: '#,##0', align: 'right' },
            ];

            rowDef.forEach(({ col, val, fmt, align }) => {
                const cell = ws.getCell(`${col}${currentRow}`);
                cell.value = val;
                cell.font = EXCEL_STYLE.fonts.normal;
                cell.border = this._allBorders();
                cell.alignment = { horizontal: align };
                if (fmt) cell.numFmt = fmt;
            });

            currentRow++;
        });

        // ── Summary Footer
        const ppn = sumAfterDisc * 0.11;
        const total = sumAfterDisc + ppn;
        const dibulatkan = Math.ceil(total / 1000) * 1000;

        this._buildSummaryRow(ws, currentRow, 'Jumlah', sumAfterDisc, false);
        this._buildSummaryRow(ws, currentRow + 1, 'PPN 11%', ppn, false);
        this._buildSummaryRow(ws, currentRow + 2, 'TOTAL', total, false);
        this._buildSummaryRow(ws, currentRow + 3, 'Dibulatkan', dibulatkan, true);

        // "Perincian komponen terlampir" note
        ws.getCell(`D${currentRow}`).value = 'Perincian komponen terlampir';
        ws.getCell(`D${currentRow}`).font = EXCEL_STYLE.fonts.normal;

        return currentRow + 5; // skip footer rows + spacer
    },

    /** Single summary/total row (Jumlah / PPN / TOTAL / Dibulatkan) */
    _buildSummaryRow(ws, rowNum, label, value, isGrandTotal) {
        const labelCell = ws.getCell(`G${rowNum}`);
        labelCell.value = label;
        labelCell.font = EXCEL_STYLE.fonts.bold;
        labelCell.alignment = { horizontal: 'right' };

        const valueCell = ws.getCell(`H${rowNum}`);
        valueCell.value = value;
        valueCell.numFmt = '#,##0';
        valueCell.font = isGrandTotal ? EXCEL_STYLE.fonts.grandTotal : EXCEL_STYLE.fonts.bold;
        valueCell.border = this._allBorders();
        valueCell.alignment = { horizontal: 'right' };

        if (isGrandTotal) {
            valueCell.fill = {
                type: 'pattern', pattern: 'solid',
                fgColor: { argb: EXCEL_STYLE.colors.grandTotalBg }
            };
        }
    },

    /** Keterangan section */
    _buildKeterangan(ws, ket = {}, startRow) {
        const r = startRow;
        ws.getCell(`A${r}`).value = 'Keterangan :';
        ws.getCell(`A${r}`).font = EXCEL_STYLE.fonts.bold;

        const items = [
            'Harga dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu',
            `Loco           : ${ket.loco || 'Jakarta (On Truck), belum termasuk packing'}`,
            `Merk Komp.     : ${ket.merk || 'SCHNEIDER'}`,
            `Delivery       : ${ket.delivery || '6-8 minggu, setelah PO & DP diterima serta gambar diapproved'}`,
            `Payment        : ${ket.payment || '50% DP, 50% Before Delivery'}`,
            'Garansi 1 (satu) tahun, terhitung dari pengiriman panel',
            'Belum termasuk pasang dan commissioning disite',
        ];

        items.forEach((text, i) => {
            const rowNum = r + 1 + i;
            this._mergeSet(ws, `A${rowNum}:H${rowNum}`, `${i + 1}. ${text}`);
        });

        return r + items.length + 2; // +2 spacer
    },

    /** Closing paragraph + signature */
    _buildClosing(ws, startRow) {
        const r = startRow;

        this._mergeSet(
            ws, `A${r}:H${r}`,
            'Demikianlah Penawaran harga ini kami sampaikan. Atas perhatian dan kerjasama yang diberikan, kami ucapkan terima kasih.'
        );
        ws.getRow(r).getCell(1).alignment = { wrapText: true };

        ws.getCell(`A${r + 3}`).value = 'Hormat kami,';
        ws.getCell(`A${r + 3}`).font = EXCEL_STYLE.fonts.normal;

        ws.getCell(`A${r + 4}`).value = 'PT. Cakra Raya Teknologi';
        ws.getCell(`A${r + 4}`).font = EXCEL_STYLE.fonts.bold;

        ws.getCell(`A${r + 10}`).value = 'M. Husni Thamrin';
        ws.getCell(`A${r + 10}`).font = EXCEL_STYLE.fonts.bold;

        return r + 12;
    },

    // ─────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────

    /** Set column widths from config */
    _setColumnWidths(ws) {
        Object.entries(EXCEL_STYLE.columnWidths).forEach(([col, width], i) => {
            ws.getColumn(i + 1).width = width;
        });
    },

    /** Merge cells and set value + normal font */
    _mergeSet(ws, range, value, font = EXCEL_STYLE.fonts.normal) {
        ws.mergeCells(range);
        const cell = ws.getCell(range.split(':')[0]);
        cell.value = value;
        cell.font = font;
    },

    /** Returns a full thin-border object */
    _allBorders() {
        const t = EXCEL_STYLE.border.thin;
        return { top: t, left: t, bottom: t, right: t };
    },
};

window.ExcelFormatter = ExcelFormatter;