import { PrismaClient } from '@prisma/client'
import fs from 'fs'

// Read data from the JSON file
const dataFilePath = './sample_geospatial.shipwrecks.json'; // Replace with the path to your data.json file
const jsonData = fs.readFileSync(dataFilePath, 'utf8');
const data = JSON.parse(jsonData);

const prisma = new PrismaClient()

async function main() {
  console.log('Connected to MongoDB');
  console.log('Seeding data...');
  try {
    await prisma.shipwrecks.createMany({
      data
    })
    console.log('Done');
  } catch (error) {
    console.log("There was an error seeding the DB")
  }
  
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })