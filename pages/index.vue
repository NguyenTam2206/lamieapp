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

    <div class="text-center mt-8 board">
      <div>{{ now() }}</div>
      <v-row>
        <v-col cols="12" md="6">
          <div>Thu</div>
          <div>{{revenue | currency('Đ')}}</div>
        </v-col>
        <v-col cols="12" md="6">
          <div>Chi</div>
          <div>
            <div>{{out | currency('Đ')}}</div>
            <div class="grey--text">{{outNote ? `(${outNote})` : ''}}</div>
            <v-dialog v-model="dialog" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn small dark v-bind="attrs" v-on="on">Sửa</v-btn>
              </template>

              <v-card class="pt-8 px-4">
                <v-textarea
                  filled
                  name="input-7-4"
                  label="Diễn giải"
                  v-model="outNote"
                  placeholder="Chi ít thôi nhé"
                ></v-textarea>
                <v-text-field
                  height="30"
                  hide-details
                  class="ml-2"
                  outlined
                  dense
                  type="number"
                  label="Nhập tổng chi"
                  min="0"
                  v-model="out"
                ></v-text-field>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialog = false">Sửa</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </v-col>
      </v-row>
      <div class="text-center result">THU - CHI = {{revenue - out | currency('Đ')}}</div>
      <!-- <v-btn class="mt-4" @click="saveDialog = true">Lưu lại</v-btn> -->
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
    <v-dialog v-model="saveDialog" width="500">
      <v-card class="pt-8 px-4">
        <div>Thu : {{revenue | currency('Đ')}}</div>
        <div>
          Chi : {{out | currency('Đ')}}
          <span class="grey--text">{{outNote ? `(${outNote})` : ''}}</span>
        </div>
        <div>Thu - Chi = {{revenue - out | currency('Đ')}}</div>

        <v-text-field
          hide-details
          class="mt-4"
          outlined
          dense
          label="Nhập Mã Lưu"
          placeholder="Ví dụ ngày 16/02/2022. Nhập 16022022"
          v-model="idResult"
        ></v-text-field>
        <div class="red--text" v-if="showNoti">{{showNoti}}</div>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="save">Lưu</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      revenue: 0,
      out: 0,
      outNote: "",
      dialog: false,
      saveDialog: false,
      idResult: "",
      showNoti: ""
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
        let total = Number(e.quantity) * e.price;
        revenue += total;
      });
      this.revenue = revenue;
    },
    save() {
      if (this.idResult) {
        this.saveDialog = false;
        let data = {
          id: this.idResult,
          in: this.revenue,
          out: this.out,
          result: this.revenue - this.out
        };
        this.saveDB(data);
      } else {
        this.showNoti = "Vui lòng nhập mã tham chiếu";
        setTimeout(() => {
          this.showNoti = "";
        }, 3000);
      }
    },
    saveDB(data) {
      this.$axios({
        url: `${process.env.baseAPI}/result/`,
        method: "POST",
        data: data
      }).then(res => console.log("res", res.data));
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
.board {
  border: solid 1px #ccc;
  padding: 20px;
}
</style>
