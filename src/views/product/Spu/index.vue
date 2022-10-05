<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :isShowTable="scene == 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 需要三个部分进行切换 -->
      <div v-show="scene == 0">
        <!-- 展示spu列表 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 10px"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80%" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="sup描述" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row }">
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handler(row)"
              ></hint-button>
              <!-- 点击弹出的pop -->
              <el-popconfirm
                title="确定删除这个pop吗？"
                @onConfirm="delSpu(row)"
                ><hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!--
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          -->
        <el-pagination
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          background
          style="text-align: center; margin-top: 20px"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,total, sizes"
          :total="total"
        >
        </el-pagination>
      </div>
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeScene="changeScene"
      ></SkuForm>
    </el-card>
    <!-- 点击弹出的dialog 嵌套表格的 -->
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="closeDialog"
    >
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row }">
            <img
              :src="row.skuDefaultImg"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from "./SkuForm";
import SpuForm from "./SpuForm";
export default {
  name: "Spu",
  components: {
    SkuForm,
    SpuForm,
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1, //分页器处于第一页
      limit: 3, //每一页展示limit条数据
      records: [], //存储Spu列表的数据
      total: 0, //分页器一共需要展示数据的条数
      scene: 0, //0代表展示spu列表数据，1代表添加spu或者修改spu，2代表添加sku
      dialogTableVisible: false, //控制对话框的显示与隐藏
      spu: {},
      skuList: [], //存储的是sku列表的数据
      loading: true, //数据还没回来时展示loading效果
    };
  },
  methods: {
    // 获取Spu列表数据的方法
    async getSpuList(page = 1) {
      // 携带三个参数
      const { limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },

    // 三级联动的自定义事件，可以把子组件的数据传递给父组件
    getCategoryId(categoryId) {
      const level = Object.keys(categoryId)[0];
      if (level === "category1Id") {
        this.category1Id = categoryId.category1Id;
        // 当第一个id被改变的时候要清除后两位id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level === "category2Id") {
        this.category2Id = categoryId.category2Id;
        // 同上
        this.category3Id = "";
      } else {
        // 代表三级分类的id已存在
        this.category3Id = categoryId.category3Id;
        // 发请求获取平台的属性
        this.getSpuList();
      }
    },
    // 当分页器修改一页展示多少条数据时
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 点击添加spu
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 点击修改某一个spu
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initSpuData(row);
    },
    // 改变scene的值
    changeScene({ num, flag }) {
      this.getSpuList(flag == "添加" ? 1 : this.page);
      this.scene = num;
    },
    // 删除spu按钮的回调
    async delSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message.success("删除成功");
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    // 添加Sku按钮的回调
    addSku(row) {
      this.scene = 2;
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    // 点击查看sku
    async handler(spu) {
      this.dialogTableVisible = true;
      this.spu = spu;
      // 获取sku列表的数据
      let result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    // 关闭dialog之前的回调
    closeDialog(done) {
      this.loading = true;
      this.skuList = [];
      done()
    },
  },
};
</script>

<style></style>
