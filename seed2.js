import { PrismaClient } from "@prisma/client";
import fs from "fs";

// Read data from the JSON file
const dataFilePath = "./sample_geospatial.shipwrecks.json";
const jsonData = fs.readFileSync(dataFilePath, "utf8");
const data = JSON.parse(jsonData);

const prisma = new PrismaClient();

export function generateRandomCoordinates(numPoints) {
  const coordinates = [];
  const minLat = -35.9;
  const maxLat = -22.1;
  const minLon = 16.5;
  const maxLon = 32.8;

  for (let i = 0; i < numPoints; i++) {
    const lat = Math.random() * (maxLat - minLat) + minLat;
    const lon = Math.random() * (maxLon - minLon) + minLon;
    coordinates.push({ lat, lon });
  }

  return coordinates;
}

// Generate 200 random coordinates
const randomCoordinates = generateRandomCoordinates(200);

// Print the generated coordinates
randomCoordinates.forEach((coordinate) => {
  console.log({ coordinates: [coordinate.lon, coordinate.lat] });
});

async function main() {
  console.log("Connected to MongoDB");
  console.log("Seeding data...");
  try {
    await prisma.shipwrecks.createMany({
      randomCoordinates,
    });
    console.log("Done");
  } catch (error) {
    console.log("There was an error seeding the DB");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
