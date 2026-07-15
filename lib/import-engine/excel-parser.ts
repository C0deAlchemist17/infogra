/**
 * Excel Parser for Product Import
 * Handles parsing Excel files (.xlsx, .xls) with product data
 * Note: Requires 'xlsx' package to be installed
 */

import { CSVParser } from './csv-parser'

export interface ExcelProduct {
  [key: string]: string | number
}

export interface ParseResult {
  success: boolean
  data: ExcelProduct[]
  errors: string[]
  rowCount: number
}

export class ExcelParser {
  /**
   * Parse Excel file (as ArrayBuffer) into array of product objects
   */
  static async parse(fileBuffer: ArrayBuffer, sheetName?: string): Promise<ParseResult> {
    const errors: string[] = []
    
    try {
      // Dynamic import of xlsx library to avoid bundling issues
      // @ts-ignore - xlsx is an optional dependency
      const XLSX = await import('xlsx')
      
      const workbook = XLSX.read(fileBuffer, { type: 'array' })
      
      // Use specified sheet or first sheet
      const sheet = sheetName 
        ? workbook.Sheets[sheetName]
        : workbook.Sheets[workbook.SheetNames[0]]
      
      if (!sheet) {
        return {
          success: false,
          data: [],
          errors: [`Sheet ${sheetName || 'first'} not found`],
          rowCount: 0
        }
      }

      // Convert sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet, { 
        header: 1,
        defval: ''
      })
      
      if (jsonData.length === 0) {
        return {
          success: false,
          data: [],
          errors: ['Empty Excel sheet'],
          rowCount: 0
        }
      }

      // Convert to CSV format and use CSV parser
      const csvContent = this.arrayToCSV(jsonData as any[][])
      const result = CSVParser.parse(csvContent, ',')
      
      return result
    } catch (error) {
      return {
        success: false,
        data: [],
        errors: [`Excel parsing error: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure 'xlsx' package is installed.`],
        rowCount: 0
      }
    }
  }

  /**
   * Convert 2D array to CSV string
   */
  private static arrayToCSV(data: any[][]): string {
    return data
      .map(row => 
        row
          .map(cell => {
            // Escape values containing commas or quotes
            const cellStr = String(cell ?? '')
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`
            }
            return cellStr
          })
          .join(',')
      )
      .join('\n')
  }

  /**
   * Get list of sheet names from Excel file
   */
  static async getSheetNames(fileBuffer: ArrayBuffer): Promise<string[]> {
    try {
      // @ts-ignore - xlsx is an optional dependency
      const XLSX = await import('xlsx')
      const workbook = XLSX.read(fileBuffer, { type: 'array' })
      return workbook.SheetNames
    } catch (error) {
      return []
    }
  }

  /**
   * Convert Excel product data to Product interface
   */
  static toProduct(excelProduct: ExcelProduct, mapping: Record<string, string>): any {
    // Excel data is already in the same format as CSV, so reuse CSV parser logic
    return CSVParser.toProduct(excelProduct, mapping)
  }
}
