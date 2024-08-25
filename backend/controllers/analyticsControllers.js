// controllers/analyticsController.js
const Order = require('../models/order');
const Customer = require('../models/customer');

const getTotalSalesOverTime = async (req, res) => {
  try {
    const interval = req.params.interval;

    const getAggregationPipeline = (interval) => {
      let dateGrouping;
      switch (interval) {
        case 'daily':
          dateGrouping = { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } };
          break;
        case 'monthly':
          dateGrouping = { $dateToString: { format: "%Y-%m", date: "$created_at" } };
          break;
        case 'quarterly':
          dateGrouping = {
            $concat: [
              { $dateToString: { format: "%Y", date: "$created_at" } },
              '-Q',
              { $toString: { $ceil: { $divide: [{ $month: "$created_at" }, 3] } } }
            ]
          };
          break;
        case 'yearly':
          dateGrouping = { $dateToString: { format: "%Y", date: "$created_at" } };
          break;
        default:
          console.error('Invalid interval provided');
          return null;
      }

      return [
        {
          $addFields: {
            created_at: { $toDate: "$created_at" }  // Convert `created_at` from string to Date
          }
        },
        {
          $group: {
            _id: dateGrouping,
            totalSales: { $sum: { $toDouble: "$total_price_set.shop_money.amount" } }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ];
    };

    const pipeline = getAggregationPipeline(interval);
    if (!pipeline) {
      return res.status(400).json({ error: 'Invalid interval' });
    }

    const salesData = await Order.aggregate(pipeline);
    res.json(salesData);
  } catch (error) {
    console.error('Error fetching sales data:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const aggregateSalesData = async () => {
  return await Order.aggregate([
    {
      $addFields: {
        created_at: { $toDate: "$created_at" } // Ensure created_at is a Date type
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$created_at" } },
        totalSales: { $sum: { $toDouble: "$total_price_set.shop_money.amount" } }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

const calculateGrowthRate = (salesData) => {
  let previousSales = null;
  return salesData.map((currentMonth) => {
    const growthRate = previousSales
      ? ((currentMonth.totalSales - previousSales.totalSales) / previousSales.totalSales) * 100
      : 0;

    previousSales = currentMonth;
    return {
      month: currentMonth._id,
      totalSales: currentMonth.totalSales,
      growthRate: parseFloat(growthRate.toFixed(2)) // Format the growth rate to 2 decimal places
    };
  });
};

const getSalesGrowthRateOverTime = async (req, res) => {
  try {
    const salesData = await aggregateSalesData();
    const growthRateData = calculateGrowthRate(salesData);
    res.json(growthRateData);
  } catch (err) {
    console.error('Error fetching sales growth rate:', err.message);
    res.status(500).json({ error: err.message });
  }
};

const getNewCustomersTest = async (req, res) => {
  try {
    const newCustomersPipeline = [
      {
        $addFields: {
          created_at: { $dateFromString: { dateString: "$created_at" } }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$created_at" },
            month: { $month: "$created_at" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ];

    const newCustomersData = await Customer.aggregate(newCustomersPipeline);
    if (newCustomersData.length === 0) {
      console.log('No new customers data found.');
    }
    res.json(newCustomersData);
  } catch (err) {
    console.error('Error fetching new customers data:', err.message);
    res.status(500).json({ error: err.message });
  }
};

const getRepeatCustomers = async (req, res) => {
  try {
    const repeatCustomersPipeline = [
      { $group: { _id: "$customer.id", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $group: { _id: null, total: { $sum: 1 } } }
    ];

    const repeatCustomersData = await Order.aggregate(repeatCustomersPipeline);
    res.json(repeatCustomersData);
  } catch (err) {
    console.error('Error fetching repeat customers data:', err.message);
    res.status(500).json({ error: err.message });
  }
};

const getGeographicalDistribution = async (req, res) => {
  try {
    const distributionPipeline = [
      { $group: { _id: "$default_address.city", count: { $sum: 1 } } }
    ];

    const distributionData = await Customer.aggregate(distributionPipeline);
    res.json(distributionData);
  } catch (err) {
    console.error('Error fetching geographical distribution data:', err.message);
    res.status(500).json({ error: err.message });
  }
};

const getCustomerLifetimeValue = async (req, res) => {
  try {
    const lifetimeValuePipeline = [
      { $group: { _id: "$customer.id", totalSpent: { $sum: { $toDouble: "$total_price" } } } },
      { $group: { _id: { year: { $year: "$created_at" }, month: { $month: "$created_at" } }, averageSpent: { $avg: "$totalSpent" } } }
    ];

    const lifetimeValueData = await Order.aggregate(lifetimeValuePipeline);
    res.json(lifetimeValueData);
  } catch (err) {
    console.error('Error fetching customer lifetime value data:', err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTotalSalesOverTime,
  getSalesGrowthRateOverTime,
  getNewCustomersTest,
  getRepeatCustomers,
  getGeographicalDistribution,
  getCustomerLifetimeValue,
};
