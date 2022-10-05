<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "progressCharts",
  mounted() {
    const dom = this.$refs.charts;
    const progressCharts = echarts.init(dom);
    progressCharts.setOption({
      xAxis: {
        show: false,
        // 最小值与最大值的设置
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        type: "category",
      },
      series: {
        type: "bar",
        data: [78],
        // 柱状图的宽度设置
        barWidth: "15px",
        color: "yellowgreen",
        backgroundStyle: {
          color: "#eee",
        },
        showBackground: true,
        // 文本的设置
        label: {
          show: true,
          formatter: "|",
          position: "right",
          color: "red",
        },
      },
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>
