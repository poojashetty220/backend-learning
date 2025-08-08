const mongoose = require('mongoose');
const User = require('../entities/User');
const mongoConnection = require('../lib/mongo-connection');

let connection;

module.exports.handler = async (eventData) => {
    try {
        connection = await mongoConnection.connect();
        
        const {
            min_age,
            city = '',
            search = '',
            sort_by = 'created_at',
            sort_order = 'desc'
        } = eventData.queryStringParameters || {};

        const filter = {};

        if (min_age) {
            filter.$expr = {
                $gte: [
                    {
                        $convert: {
                            input: '$age',
                            to: 'int',
                            onError: null,
                            onNull: null
                        }
                    },
                    Number(min_age)
                ]
            };
        }

        if (city) {
            filter['addresses.city'] = { $regex: new RegExp(city.toString(), 'i') };
        }

        if (search) {
            const regex = new RegExp(search.toString(), 'i');
            filter.$or = [
                { name: regex },
                { email: regex },
                { gender: regex }
            ];
        }

        const sortField = ['name', 'email', 'created_at'].includes(sort_by)
            ? sort_by
            : 'created_at';
        const sortDirection = sort_order === 'asc' ? 1 : -1;

        const pipeline = [
            { $match: filter },
            {
                $facet: {
                    users: [
                        { $sort: { [sortField]: sortDirection } }
                    ],
                    stats: [
                        {
                            $group: {
                                _id: null,
                                averageAge: {
                                    $avg: {
                                        $cond: [
                                            { $ne: ['$age', null] },
                                            {
                                                $convert: {
                                                    input: '$age',
                                                    to: 'int',
                                                    onError: null,
                                                    onNull: null
                                                }
                                            },
                                            null
                                        ]
                                    }
                                },
                                totalCount: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ];

        const result = await User.aggregate(pipeline);
        const users = result[0].users;
        const stats = result[0].stats[0] || { averageAge: 0, totalCount: 0 };

        return {
            statusCode: 200,
            body: JSON.stringify({ users, stats }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
            },
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching users', error: error.message }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };
    } finally {
        if (connection) {
            await mongoose.disconnect();
        }
    }
};