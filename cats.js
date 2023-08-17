const axios = require('axios');
const fs = require('fs').promises;

const apiUrl = 'https://catfact.ninja/breeds';

async function fetchData(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw error;
    }
}

async function getAllPagesData() {
    const allData = [];
    let pageNumber = 1;

    while (true) {
        const pageData = await fetchData(`${apiUrl}?page=${pageNumber}`);
        if (pageData.data.length === 0) {
            break;
        }
        allData.push(...pageData.data);
        pageNumber++;
    }

    return allData;
}

function groupBreedsByCountry(data) {
    const groupedData = {};

    data.forEach(breed => {
        if (!groupedData[breed.origin]) {
            groupedData[breed.origin] = [];
        }
        groupedData[breed.origin].push({
            breed: breed.breed,
            origin: breed.origin,
            coat: breed.coat,
            pattern: breed.pattern
        });
    });

    return groupedData;
}

async function saveToFile(data, filename) {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
    console.log(`Data saved to file: ${filename}`);
}

async function main() {
    try {
        const allData = await getAllPagesData();
        const groupedData = groupBreedsByCountry(allData);

        await saveToFile(allData, 'cat_breeds_data_raw.txt');
        await saveToFile(groupedData, 'cat_breeds_data_grouped.txt');

        console.log('Number of pages:', allData.length);
        console.log(JSON.stringify(groupedData, null, 2));
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

main();
