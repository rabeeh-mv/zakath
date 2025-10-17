// prices.js

const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTvIW3MxszgiIZOeTa3SLAvE5D4jQGTb9So5FTzIc3rIoTMaBqA59q9Mnx9p8auJQ1itJPX_t3F9OtK/pub?output=csv";

async function getRates() {
  try {
    const response = await fetch(sheetUrl);
    const csvText = await response.text();

    // Split rows safely and handle quoted commas
    const rows = csvText.trim().split(/\r?\n/).map(row => {
      return row
        .match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)
        ?.map(c => c.replace(/^"|"$/g, "")) || [];
    });

    const headers = rows[0].map(h => h.trim().toLowerCase());
    const itemIndex = headers.indexOf("Items");
    const gramIndex = headers.indexOf("1 Gram");

    if (itemIndex === -1 || gramIndex === -1) {
      throw new Error("Header names 'Items' or '1 Gram' not found in sheet.");
    }

    let goldRate = null;
    let silverRate = null;

    for (let i = 1; i < rows.length; i++) {
      const item = rows[i][itemIndex]?.trim().toLowerCase() || "";
      const rate = rows[i][gramIndex]?.trim() || "";

      if (item.includes("gold")) goldRate = rate;
      if (item.includes("silver")) silverRate = rate;
    }

    // Save globally
    window.goldRate = goldRate;
    window.silverRate = silverRate;

    console.log("✅ Gold:", goldRate, " | Silver:", silverRate);
  } catch (err) {
    console.error("⚠️ Error fetching rates:", err);
  }
}

getRates();
