<template>
  <div class="my-8">
    <div class="text-center mb-8">NHẬP SỐ LƯỢNG BÁN</div>
    <v-row>
      <v-col class="pb-0 mb-0" cols="12" md="3" v-for="(item, i) in list" :key="i">
        <div class="d-flex align-center">
          <v-btn @click="item.quantity++">{{item.name}}</v-btn>
          <v-text-field
            height="30"
            hide-details
            class="ml-2"
            style="max-width : 70px;"
            outlined
            dense
            type="number"
            min="0"
            v-model="item.quantity"
          ></v-text-field>
        </div>
      </v-col>
    </v-row>

    <div class="text-right mt-8">
      <div>{{ now() }}</div>
      <div>Doanh thu : {{revenue | currency('Đ')}}</div>
    </div>
    <div class="line"></div>
    <div class="text-center mb-8">NGUYÊN VẬT LIỆU TIÊU HAO</div>
    <v-row class="justify-center mt-8">
      <div>{{ now() }}</div>
    </v-row>
    <v-row>
      <v-col class="pb-0 mb-0" cols="12" md="3" v-for="(item, i) in materials" :key="i">
        <div class="d-flex align-center">
          <v-btn>{{item.name}}</v-btn>
          <div class="input-material hide-scroll">
            {{item.quantity}}{{item.unit}}
            <span
              v-if="item.exchangeNum"
              style="color : grey"
            >({{Math.floor(item.quantity * item.exchangeNum)}}{{item.unit === 'g' ? 'ml' : 'g'}})</span>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { items, material } from "@/static/Items.js";
import moment from "moment";
export default {
  data() {
    let list = items.map(e => {
      return { ...e, quantity: 0 };
    });
    let materials = material.map(e => {
      return { ...e, quantity: 0 };
    });
    return {
      list,
      materials,
      revenue: 0
    };
  },
  methods: {
    now() {
      return moment(new Date()).format("DD/MM/YYYY HH:mm");
    },
    useMaterial() {
      this.materials = this.materials.map(e => {
        return { ...e, quantity: 0 };
      });
      let useMaterialList = this.list.filter(e => {
        return Number(e.quantity) > 0;
      });
      useMaterialList.forEach(e => {
        e.use.forEach(i => {
          let id = Number(i.split("_")[0]);
          let quantity = Number(i.split("_")[1]) * Number(e.quantity);
          let temp = this.materials.find(a => {
            return a.id == id;
          });
          if (temp) {
            temp.quantity += quantity;
          }
        });
      });
    },
    revenueComputed() {
      let revenue = 0;
      this.list.forEach(e => {
        console.log("e", e);
        let total = Number(e.quantity) * e.price;
        console.log("total", total);
        revenue += total;
      });
      console.log(revenue);
      this.revenue = revenue;
    }
  },
  watch: {
    list: {
      deep: true,
      handler(val, oldVal) {
        this.useMaterial();
        this.revenueComputed();
      }
    }
  }
};
</script>
<style>
.input-material {
  height: 38px;
  border: solid 1px #5a5a5a;
  border-radius: 4px;
  width: auto;
  margin-left: 10px;
  padding: 5px;
  overflow: scroll;
}
.line {
  border-bottom: solid 1px #ccc;
  margin-top: 50px;
  margin-bottom: 20px;
}
.hide-scroll::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */

.hide-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scroll {
  overflow-x: scroll;
}
</style>
