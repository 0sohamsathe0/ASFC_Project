import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const EVENT_COLORS = {
  Epee: "9DC3E6",   // Blue
  Foil: "F4B183",   // Orange
  Sabre: "A9D18E",  // Green
};

const BORDER = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

export const exportTournamentEntries = async (
  tournament,
  entries,
  gender
) => {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "All Star Fencing Club";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(
    `${gender === "Male" ? "Boys" : "Girls"} Entries`
  );

  worksheet.views = [
    {
      state: "frozen",
      ySplit: 4,
    },
  ];

  // ====================================================
  // TITLE
  // ====================================================

  worksheet.mergeCells("A1:H1");

  const titleCell = worksheet.getCell("A1");

  titleCell.value = tournament.title;

  titleCell.font = {
    bold: true,
    size: 20,
    name: "Calibri",
    color: { argb: "1F3A63" },
  };

  titleCell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.getRow(1).height = 32;

  // ====================================================
  // VENUE
  // ====================================================

  worksheet.mergeCells("A2:H2");

  const venueCell = worksheet.getCell("A2");

  venueCell.value = `Venue : ${tournament.locationCity}, ${tournament.locationState}`;

  venueCell.font = {
    size: 12,
    name: "Calibri",
  };

  venueCell.alignment = {
    horizontal: "center",
  };

  // ====================================================
  // GENDER
  // ====================================================

  worksheet.mergeCells("A3:H3");

  const genderCell = worksheet.getCell("A3");

  genderCell.value = `Gender : ${gender === "Male" ? "Boys" : "Girls"
    }`;

  genderCell.font = {
    size: 12,
    name: "Calibri",
  };

  genderCell.alignment = {
    horizontal: "center",
  };

  // ====================================================
  // HEADER
  // ====================================================

  const header = worksheet.getRow(4);

  header.values = [
    "Sr No.",
    "Player Name",
    "FAI ID",
    "MFA ID",
    "DOB",
    "Event",
    "Phone",
    "Institute",
  ];

  header.height = 24;

  header.eachCell((cell) => {
    cell.font = {
      bold: true,
      size: 11,
      color: { argb: "000000" },
    };

    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    cell.border = BORDER;

    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "FFFFFF",
      },
    };
  });

  // ====================================================
  // FIXED COLUMN WIDTHS
  // ====================================================

  worksheet.getColumn(1).width = 10;
  worksheet.getColumn(3).width = 22; // FAI ID
  worksheet.getColumn(4).width = 18; // MFA ID
  worksheet.getColumn(5).width = 15; // DOB
  worksheet.getColumn(6).width = 10; // Event
  worksheet.getColumn(7).width = 18; // Phone

  let currentRow = 5;
  // ====================================================
  // PLAYER DATA
  // ====================================================

  entries.forEach((entry, index) => {
    const player = entry.playerId;

    const row = worksheet.getRow(currentRow);

    row.getCell(1).value = index + 1;
    row.getCell(2).value = player.fullName;
    row.getCell(3).value = player.faiId;
    row.getCell(4).value = player.mfaId;
    row.getCell(5).value = new Date(player.dob);
    row.getCell(6).value = player.event;
    row.getCell(7).value = player.phone;
    row.getCell(8).value = player.institute;

    row.height = 22;

    // Date format
    row.getCell(5).numFmt = "dd-mm-yyyy";

    // Event Color
    const fillColor =
      EVENT_COLORS[player.event] || "FFFFFF";

    row.eachCell((cell, colNumber) => {
      cell.border = BORDER;

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: fillColor,
        },
      };

      cell.font = {
        name: "Calibri",
        size: 11,
        color: {
          argb: "000000",
        },
      };

      // Alignment
      if ([1, 3, 4, 5, 6, 7].includes(colNumber)) {
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
        };
      } else {
        cell.alignment = {
          horizontal: "left",
          vertical: "middle",
        };
      }
    });

    currentRow++;
  });

  // ====================================================
  // AUTO WIDTH (ONLY NAME & INSTITUTE)
  // ====================================================

[2, 3, 4, 8].forEach((columnNumber) => {    const column = worksheet.getColumn(columnNumber);

    let maxLength = 15;

    column.eachCell({ includeEmpty: true }, (cell) => {
      const value = cell.value
        ? cell.value.toString()
        : "";

      if (value.length > maxLength) {
        maxLength = value.length;
      }
    });

    column.width = Math.min(maxLength + 4, 45);
  });
  // ====================================================
  // TOTAL ENTRIES
  // ====================================================

  currentRow += 1;

  const totalRow = worksheet.getRow(currentRow);

  worksheet.mergeCells(`A${currentRow}:H${currentRow}`);

  const totalCell = worksheet.getCell(`A${currentRow}`);

  totalCell.value = `Total Entries : ${entries.length}`;

  totalCell.font = {
    bold: true,
    size: 11,
    name: "Calibri",
  };

  totalCell.alignment = {
    horizontal: "right",
    vertical: "middle",
  };

  // ====================================================
  // PAGE SETUP
  // ====================================================

  worksheet.pageSetup = {
    paperSize: 9, // A4
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: {
      left: 0.3,
      right: 0.3,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  // Repeat header row while printing
  worksheet.pageSetup.printTitlesRow = "4:4";

  // ====================================================
  // WORKBOOK PROPERTIES
  // ====================================================

  workbook.subject = tournament.title;
  workbook.company = "All Star Fencing Club";
  workbook.manager = "All Star Fencing Club";

  // ====================================================
  // EXPORT
  // ====================================================

  const buffer = await workbook.xlsx.writeBuffer();

  saveAs(
    new Blob([buffer]),
    `${tournament.title}_${gender === "Male" ? "Boys" : "Girls"
    }.xlsx`
  );
}