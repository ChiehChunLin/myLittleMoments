const babyConst = require("./getBabyConst");
const dailyData = [
  {
    date: "2024-06-17",
    dailyMilk: 500,
    dailyFood: 200,
    dailySleep: 10,
    dailyMedicine: 20,
    daily: [
      {
        starttime: "2024-06-17 00:00:00",
        endtime: "2024-06-17 08:00:00",
        activity: babyConst.babyActivity.SLEEP,
        quantity: 8,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.SLEEP]
      },
      {
        starttime: "2024-06-17 09:00:00",
        endtime: "2024-06-17 09:30:00",
        activity: babyConst.babyActivity.MILK,
        quantity: 200,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.MILK]
      },
      {
        starttime: "2024-06-17 11:00:00",
        endtime: "2024-06-17 12:30:00",
        activity: babyConst.babyActivity.FOOD,
        quantity: 100,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.FOOD]
      },
      {
        starttime: "2024-06-17 13:00:00",
        endtime: "2024-06-17 14:00:00",
        activity: babyConst.babyActivity.SLEEP,
        quantity: 1,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.SLEEP]
      },
      {
        starttime: "2024-06-17 15:00:00",
        endtime: "2024-06-17 15:30:00",
        activity: babyConst.babyActivity.MILK,
        quantity: 120,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.MILK]
      },
      {
        starttime: "2024-06-17 17:00:00",
        endtime: "2024-06-17 18:00:00",
        activity: babyConst.babyActivity.FOOD,
        quantity: 80,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.FOOD]
      },
      {
        starttime: "2024-06-17 22:00:00",
        endtime: "2024-06-17 24:00:00",
        activity: babyConst.babyActivity.SLEEP,
        quantity: 2,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.FOSLEEPOD]
      }
    ]
  },
  {
    date: "2024-06-18",
    dailyMilk: 500,
    dailyFood: 200,
    dailySleep: 10,
    dailyMedicine: 20,
    daily: [
      {
        starttime: "2024-06-18 00:00:00",
        endtime: "2024-06-18 05:30:00",
        activity: babyConst.babyActivity.SLEEP,
        quantity: 5.5,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.SLEEP]
      },
      {
        starttime: "2024-06-18 06:00:00",
        endtime: "2024-06-18 06:30:00",
        activity: babyConst.babyActivity.MILK,
        quantity: 160,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.MILK]
      },
      {
        starttime: "2024-06-18 11:00:00",
        endtime: "2024-06-18 12:00:00",
        activity: babyConst.babyActivity.FOOD,
        quantity: 80,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.FOOD]
      },
      {
        starttime: "2024-06-18 14:00:00",
        endtime: "2024-06-18 14:40:00",
        activity: babyConst.babyActivity.SLEEP,
        quantity: 0.6,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.SLEEP]
      },
      {
        starttime: "2024-06-18 15:00:00",
        endtime: "2024-06-18 15:30:00",
        activity: babyConst.babyActivity.MILK,
        quantity: 200,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.MILK]
      },
      {
        starttime: "2024-06-18 18:30:00",
        endtime: "2024-06-18 19:00:00",
        activity: babyConst.babyActivity.FOOD,
        quantity: 120,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.FOOD]
      },
      {
        starttime: "2024-06-18 21:00:00",
        endtime: "2024-06-18 24:00:00",
        activity: babyConst.babyActivity.SLEEP,
        quantity: 3,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.FOSLEEPOD]
      }
    ]
  },
  {
    date: "2024-06-19",
    dailyMilk: 500,
    dailyFood: 200,
    dailySleep: 10,
    dailyMedicine: 20,
    daily: [
      {
        starttime: "2024-06-19 00:00:00",
        endtime: "2024-06-19 05:30:00",
        activity: babyConst.babyActivity.SLEEP,
        quantity: 5.5,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.SLEEP]
      },
      {
        starttime: "2024-06-19 06:00:00",
        endtime: "2024-06-19 06:30:00",
        activity: babyConst.babyActivity.MILK,
        quantity: 160,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.MILK]
      },
      {
        starttime: "2024-06-19 11:00:00",
        endtime: "2024-06-19 12:00:00",
        activity: babyConst.babyActivity.FOOD,
        quantity: 80,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.FOOD]
      },
      {
        starttime: "2024-06-19 14:00:00",
        endtime: "2024-06-19 14:40:00",
        activity: babyConst.babyActivity.SLEEP,
        quantity: 0.6,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.SLEEP]
      },
      {
        starttime: "2024-06-19 15:00:00",
        endtime: "2024-06-19 15:30:00",
        activity: babyConst.babyActivity.MILK,
        quantity: 200,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.MILK]
      },
      {
        starttime: "2024-06-19 18:30:00",
        endtime: "2024-06-19 19:00:00",
        activity: babyConst.babyActivity.FOOD,
        quantity: 120,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.FOOD]
      },
      {
        starttime: "2024-06-19 21:00:00",
        endtime: "2024-06-19 24:00:00",
        activity: babyConst.babyActivity.SLEEP,
        quantity: 3,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.FOSLEEPOD]
      }
    ]
  },
  {
    date: "2024-06-20",
    dailyMilk: 500,
    dailyFood: 200,
    dailySleep: 10,
    dailyMedicine: 20,
    daily: [
      {
        starttime: "2024-06-20 00:00:00",
        endtime: "2024-06-20 05:30:00",
        activity: babyConst.babyActivity.SLEEP,
        quantity: 5.5,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.SLEEP]
      },
      {
        starttime: "2024-06-20 06:00:00",
        endtime: "2024-06-20 06:30:00",
        activity: babyConst.babyActivity.MILK,
        quantity: 160,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.MILK]
      },
      {
        starttime: "2024-06-20 11:00:00",
        endtime: "2024-06-20 12:00:00",
        activity: babyConst.babyActivity.FOOD,
        quantity: 80,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.FOOD]
      },
      {
        starttime: "2024-06-20 14:00:00",
        endtime: "2024-06-20 14:40:00",
        activity: babyConst.babyActivity.SLEEP,
        quantity: 0.6,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.SLEEP]
      },
      {
        starttime: "2024-06-20 15:00:00",
        endtime: "2024-06-20 15:30:00",
        activity: babyConst.babyActivity.MILK,
        quantity: 200,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.MILK]
      },
      {
        starttime: "2024-06-20 18:30:00",
        endtime: "2024-06-20 19:00:00",
        activity: babyConst.babyActivity.FOOD,
        quantity: 120,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.FOOD]
      },
      {
        starttime: "2024-06-20 21:00:00",
        endtime: "2024-06-20 24:00:00",
        activity: babyConst.babyActivity.SLEEP,
        quantity: 3,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.FOSLEEPOD]
      }
    ]
  },
  {
    date: "2024-06-21",
    dailyMilk: 500,
    dailyFood: 200,
    dailySleep: 10,
    dailyMedicine: 20,
    daily: [
      {
        starttime: "2024-06-21 00:00:00",
        endtime: "2024-06-21 05:30:00",
        activity: babyConst.babyActivity.SLEEP,
        quantity: 5.5,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.SLEEP]
      },
      {
        starttime: "2024-06-21 06:00:00",
        endtime: "2024-06-21 06:30:00",
        activity: babyConst.babyActivity.MILK,
        quantity: 160,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.MILK]
      },
      {
        starttime: "2024-06-21 11:00:00",
        endtime: "2024-06-21 12:00:00",
        activity: babyConst.babyActivity.FOOD,
        quantity: 80,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.FOOD]
      },
      {
        starttime: "2024-06-21 14:00:00",
        endtime: "2024-06-21 14:40:00",
        activity: babyConst.babyActivity.SLEEP,
        quantity: 0.6,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.SLEEP]
      },
      {
        starttime: "2024-06-21 15:00:00",
        endtime: "2024-06-21 15:30:00",
        activity: babyConst.babyActivity.MILK,
        quantity: 200,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.MILK]
      },
      {
        starttime: "2024-06-21 18:30:00",
        endtime: "2024-06-21 19:00:00",
        activity: babyConst.babyActivity.FOOD,
        quantity: 120,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.FOOD]
      },
      {
        starttime: "2024-06-21 21:00:00",
        endtime: "2024-06-21 24:00:00",
        activity: babyConst.babyActivity.SLEEP,
        quantity: 3,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.FOSLEEPOD]
      }
    ]
  },
  {
    date: "2024-06-22",
    dailyMilk: 500,
    dailyFood: 200,
    dailySleep: 10,
    dailyMedicine: 20,
    daily: [
      {
        starttime: "2024-06-22 00:00:00",
        endtime: "2024-06-22 05:30:00",
        activity: babyConst.babyActivity.SLEEP,
        quantity: 5.5,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.SLEEP]
      },
      {
        starttime: "2024-06-22 06:00:00",
        endtime: "2024-06-22 06:30:00",
        activity: babyConst.babyActivity.MILK,
        quantity: 160,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.MILK]
      },
      {
        starttime: "2024-06-22 11:00:00",
        endtime: "2024-06-22 12:00:00",
        activity: babyConst.babyActivity.FOOD,
        quantity: 80,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.FOOD]
      },
      {
        starttime: "2024-06-22 14:00:00",
        endtime: "2024-06-22 14:40:00",
        activity: babyConst.babyActivity.SLEEP,
        quantity: 0.6,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.SLEEP]
      },
      {
        starttime: "2024-06-22 15:00:00",
        endtime: "2024-06-22 15:30:00",
        activity: babyConst.babyActivity.MILK,
        quantity: 200,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.MILK]
      },
      {
        starttime: "2024-06-22 18:30:00",
        endtime: "2024-06-22 19:00:00",
        activity: babyConst.babyActivity.FOOD,
        quantity: 120,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.FOOD]
      },
      {
        starttime: "2024-06-22 21:00:00",
        endtime: "2024-06-22 24:00:00",
        activity: babyConst.babyActivity.SLEEP,
        quantity: 3,
        unit: babyConst.babyActivityUnit[babyConst.babyActivity.FOSLEEPOD]
      }
    ]
  }
];

module.exports = dailyData;
