<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{ row }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80">
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="success"
            icon="el-icon-sort-up"
            size="small"
            v-if="row.isSale == 1"
            @click="saleUp(row)"
          ></el-button>
          <el-button
            v-else
            type="info"
            icon="el-icon-sort-down"
            size="small"
            @click="saleDown(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="$message('正在开发中')"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="small"
            @click="getSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="delSku(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 
    @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    -->
    <el-pagination
      style="margin-top: 10px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16"> {{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16"> {{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16"> {{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag
              type="success"
              v-for="attr in skuInfo.skuAttrValueList"
              :key="attr.id"
              >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
            >
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="450px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" style="width: 100%" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      records: [], //存储sku列表的数据
      skuInfo: {}, //存储sku信息
      drawer: false, //抽屉效果
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    // 获取sku列表数据的方法
    async getSkuList(pages = 1) {
      this.page = pages;
      const { page, limit } = this;
      let result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 修改每一页显示的条数
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    // 商品的上架
    async saleUp(sku) {
      try {
        let result = await this.$API.sku.reqSale(sku.id);
        if (result.code == 200) {
          this.$message.success("上架成功");
          sku.isSale = 0;
        }
      } catch (error) {
        this.$message.warning("系统数据，不能处理");
      }
    },
    // 商品的下架
    async saleDown(sku) {
      try {
        let result = await this.$API.sku.reqCancelSale(sku.id);
        if (result.code == 200) {
          this.$message.success("下架成功");
          sku.isSale = 1;
        }
      } catch (error) {
        this.$message.warning("系统数据，不能处理");
      }
    },
    async getSkuInfo(sku) {
      // 获取sku详情
      let result = await this.$API.sku.reqSkuById(sku.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
      // 展示抽屉
      this.drawer = true;
    },
    // 删除当前商品
    async delSku(sku) {
      let result = await this.$API.sku.reqDeleteSku(sku.id);
      if (result.code == 200) {
        this.$message.success("删除商品成功");
        this.getSkuList(this.page);
      }
    },
  },
};
</script>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}

.el-carousel__button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}
</style>
