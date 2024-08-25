const express = require("express");
const router = express.Router();
const { getTotalSalesOverTime, getSalesGrowthRateOverTime, getNewCustomersTest, getRepeatCustomers, getGeographicalDistribution, getCustomerLifetimeValue } = require("../controllers/analyticsControllers");


router.get("/sales-over-time/:interval",getTotalSalesOverTime);
router.get("/sales-growth-rate",getSalesGrowthRateOverTime);
router.get("/new-customers",getNewCustomersTest);
router.get("/repeat-customers",getRepeatCustomers);
router.get("/geographical-distribution",getGeographicalDistribution);
router.get("/customer-lifetime-value",getCustomerLifetimeValue);



module.exports = router;