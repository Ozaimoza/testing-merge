const axios = require('axios');
const { PrismaClient } = require('../prisma/generated/client');
const prisma = new PrismaClient();
const shoppingCartController = require('./shoppingCartController');

const calculateShippingFee = async (originCityId, destinationCityId, weight, courier) => {
    const apiKey = '86ee504db8abb644b6a2324e98e3b5d8';

    try {
        const response = await axios.post(
            'https://api.rajaongkir.com/starter/cost',
            {
                origin: originCityId,
                destination: destinationCityId,
                weight: weight,
                courier: courier,
            },
            {
                headers: {
                    key: apiKey,
                },
            }
        );
        
        // Debugging
        console.log('API response:', response.data); 

        if (
            response.data.rajaongkir &&
            response.data.rajaongkir.results &&
            response.data.rajaongkir.results.length > 0 &&
            response.data.rajaongkir.results[0].costs &&
            response.data.rajaongkir.results[0].costs.length > 0
        ) {
            const shippingCost = response.data.rajaongkir.results[0].costs[0].cost[0].value;
            return shippingCost;
        } else if (response.data.rajaongkir.status.code === 200) {
            // Log the response to better understand the structure
            console.log('Response structure:', response.data.rajaongkir);

            // Handle the case where shipping costs are not available
            console.error('No shipping costs available.');
            throw new Error('No shipping costs available.');
        } else {
            console.error('Invalid API response structure:', response.data);
            throw new Error('Invalid API response structure');
        }
    } catch (error) {
        console.error('Error calculating shipping fee:', error.response ? error.response.data : error.message);
        throw new Error('Failed to calculate shipping fee');
    }
};

module.exports = {
    calculateShippingFee,
};
