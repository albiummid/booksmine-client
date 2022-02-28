// Date Fns is used to format the dates we receive
// from our API call
import jsPDF from 'jspdf'
import 'jspdf-autotable'

// define a generatePDF function that accepts a tickets argument
const generatePDF = (tableData, tableColumn) => {
  // initialize jsPDF
  const doc = new jsPDF()

  // define the columns we want and their titles
  //   const tableColumn = ['Id', 'Title', 'Issue', 'Status', 'Closed on']
  // define an empty array of rows
  console.log(tableData)

  // startY is basically margin-top
  doc.autoTable(tableColumn, tableData, { startY: 20 })
  const date = Date().split(' ')
  // we use a date string to generate our filename.
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4]
  // ticket title. and margin-top + margin-left
  doc.text('Closed tickets within the last one month.', 14, 15)
  // we define the name of our PDF file.
  doc.save(`report_${dateStr}.pdf`)
}

export default generatePDF
