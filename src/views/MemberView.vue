<template>
  <div>
    <img
      src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4bcc2548-937b-4948-a8de-df85c179759b/dclcb4s-c9b126cf-505d-4d7b-a25f-9b0df66b5d92.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi80YmNjMjU0OC05MzdiLTQ5NDgtYThkZS1kZjg1YzE3OTc1OWIvZGNsY2I0cy1jOWIxMjZjZi01MDVkLTRkN2ItYTI1Zi05YjBkZjY2YjVkOTIuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.p8x1NPx9cI-TiqRMrfc4xjY7zzO5SCWiGsnjdkUQi78"
      alt=""
      class="loading"
      v-if="!loaded"
    />
    <div class="memberCard" v-if="loaded">
      <div class="informations">
        <table>
          <tbody>
            <tr>
              <td>เซิร์ฟเวอร์:</td>
              <td>
                <a
                  :href="
                    'https://' + informations.fields.ServerID + '.dnd-for.us'
                  "
                  target="_blank"
                  >{{ informations.fields.ServerID }}</a
                >
              </td>
            </tr>
            <tr>
              <td>เจ้าของ:</td>
              <td>{{ informations.fields.Owner.fields.FacebookName }}</td>
            </tr>
            <tr>
              <td>แพคเกจ:</td>
              <td>{{ informations.fields.Products.fields.Title }}</td>
            </tr>
            <tr>
              <td>เป็นสมาชิกตั้งแต่:</td>
              <td>
                {{ dayjs(informations.fields.FirstMonth).format("DD/MM/YYYY") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="stamps">
        <div
          v-for="(dis, index) in stamps"
          :key="index"
          class="stamp"
          :class="{ pump: index < informations.fields.MonthActive }"
        >
          <img src="/imgs/stamp.png" alt="stamp" />
          <p class="month">
            {{ index + 1 }}
          </p>
          <img class="discount" src="/imgs/10dis.png" v-if="dis == 10" />
          <img class="discount" src="/imgs/20dis.png" v-if="dis == 20" />
        </div>
      </div>
    </div>
    <p class="disclaimer">
      สิทธิพิเศษนี้สำหรับสมาชิกที่ต่ออายุต่อเนื่องเท่านั้น <br />
      โดยส่วนลดจะถูกหักโดยอัตโนมัติในรอบบิลที่ 6 และ 12 <br />
      ทั้งนี้ไม่สามารถโอนสิทธิ์ให้บัญชีอื่นหรือเซิร์ฟเวอร์อื่นได้
    </p>
  </div>
</template>

<script setup>
import axios from "axios";
import dayjs from "dayjs";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const stamps = [0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 20];

const loaded = ref(false);
const memberID = useRoute().params.memberID;
const informations = ref([]);

onMounted(() => {
  axios
    .get(
      `https://ndb.3xbun.com/api/v3/data/p0w0egc69gysun8/mpjw5xxzr2364bf/records?where=%28ServerID%2C%20eq%2C%20${memberID}%29`,
      {
        headers: {
          "xc-token": import.meta.env.VITE_NDB_API,
        },
      },
    )
    .then((res) => {
      informations.value = res.data.records[0];
      loaded.value = true;
    })
    .catch((err) => console.log(err));
});
</script>

<style scoped>
table {
  width: 100%;
}
tr {
  width: 100%;
  display: flex;
}

td {
  width: 100%;
}

td:first-child {
  width: 30%;
  text-align: right;
  padding-right: 0.5em;
  font-weight: bold;
}

.stamps {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  background-color: #121212;
  border-radius: 1em;
  margin-top: 1em;
  padding: 1em 0 0.5em;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.stamp {
  width: 16%;
  position: relative;
  filter: grayscale(1);
}

.pump {
  filter: none;
}

.month {
  position: absolute;
  width: 2em;
  text-align: center;
  top: 0;
  right: 31%;
  color: #ffde59;
}

.discount {
  position: absolute;
  width: 2em;
  text-align: center;
  top: 40%;
  right: 45%;
  color: #ffde59;
}

.disclaimer {
  color: #5f5f5f;
  text-align: center;
}

.loading {
  filter: hue-rotate(300deg) saturate(200%);
}

@media screen and (max-width: 600px) {
  .discount {
    width: 1.8em;
  }

  .month {
    top: -5%;
  }
}
</style>
