import taxes from '../data/taxRate.json'


//checking through the taxesRates to find if an item is on the exceptional list or not
export const isItemExceptional = (item: ImportedItem): boolean => {
  const result = taxes.find(
    tax => tax.country === item.countryDestination && tax.categoryExceptions.includes(item.category)
  )
  return result && Object.keys(result).length > 0 ? true : false
}

/**
 * Any item that is exceptional or on a country exceptional list is assigned a tax rate of 0
 * Any item that isnt on a country's exceptionnal list is assigned the importTaxRate specified 
 */
export const getTaxRate = (item: ImportedItem) => {

  const isExceptional = isItemExceptional(item)
  let taxRate: number | undefined = isExceptional
    ? 0
    : taxes.find(tax => tax.country === item.countryDestination)?.importTaxRate
  return Number(taxRate)
}

/**
 * From the formual given, i calculate my importCost in which i exported and did use to calculate the total cost
 */
export const calculateImportedCost = (item: ImportedItem, importedTaxRate: number) => {
  let importedCost = item.unitPrice * item.quantity * importedTaxRate
  return importedCost
}
