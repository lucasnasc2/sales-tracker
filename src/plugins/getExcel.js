import ExcelJS from "exceljs";

function toDate(timestamp) {
  const seconds = timestamp.seconds;
  const nanoseconds = timestamp.nanoseconds;
  return new Date(seconds * 1000 + nanoseconds / 1000000);
}
// Function to generate Excel file
async function generateExcel(salesData, productsData) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sales Data");

  // Add headers to worksheet
  sheet.addRow([
    "Item ID",
    "Product Name",
    "Category",
    "Quantity",
    "Product Price",
    "User ID",
    "Checkout Time",
    "Checkout Price",
    "Checkout ID",
  ]);

  // Add data to worksheet
  salesData.forEach((sale) => {
    sale.items.forEach((item) => {
      const productName =
        productsData.find((product) => product.id === item.id)?.name ||
        "Unknown";
      const checkoutTime = toDate(sale.checkoutTime);
      sheet.addRow([
        item.id,
        productName,
        item.category,
        item.quantity,
        item.price,
        sale.userId,
        checkoutTime,
        sale.checkoutPrice,
        sale.id,
      ]);
    });
  });

  // Generate Excel file as a blob
  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export { generateExcel };
