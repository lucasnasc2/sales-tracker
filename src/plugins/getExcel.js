import ExcelJS from "exceljs";

function toDate(timestamp) {
  const seconds = timestamp.seconds;
  const nanoseconds = timestamp.nanoseconds;
  return new Date(seconds * 1000 + nanoseconds / 1000000);
}
// Function to generate Excel file
async function generateExcelSales(salesData) {
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
    "Donation",
    "Checkout ID",
  ]);

  // Add data to worksheet
  salesData.forEach((sale) => {
    sale.items.forEach((item) => {
      const checkoutTime = toDate(sale.checkoutTime);
      sheet.addRow([
        item.id,
        item.name,
        item.category,
        item.quantity,
        item.price,
        sale.userId,
        checkoutTime,
        sale.checkoutPrice,
        sale.donation ? sale.donation : 0,
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

// Function to generate Excel file
async function generateExcelInventory(productsData) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Products Data");

  // Add headers to worksheet
  sheet.addRow([
    "ID",
    "Name",
    "Description",
    "Category",
    "Price",
    "Stock",
    "Created",
    "Last modified",
    "Modified by",
    "Active"
  ]);

  // Add data to worksheet
  productsData.forEach((product) => {
    const modifiedTime = toDate(product.modifiedTimestamp);
    const createdTime = toDate(product.createdTimestamp);
     sheet.addRow([
        product.id,
        product.name,
        product.description,
        product.category,
        product.price,
        product.stock,
        createdTime,
        modifiedTime,
        product.modifiedBy,
        product.active
      ]);
  });

  // Generate Excel file as a blob
  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export { generateExcelSales, generateExcelInventory };
