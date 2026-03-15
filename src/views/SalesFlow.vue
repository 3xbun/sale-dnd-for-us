<template>
  <div>
    <h2>Sales Flow</h2>
    <hr />

    <div class="step-navigation">
      <button
        @click="currentStep--"
        :disabled="currentStep <= 1"
        class="nav-btn"
      >
        <i class="fa-duotone fa-solid fa-arrow-left"></i>
      </button>
      <h3>ขั้นตอนที่ {{ currentStep }}: {{ stepTitles[currentStep - 1] }}</h3>
      <button
        @click="currentStep++"
        :disabled="currentStep >= 5"
        class="nav-btn"
      >
        <i class="fa-duotone fa-solid fa-arrow-right"></i>
      </button>
    </div>

    <div class="content">
      <div class="step-wrapper">
        <!-- STEP 1 -->
        <div v-show="currentStep === 1" class="step-container">
          <strong>Inquiry & Qualification (รับโจทย์)</strong>
          <p>
            เมื่อลูกค้าทักมา (DM/Line/Inbox) อย่าเพิ่งขายทันที
            ให้ถามคำถามเหล่านี้ก่อน:
          </p>
          <ul>
            <li>ปกติเล่นกันกี่คน</li>
            <li>
              ใช้ Module เยอะไหม หรือเน้นใช้ภาพความละเอียดสูง (4K) หรือเปล่า
            </li>
            <li>เคยใช้ Foundry มาก่อนไหม</li>
          </ul>
        </div>

        <!-- STEP 2 -->
        <div v-show="currentStep === 2" class="step-container">
          <strong>Selection (เลือกแพ็กเกจ)</strong>
          <div class="images">
            <img
              v-for="t in tiers"
              :key="t.id"
              @click="selectTier(t)"
              :src="t.img"
              :alt="'tier' + t.id"
              :class="{ active: tier === t.id }"
            />
          </div>
          <div class="options">
            <p
              class="btn"
              @click="customer = 50"
              :class="{ active: customer == 50 }"
            >
              ผู้ใช้ใหม่
            </p>
            <p
              class="btn"
              @click="customer = 0"
              :class="{ active: customer == 0 }"
            >
              ผู้ใช้เก่า
            </p>
          </div>
        </div>

        <!-- STEP 3 -->
        <div v-show="currentStep === 3" class="step-container payment">
          <strong>Payment (ชำระเงิน)</strong>
          <p>
            จำนวนเงินที่ต้องชำระ: <strong>{{ customer + price }}</strong> บาท
          </p>
          <img src="/imgs/qr-code.png" class="background" />
        </div>

        <!-- STEP 4 -->
        <div v-show="currentStep === 4" class="step-container">
          <strong>Setup Server (ตั้งค่า Server)</strong>
          <p class="toCopy">
            ขณะนี้ทางเราเตรียมระบบ Foundry VTT Server
            ให้พร้อมใช้งานเรียบร้อยแล้ว 🎉 เพื่อให้การตั้งค่าเสร็จสมบูรณ์
            รบกวนแจ้ง URL ที่ต้องการ (ตัวอย่าง: cool-name.dnd-for.us)
          </p>
          <p class="toCopy">
            เมื่อได้รับข้อมูลเรียบร้อย
            จะรีบดำเนินการในขั้นตอนสุดท้ายและแจ้งยืนยันการเข้าใช้งานทันที 🏹✨
          </p>
          <p class="toCopy">ขอบคุณที่ใช้บริการ D&D: For Us 🐉</p>
          <p @click="copyText" class="btn">
            คัดลอก<i class="fa-duotone fa-solid fa-copy"></i>
          </p>
        </div>

        <!-- STEP 5 -->
        <div v-show="currentStep === 5" class="step-container">
          <strong>Handover (ส่งมอบ Server)</strong> <br />
          <p>
            <input
              type="text"
              placeholder="URL Server"
              v-model="serverURL"
            />.dnd-for.us
          </p>
          <p class="toCopy">Server Foundry VTT ของคุณพร้อมใช้งานแล้ว</p>
          <p class="toCopy">เปิดใช้งานได้แล้วที่:</p>
          <p class="toCopy">🔗 URL: {{ serverURL }}.dnd-for.us</p>
          <p class="toCopy">
            🔑 รหัสผ่าน Admin: สามารถตั้งได้เองเมื่อเข้าใช้งานครั้งแรก
            อย่าลืมตั้งรหัสผ่านเพื่อความปลอดภัย
          </p>
          <p class="toCopy">
            ขอบคุณที่ใช้บริการเช่า Server กับเรา ขอให้เป็น Campaign
            ที่ยอดเยี่ยม!
          </p>
          <p @click="copyText" class="btn">
            คัดลอก<i class="fa-duotone fa-solid fa-copy"></i>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watchEffect, ref, computed } from "vue";
