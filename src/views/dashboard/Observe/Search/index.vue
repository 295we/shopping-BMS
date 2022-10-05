<template>
  <div>
    <el-card>
      <div slot="header">
        <div class="searchHeader">
          <span>线上热门搜索</span>
          <el-dropdown>
            <i class="el-icon-more"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="12">
            <lineCharts></lineCharts>
          </el-col>
          <el-col :span="12">
            <lineCharts>
            </lineCharts>
          </el-col>
        </el-row>
        <!-- 底部的表格 -->
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column label="排名" width="80" type="index" align="center">
          </el-table-column>
          <el-table-column label="搜索关键字" width="180"> </el-table-column>
          <el-table-column label="用户数" sortable> </el-table-column>
          <el-table-column label="周涨幅" sortable> </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          layout="prev, pager, next"
          :total="1000"
          style="text-align: right"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import lineCharts from "./lineCharts";
export default {
  name: "Search",
  components: { lineCharts },
  data() {
    return {
      tableData: [{}],
      listData: [5, 24, 17, 12, 45, 7, 11, 85, 19],
    };
  },
};
</script>

<style>
.searchHeader {
  display: flex;
  justify-content: space-between;
}
.el-icon-more {
  cursor: pointer;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.cell {
  font-weight: 400;
  color: #000;
}
</style>
