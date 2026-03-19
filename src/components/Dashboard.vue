<template>
  <div class="overview">
    <div class="item">
      <p>Active MRR</p>
      <p class="number">
        <count-up :end-val="stats.mrr" class="inline"></count-up>฿
        <span
          v-if="stats.comparison.mrr"
          class="comparison"
          :class="{
            green: stats.mrr > stats.comparison.mrr,
            red: stats.mrr < stats.comparison.mrr,
          }"
          title="Change from previous month"
        >
          <i
            class="fa-duotone fa-solid"
            :class="{
              'fa-arrow-trend-up': stats.mrr > stats.comparison.mrr,
              'fa-arrow-trend-down': stats.mrr < stats.comparison.mrr,
            }"
          ></i>
          {{ Math.abs(stats.mrr - stats.comparison.mrr).toFixed(0) }}฿
        </span>
      </p>
    </div>
    <div class="item">
      <p>Active Subscriptions</p>
      <p class="number">
        <count-up :end-val="stats.activeSub"></count-up>
        <span
          v-if="stats.comparison.activeSub"
          class="comparison"
          :class="{
            green: stats.activeSub > stats.comparison.activeSub,
            red: stats.activeSub < stats.comparison.activeSub,
          }"
          title="Change from previous month"
        >
          <i
            class="fa-duotone fa-solid"
            :class="{
              'fa-arrow-trend-up': stats.activeSub > stats.comparison.activeSub,
              'fa-arrow-trend-down':
                stats.activeSub < stats.comparison.activeSub,
            }"
          ></i>
          {{ Math.abs(stats.activeSub - stats.comparison.activeSub) }}
        </span>
      </p>
    </div>
    <div class="item">
      <p>Customer Churn Rate</p>
      <p class="number">
        <count-up :end-val="(stats.churnRate * 100).toFixed(2)"></count-up>%
      </p>
    </div>
    <div class="item">
      <p>Average Revenue Per User (ARPU)</p>
      <p class="number">
        <count-up :end-val="stats.arpu"></count-up>฿
        <span
          v-if="stats.comparison.arpu"
          class="comparison"
          :class="{
            green: stats.arpu > stats.comparison.arpu,
            red: stats.arpu < stats.comparison.arpu,
          }"
          title="Change from previous month"
        >
          <i
            class="fa-duotone fa-solid"
            :class="{
              'fa-arrow-trend-up': stats.arpu > stats.comparison.arpu,
              'fa-arrow-trend-down': stats.arpu < stats.comparison.arpu,
            }"
          ></i>
          {{ Math.abs(stats.arpu - stats.comparison.arpu).toFixed(2) }}฿
        </span>
      </p>
    </div>
    <div class="item">
      <p>New Customers</p>
      <p class="number">
        <count-up :end-val="stats.newCustomers"></count-up>
        <span
          v-if="stats.comparison.newCustomers"
          class="comparison"
          :class="{
            green: stats.newCustomers > stats.comparison.newCustomers,
            red: stats.newCustomers < stats.comparison.newCustomers,
          }"
          title="Change from previous month"
        >
          <i
            class="fa-duotone fa-solid"
            :class="{
              'fa-arrow-trend-up':
                stats.newCustomers > stats.comparison.newCustomers,
              'fa-arrow-trend-down':
                stats.newCustomers < stats.comparison.newCustomers,
            }"
          ></i>
          {{ Math.abs(stats.newCustomers - stats.comparison.newCustomers) }}
        </span>
      </p>
    </div>
    <div class="item">
      <p>Avg. Subscription (Months)</p>
      <p class="number">
        <count-up
          :end-val="stats.avgSubLength"
          :options="{ decimalPlaces: 1 }"
        ></count-up>
      </p>
    </div>
    <div class="item">
      <p>Revenue Churn Rate</p>
      <p class="number">
        <count-up
          :end-val="(stats.revenueChurnRate * 100).toFixed(2)"
        ></count-up
        >%
      </p>
    </div>
    <div class="item">
      <p>Net MRR Growth</p>
      <p
        class="number"
        :class="{ green: stats.netMRRGrowth > 0, red: stats.netMRRGrowth < 0 }"
      >
        <count-up :end-val="stats.netMRRGrowth"></count-up>฿
      </p>
    </div>
  </div>
  <div class="breakdowns">
    <div class="breakdown">
      <h3>New Subscribers</h3>
      <ul>
        <li v-for="sale in newSubscribers" :key="sale.Id">
          <span>{{ sale.facebook_name }}</span>
          <span class="product-title">
            {{ (sale["Title (from Products)"] || []).join(", ") }}
          </span>
        </li>
      </ul>
    </div>
    <div class="breakdown">
      <h3>Next Collect</h3>
      <ul>
        <li v-for="sale in nextCollectSales" :key="sale.Id">
          <div>
            <span
              >{{ sale.facebook_name }} -
              {{ sale["Title (from Products)"][0] }}</span
            >
            <span class="product-title">
              {{ dayjs(sale["Next Collect"]).add(1, "day").fromNow() }}
            </span>
          </div>
          <div class="btns">
            <a
              :href="'https://m.me/' + sale.facebook_id"
              target="_blank"
              class="btn facebook"
              >Message <i class="fa-brands fa-facebook-messenger"></i
            ></a>
            <a class="btn">
              ต่ออายุ <i class="fa-duotone fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </li>
      </ul>
    </div>
    <div class="breakdown">
      <h3>Recent Churns</h3>
      <ul>
        <li v-for="sale in recentChurns" :key="sale.Id">
          <span>{{ sale.facebook_name }}</span>
          <span class="product-title">
            {{ (sale["Title (from Products)"] || []).join(", ") }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import CountUp from "vue-countup-v3";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { computed, onBeforeMount, ref } from "vue";

dayjs.extend(relativeTime);

const sales = ref([]);
const products = ref([]);

const newSubscribers = computed(() => {
  return sales.value
    .filter(
      (sale) =>
        dayjs().diff(
          dayjs(sale["Next Collect"]).subtract(sale.monthSubbed, "month"),
          "days",
        ) < 31,
    )
    .sort((a, b) => {
      const dateA = new Date(a["Next Collect"]);
      const dateB = new Date(b["Next Collect"]);

      return dateB - dateA;
    })
    .slice(0, 5);
});

const nextCollectSales = computed(() => {
  return sales.value
    .filter(
      (sale) =>
        sale.isActive &&
        dayjs(sale["Next Collect"]).add(1, "day").isAfter(dayjs()) &&
        dayjs(sale["Next Collect"]).add(1, "day").diff(dayjs(), "days") <= 7,
    )
    .sort((a, b) => {
      const dateA = new Date(a["Next Collect"]);
      const dateB = new Date(b["Next Collect"]);
      return dateA - dateB;
    });
});

const getRegisterDate = (sale) => {
  return dayjs(sale["Next Collect"]).subtract(sale.monthSubbed, "month");
};

const recentChurns = computed(() => {
  return sales.value
    .filter((sale) => !sale.isActive && sale.facebook_name)
    .sort((a, b) => {
      const dateA = new Date(a["Next Collect"]);
      const dateB = new Date(b["Next Collect"]);

      return dateB - dateA;
    })
    .slice(0, 5);
});

const productsByTitle = computed(() => {
  return products.value.reduce((acc, product) => {
    acc[product.Title] = product;
    return acc;
  }, {});
});

const stats = computed(() => {
  const getSalePrice = (sale) => {
    return (sale["Title (from Products)"] || []).reduce((total, title) => {
      const product = productsByTitle.value[title];
      return total + (product ? product.Price : 0);
    }, 0);
  };

  const activeSales = sales.value.filter((sale) => sale.isActive);
  const prevSales = sales.value.filter((sale) => {
    if (sale.monthSubbed > 1) {
      console.log(sale.server_name);
      console.log(
        dayjs().diff(dayjs(sale["Next Collect"]).subtract(1, "month"), "days"),
      );
    }
  });
  const churnedSales = sales.value.filter(
    (sale) => sale.Products && !sale.isActive,
  );
  const newSales = activeSales.filter((sale) => sale.monthSubbed === 1);

  const mrr = activeSales.reduce(
    (total, sale) => total + getSalePrice(sale),
    0,
  );
  const activeSub = activeSales.length;

  const customerChurnRate =
    sales.value.length > 0 ? churnedSales.length / sales.value.length : 0;

  const churnedMRR = churnedSales.reduce(
    (total, sale) => total + getSalePrice(sale),
    0,
  );
  const totalRevenueEver = sales.value.reduce(
    (total, sale) => total + getSalePrice(sale),
    0,
  );
  const revenueChurnRate =
    totalRevenueEver > 0 ? churnedMRR / totalRevenueEver : 0;

  const newMRR = newSales.reduce(
    (total, sale) => total + getSalePrice(sale),
    0,
  );
  const netMRRGrowth = newMRR - churnedMRR;

  const newCustomers = newSales.length;
  const totalSubMonths = activeSales.reduce(
    (total, sale) => total + (sale.monthSubbed || 0),
    0,
  );
  const avgSubLength = activeSub > 0 ? totalSubMonths / activeSub : 0;

  // --- Comparison Stats (Previous Month) ---
  const previous_mrr = mrr - netMRRGrowth;
  const previous_activeSub = activeSub - (newCustomers - churnedSales.length);
  const previous_arpu =
    previous_activeSub > 0 ? previous_mrr / previous_activeSub : 0;
  // Note: This is an estimate of new customers from last month who are still active.
  const previous_newCustomers = sales.value.filter(
    (s) => s.isActive && s.monthSubbed === 2,
  ).length;

  return {
    mrr,
    activeSub,
    churnRate: customerChurnRate,
    revenueChurnRate,
    netMRRGrowth,
    arpu: activeSub > 0 ? mrr / activeSub : 0,
    newCustomers,
    avgSubLength,
    comparison: {
      mrr: previous_mrr,
      activeSub: previous_activeSub,
      arpu: previous_arpu,
      newCustomers: previous_newCustomers,
    },
  };
});

onBeforeMount(() => {
  const options = {
    method: "GET",
    headers: {
      "xc-token": import.meta.env.VITE_NDB_API,
    },
  };

  const salesRequest = axios.request({
    ...options,
    url: "https://ndb.3xbun.com/api/v2/tables/mhx7o45kfyq1aqz/records",
    params: { offset: "0", limit: "-1", where: "", viewId: "vw10kc2ltwqc5grk" },
  });

  const productsRequest = axios.request({
    ...options,
    url: "https://ndb.3xbun.com/api/v2/tables/mewoz8qeuqb30bb/records",
    params: { offset: "0", limit: "-1", where: "", viewId: "vwoh8kczrkuwotwk" },
  });

  Promise.all([salesRequest, productsRequest])
    .then(([salesRes, productsRes]) => {
      sales.value = salesRes.data.list;
      products.value = productsRes.data.list;
    })
    .catch((err) => console.error(err));
});
</script>

<style lang="css" scoped>
.overview {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1em;
  margin: 1em 0;
}

.item {
  flex-grow: 1;
  flex-basis: 200px;
  background-color: #353535;
  padding: 1em 1em;
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.primary {
  background-color: #1a6f43;
}

.number {
  font-size: 2em;
  font-weight: 500 !important;
  display: flex;
  align-items: center;
}

.item > p {
  margin: 0;
  font-weight: 200;
}

.comparison {
  font-size: 0.6em;
  font-weight: 500;
  margin-left: 0.5em;
  display: flex;
  align-items: center;
}

.comparison i {
  margin-right: 0.25em;
}

.number.green {
  color: #42b983;
}

.red {
  color: #db292f;
}

.breakdowns {
  display: flex;
  gap: 1em;
  margin-top: 1em;
  flex-direction: column;
}

.breakdown {
  flex: 1;
  background-color: #353535;
  padding: 1em;
  border-radius: 0.5em;
}

.breakdown ul {
  list-style: none;
  padding: 0;
}

.breakdown li {
  display: flex;
  justify-content: space-between;
  padding: 0.5em;
  border-radius: 0.5em;
}

.breakdown li:nth-child(even) {
  background-color: #303030;
}

.breakdown li > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.product-title {
  font-style: italic;
  color: #aaa;
}

.btn {
  background-color: #db292f;
  width: fit-content;
  padding: 0.25em 0.5em;
  border-radius: 0.5em;
  cursor: pointer;
  color: white;
  text-decoration: none;
  align-self: center;
}

.btns {
  gap: 0.5em;
}

.btns .btn {
  width: 100%;
  text-align: right;
}

.btn i {
  margin-left: 0.25em;
}

.facebook {
  background: #0866ff;
}
</style>
