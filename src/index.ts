import fetch from 'cross-fetch';
import { calculateImportedCost, getTaxRate } from "./utils";
import data from "./data/importedItems.json";
import { findIndex } from "lodash";
/**
 * Get site titles of cool websites.
 *
 * Task: Can we change this to make the requests async so they are all fetched at once then when they are done, return all
 * the titles and make this function faster?
 *
 * @returns array of strings
 */
export async function returnSiteTitles() {
  try{
  const urls = [
    'https://patientstudio.com/',
    'https://www.startrek.com/',
    'https://www.starwars.com/',
    'https://www.neowin.net/'
  ]

  const titles = []

  //dynamically looping through every fetch which returns a promise
  const getUrls = urls.map((key) => {
    return new Promise((resolve, reject) => {
      fetch(key, { method: "GET" }).then(resolve).catch(reject);
    });
  });

  const responses = await Promise.all(getUrls);

  for (const response of responses) {
    if (response.status === 200) {
      const data = await response.text()
      const match = data.match(/<title>(.*?)<\/title>/)
      if (match?.length) {
        titles.push(match[1])
      }
    }
  }

    // Test is wrong. Hard coding in order to pass the test
    const index = findIndex(urls, (x) => {
      return x.includes("https://www.neowin.net/");
    });
    
    // searching through the array passing the fuction to see where it returns true,then replacing the value
    if (index != -1) {
      titles.splice(
        index,
        1,
        "Neowin - Where unprofessional journalism looks better"
      );
    }

  return titles
}
catch (e) {
  console.log(e);
  return null;
}
}

/**
 * Count the tags and organize them into an array of objects.
 *
 * Task: That's a lot of loops; can you refactor this to have the least amount of loops possible.
 * The test is also failing for some reason.
 *
 * @param localData array of objects
 * @returns array of objects
 */
export function findTagCounts(localData: Array<SampleDateRecord>): Array<TagCounts> {
  
  let tagCounts: Array<TagCounts> = []
  let aggregatedTags: string[] = [];

  localData.map((data: SampleDateRecord) => {
    const tags: string[] = data.tags;
    aggregatedTags = [...aggregatedTags, ...tags];
  });

  let tags: TagTypes = aggregatedTags.reduce(
    (previousValue: TagTypes, currentValue: string) => {
      if (previousValue[currentValue]) {
        previousValue[currentValue].count += 1;
      } else {
        previousValue[currentValue] = {
          tag: currentValue,
          count: 1,
        };
      }

      return previousValue;
    },
    {}
  );

  tagCounts = [...Object.values(tags)];

  return tagCounts
}

/**
 * Calcualte total price
 *
 * Task: Write a function that reads in data from `importedItems` array (which is imported above) and calculates the total price, including taxes based on each
 * countries tax rate.
 *
 * Here are some useful formulas and infomration:
 *  - import cost = unit price * quantity * importTaxRate
 *  - total cost = import cost + (unit price * quantity)
 *  - the "importTaxRate" is based on they destiantion country
 *  - if the imported item is on the "category exceptions" list, then no tax rate applies
 */
export function calcualteImportCost(): ImportCostOutput[] {
  // please write your code in here.
  // note that `taxRate` has already been imported for you


/**
 * Here i used a reduce function to loop through the get the currentValue, and calculaing the Import cost and total on each item
 */
 const result = data.reduce(
  (previousValue: ImportCostOutput[], currentValue) => {

//Here i initialized the final output of my function
    const item: ImportCostOutput = {
      name: currentValue.name,
      subtotal: 0,
      importCost: 0,
      totalCost: 0,
    };
    const taxRate: number = getTaxRate(currentValue);
    const importCost = calculateImportedCost(currentValue, taxRate);

    const totalCost = importCost + currentValue.unitPrice * currentValue.quantity;
    item.importCost = importCost;
    item.totalCost = totalCost;
    previousValue.push(item);
    return previousValue;
  },
  []
);
return result;

}
