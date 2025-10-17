// prices.js

const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTvIW3MxszgiIZOeTa3SLAvE5D4jQGTb9So5FTzIc3rIoTMaBqA59q9Mnx9p8auJQ1itJPX_t3F9OtK/pub?output=csv";

async function getRates() {
  try {
    const response = await fetch(sheetUrl);
    const text = await response.text();

    // Split CSV rows by new line
    const rows = text.trim().split("\n").map(r => r.split(","));

    // Find header indexes dynamically
    const headers = rows[0].map(h => h.trim().toLowerCase());
    const itemIndex = headers.indexOf("items");
    const lastGramIndex = headers.indexOf("1 gram");

    let goldRate = null;
    let silverRate = null;

    for (let i = 1; i < rows.length; i++) {
      const item = rows[i][itemIndex]?.trim().toLowerCase();
      const rate = rows[i][lastGramIndex]?.trim();

      if (item.includes("gold")) goldRate = rate;
      if (item.includes("silver")) silverRate = rate;
    }

    // Store globally
    window.goldRate = goldRate;
    window.silverRate = silverRate;

    console.log("Gold:", goldRate, "Silver:", silverRate);
  } catch (err) {
    console.error("Error fetching rates:", err);
  }
}

// Auto-run
getRates();
