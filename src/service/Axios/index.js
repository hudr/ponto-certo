import axios from 'axios'

const sheetson = axios.create({
  baseURL: process.env.REACT_APP_SHEETSON_BASEURL,
})

const API_VERSION = process.env.REACT_APP_SHEETSON_API_VERSION
const SHEET_NAME = process.env.REACT_APP_SHEETSON_SHEET_NAME
const SKIP = process.env.REACT_APP_SHEETSON_SKIP
const LIMIT = process.env.REACT_APP_SHEETSON_LIMIT
const SPREADSHEET_ID = process.env.REACT_APP_SHEETSON_SPREADSHEET_ID

export const getMarks = async () => {
  return sheetson
    .get(
      `/${API_VERSION}/sheets/${SHEET_NAME}?&skip=${SKIP}&limit=${LIMIT}&spreadsheetId=${SPREADSHEET_ID}`
    )
    .then((res) => {
      return res.data.results
    })
    .catch((err) => {
      console.error(err)
    })
}

export const insertMark = async (markData) => {
  return sheetson
    .post(
      `/${API_VERSION}/sheets/${SHEET_NAME}?spreadsheetId=${SPREADSHEET_ID}`,
      markData
    )
    .catch((err) => {
      console.error(err)
    })
}

export const removeMask = async (rowIndex) => {
  return sheetson
    .delete(
      `/${API_VERSION}/sheets/${SHEET_NAME}/${rowIndex}?spreadsheetId=${SPREADSHEET_ID}`
    )
    .catch((err) => {
      console.error(err)
    })
}
