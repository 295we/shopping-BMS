<template>
  <el-card style="margin: 10px 0">
    <div slot="header" class="clearfix">
      <!-- v-model="activeName" @tab-click="handleClick" -->
      <!-- 头部左侧内容 -->
      <el-tabs class="tab" v-model="activeName">
        <!-- 头部左侧内容 -->
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="headR">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!-- 日历 -->
        <el-date-picker
          v-model="date"
          class="date"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6" class="right">
          <div style="font-weight: 700">门店{{ title }}排名</div>
          <ul v-if="title == '销售额'">
            <li v-for="(sale, index) in saleRank" :key="index">
              <span class="rindex">{{ index + 1 }}</span>
              <span style="margin: 0 20px">{{ sale.name }}</span>
              <span class="rvalue">{{ sale.money }}</span>
            </li>
          </ul>
          <ul v-else>
            <li v-for="(sale, index) in userRank" :key="index">
              <span class="rindex">{{ index + 1 }}</span>
              <span style="margin: 0 20px">{{ sale.name }}</span>
              <span class="rvalue">{{ sale.money }}</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
// 引入echarts
import echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",

      myCharts: null,
      // 收集日历的数据
      date: [],
    };
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listState: (state) => state.home.list,
    }),
    saleRank() {
      return this.listState.orderRank;
    },
    userRank() {
      return this.listState.userRank;
    },
  },
  mounted() {
    this.myCharts = echarts.init(this.$refs.charts);
    let option = {
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "40%",
          data: [],
          color: "#5171cc",
        },
      ],
    };
    this.myCharts.setOption(option);
  },
  watch: {
    activeName() {
      // 重新修改图标的配置数据
      this.myCharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        xAxis: {
          data:
            this.title == "销售额"
              ? this.listState.orderFullYearAxis
              : this.listState.userFullYearAxis,
        },
        series: [
          {
            type: "bar",
            data:
              this.title == "销售额"
                ? this.listState.orderFullYear
                : this.listState.userFullYear,
          },
        ],
      });
    },
    listState() {
      this.myCharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.listState.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "40%",
            data: this.listState.orderFullYear,
            color: "#5171cc",
          },
        ],
      });
    },
  },
  methods: {
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
>>> .el-card__header {
  border-bottom: none;
}
>>> .el-tabs__nav-wrap::after {
  height: 1px;
}
.tab {
  width: 100%;
}
.headR {
  position: absolute;
  right: 0px;
}
.date {
  width: 240px;
  margin: 0px 20px;
}
.headR span {
  margin: 0px 10px;
  cursor: pointer;
}
.headR span:hover {
  color: #409eff;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li {
  height: 8%;
  margin: 10px 0px;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  text-align: center;
}
.rindex:nth-child(1) {
  background-color: #000;
  color: white;
}

.rvalue {
  float: right;
}
</style>
