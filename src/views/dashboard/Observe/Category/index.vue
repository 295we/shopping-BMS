<template>
  <div>
    <el-card>
      <div slot="header">
        <div class="category-header">
          <span>销售额类别占比</span>
          <el-radio-group v-model="value">
            <el-radio-button label="全部渠道"></el-radio-button>
            <el-radio-button label="线上"></el-radio-button>
            <el-radio-button label="门店"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <!-- echarts -->
      <div>
        <div class="echarts" ref="echarts"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
import { mapState } from "vuex";
export default {
  name: "Category",
  data() {
    return {
      value: "全部渠道",
      myCharts: null,
    };
  },
  mounted() {
    this.myCharts = echarts.init(this.$refs.echarts);
    let option = {
      tooltip: {
        trigger: "item",
      },
      title: {
        text: "家用电器",
        subtext: 244,
        left: "center",
        top: "center",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },

          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "家用电器" },
            { value: 735, name: "母婴产品" },
            { value: 580, name: "服饰箱包" },
            { value: 484, name: "个护健康" },
            { value: 1888, name: "其他" },
            { value: 932, name: "食用酒水" },
          ],
        },
      ],
    };
    //   给图表绑定事件
    this.myCharts.on("mouseover", (params) => {
      // 获取鼠标移上去的那条数据
      const { name, value } = params.data;
      //   重新设置标题
      this.myCharts.setOption({
        title: {
          text: name,
          subtext: value,
        },
      });
    });
    this.myCharts.setOption(option);
  },
  computed: {
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  watch: {
    value: {
      handler() {
        if (this.value == "线上") {
          this.myCharts.setOption({
            series: {
              data: [
                {
                  value: this.listState.saleRank.online.value[0],
                  name: this.listState.saleRank.online.name[0],
                },
                {
                  value: this.listState.saleRank.online.value[1],
                  name: this.listState.saleRank.online.name[1],
                },
                {
                  value: this.listState.saleRank.online.value[2],
                  name: this.listState.saleRank.online.name[2],
                },
                {
                  value: this.listState.saleRank.online.value[3],
                  name: this.listState.saleRank.online.name[3],
                },
                {
                  value: this.listState.saleRank.online.value[4],
                  name: this.listState.saleRank.online.name[4],
                },
                {
                  value: this.listState.saleRank.online.value[5],
                  name: this.listState.saleRank.online.name[5],
                },
              ],
            },
          });
        } else if (this.value == "门店") {
          this.myCharts.setOption({
            series: {
              data: [
                {
                  value: this.listState.saleRank.shop.value[0],
                  name: this.listState.saleRank.shop.name[0],
                },
                {
                  value: this.listState.saleRank.shop.value[1],
                  name: this.listState.saleRank.shop.name[1],
                },
                {
                  value: this.listState.saleRank.shop.value[2],
                  name: this.listState.saleRank.shop.name[2],
                },
                {
                  value: this.listState.saleRank.shop.value[3],
                  name: this.listState.saleRank.shop.name[3],
                },
                {
                  value: this.listState.saleRank.shop.value[4],
                  name: this.listState.saleRank.shop.name[4],
                },
                {
                  value: this.listState.saleRank.shop.value[5],
                  name: this.listState.saleRank.shop.name[5],
                },
              ],
            },
          });
        } else if (this.value == "全部渠道") {
          this.myCharts.setOption({
            series: {
              data: [
                { value: 1048, name: "家用电器" },
                { value: 735, name: "母婴产品" },
                { value: 580, name: "服饰箱包" },
                { value: 484, name: "个护健康" },
                { value: 1888, name: "其他" },
                { value: 932, name: "食用酒水" },
              ],
            },
          });
        }
      },
    },
  },
};
</script>

<style>
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.echarts {
  width: 100%;
  height: 300px;
}
</style>
