<template>
  <div>
    <div class="header">
      <span style="margin-right: 15px">搜索用户数</span>
      <i class="el-icon-info iconInfo"></i>
    </div>
    <div class="main" style="margin: 10px 0">
      <span style="margin-right: 30px">12321</span>
      <span style="margin-right: 10px">17.1</span>
      <svg
        t="1664550356751"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="3712"
        width="16"
        height="16"
      >
        <path
          d="M752.64 376.32 546.56 202.88c-19.2-16-50.56-16-69.76 0L270.72 376.32C240 402.56 261.76 447.36 305.28 447.36L384 447.36C384 447.36 384 448 384 448l0 320c0 35.2 28.8 64 64 64l128 0c35.2 0 64-28.8 64-64L640 448c0 0 0-0.64 0-0.64l78.08 0C761.6 447.36 783.36 402.56 752.64 376.32z"
          p-id="3713"
          fill="#1afa29"
        ></path>
      </svg>
      <svg
        t="1664550446209"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4908"
        width="16"
        height="16"
      >
        <path
          d="M719.36 575.36l-77.44 0c0-0.64 0-0.64 0-1.28L641.92 256c0-35.2-28.8-64-64-64L448 192C412.8 192 384 220.8 384 256l0 318.08c0 0.64 0 0.64 0 1.28L305.92 575.36c-44.16 0-65.92 44.8-35.2 70.4l206.72 173.44c19.2 16 50.56 16 69.76 0l206.72-173.44C785.28 620.16 763.52 575.36 719.36 575.36z"
          p-id="4909"
          fill="#d81e06"
        ></path>
      </svg>
    </div>
    <div class="footer">
      <div class="charts" ref="charts" style="width: 100%; height: 50px"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "lineCharts",
  mounted() {
    //初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    //配置数据
    lineCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        type: "category",
      },
      yAxis: {
        //隐藏y轴
        show: false,
      },
      //系列
      series: [
        {
          smooth: true,
          type: "line",
          data: [10, 7, 33, 12, 48, 9, 29, 10, 44],
          //拐点的样式的设置
          itemStyle: {
            opacity: 0,
          },
          //线条的样式
          lineStyle: {
            color: "skyblue",
          },
          //填充颜色设置
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "skyblue", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
      //布局调试
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
.iconInfo {
  font-size: 14px;
  color: gray;
}
</style>