import mergeImages from "merge-images";
import generatePayload from "promptpay-qr";
import QRCode from "qrcode";

const currentStep = ref(1);
const stepTitles = ref([
  "Inquiry & Qualification (รับโจทย์)",
  "Selection (เลือกแพ็กเกจ)",
  "Payment (ชำระเงิน)",
  "Setup Server (ตั้งค่า Server)",
  "Handover (ส่งมอบ Server)",
]);

const tiers = ref([
  { id: 4, price: 99, img: "/imgs/tier4.png" },
  { id: 1, price: 129, img: "/imgs/tier1.png" },
  { id: 2, price: 199, img: "/imgs/tier2.png" },
  { id: 3, price: 499, img: "/imgs/tier3.png" },
]);

const tier = ref(1);
const price = computed(
  () => tiers.value.find((t) => t.id === tier.value)?.price || 0,
);

const selectTier = (selectedTier) => {
  tier.value = selectedTier.id;
};

const customer = ref(50);
const serverURL = ref();

const copyText = (event) => {
  const parent = event.currentTarget.parentElement;
  const texts = parent.querySelectorAll(".toCopy");
  const textToCopy = Array.from(texts)
    .map((el) => el.innerText)
    .join("\n");
  navigator.clipboard.writeText(textToCopy);
};

const generateQRCode = async () => {
  const payload = generatePayload("1103702535150", {
    amount: customer.value + price.value,
  });
  const qrBase64 = await QRCode.toDataURL(payload, {
    margin: 2,
    width: 500,
  });

  mergeImages(
    [
      { src: "imgs/qr-code.png" },
      { src: qrBase64, x: 250, y: 250, width: 300, height: 300 },
    ],
    {
      width: 1000,
      height: 1000,
    },
  ).then((b64) => {
    const qrImg = document.querySelector("img.background");
    if (qrImg) {
      qrImg.src = b64;
    }
  });
};

watchEffect(() => {
  // Re-generate QR code when selections change
  if (price.value !== undefined) {
    generateQRCode();
  }
});
</script>

<style lang="css" scoped>
.step-container {
  margin: 1em;
  margin-left: 1em;
  background-color: #353535;
  padding: 1em;
  border-radius: 0.5em;
}

.step-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1em;
}

.nav-btn {
  background-color: #db292f;
  color: white;
  border: none;
  padding: 0.5em 1em;
  border-radius: 0.5em;
  cursor: pointer;
  width: 10%;
}

.nav-btn:disabled {
  background-color: #535353;
  cursor: not-allowed;
}

.images {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-around;
  gap: 0.5em;
}

.images img {
  width: 33%;
  border-radius: 0.5em;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.btn {
  background-color: #db292f;
  width: fit-content;
  padding: 0.25em 0.5em;
  border-radius: 0.5em;
  cursor: pointer;
}

.payment {
  position: relative;
}

.background {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.qrcode {
  position: absolute;
  top: 25%;
  left: 50%;
  width: 65%;
  transform: translateX(-50%);
  border-radius: 1em;
}

img.active {
  border: solid 2px #db292f;
}

.options {
  display: flex;
  justify-content: center;
  gap: 1em;
}

.options > .btn {
  background-color: #535353;
}

.btn.active {
  background-color: #db292f;
}
</style>
