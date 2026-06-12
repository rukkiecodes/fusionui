<template>
  <vd-card type="10" style="max-width: 340px">
    <template #front>
      <div class="cc cc--front">
        <div class="cc-top">
          <span class="cc-bank">VUE BANK</span>
          <vd-icon icon="wifi" />
        </div>
        <div class="cc-chip" />
        <div class="cc-number">4921 8830 2217 6043</div>
        <div class="cc-row">
          <div>
            <small>CARD HOLDER</small>
            <div>ADA LOVELACE</div>
          </div>
          <div>
            <small>EXPIRES</small>
            <div>08/28</div>
          </div>
        </div>
      </div>
    </template>
    <template #back>
      <div class="cc cc--back">
        <div class="cc-stripe" />
        <div class="cc-sign"><span>342</span></div>
        <div class="cc-tag">VUE BANK · Customer service 1-800-VUE-BANK</div>
      </div>
    </template>
  </vd-card>
</template>

<style scoped>
:deep(.vd-card) {
  height: 214px;
}

.cc {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  color: #fff;
  font-family: 'SF Mono', ui-monospace, monospace;
}

.cc--front {
  padding: 20px;
  background: linear-gradient(135deg, #195bff 0%, #7c3aed 60%, #c026ff 100%);
}

.cc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.cc-bank {
  font-weight: 700;
  letter-spacing: 0.06em;
}

.cc-chip {
  width: 44px;
  height: 34px;
  margin: 18px 0 16px;
  border-radius: 7px;
  background: linear-gradient(135deg, #f5d57e, #d4a838);
}

.cc-number {
  font-size: 1.25rem;
  letter-spacing: 0.12em;
}

.cc-row {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  font-size: 0.85rem;
}
.cc-row small {
  display: block;
  font-size: 0.6rem;
  opacity: 0.7;
  letter-spacing: 0.08em;
}

.cc--back {
  padding: 18px 0;
  background: linear-gradient(135deg, #2c3e50, #1a2530);
}
.cc-stripe {
  height: 42px;
  margin: 6px 0 16px;
  background: #11161c;
}
.cc-sign {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 34px;
  margin: 0 18px;
  padding: 0 12px;
  border-radius: 5px;
  background: repeating-linear-gradient(45deg, #fff, #fff 6px, #e7e7e7 6px, #e7e7e7 12px);
  color: #1a2530;
  font-weight: 700;
}
.cc-tag {
  margin: auto 18px 0;
  font-size: 0.62rem;
  opacity: 0.6;
}
</style>
