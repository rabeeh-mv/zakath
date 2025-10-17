// prices.js

const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTvIW3MxszgiIZOeTa3SLAvE5D4jQGTb9So5FTzIc3rIoTMaBqA59q9Mnx9p8auJQ1itJPX_t3F9OtK/pub?output=csv";

async function getRates() {
  try {
    const response = await fetch(sheetUrl);
    const text = await response.text();

    const rows = text.trim().split("\n").map(row => row.split(","));

    const cleanPrice = (price) => price.replace(/[₹,]/g, "").trim();

    let goldRate = null;
    let silverRate = null;

    rows.forEach(row => {
      const item = row[0].toLowerCase();
      if (item.includes("gold")) goldRate = cleanPrice(row[4]); // last column
      if (item.includes("silver")) silverRate = cleanPrice(row[3]);
    });

    window.goldRate = goldRate;
    window.silverRate = silverRate;

    console.log("✅ Gold:", goldRate, "| Silver:", silverRate);
  } catch (err) {
    console.error("⚠️ Error fetching rates:", err);
  }
}

getRates();
