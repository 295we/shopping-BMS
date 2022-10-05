<template>
  <div>
    <!-- 
    inline:行内表单，代表一行可以放置多个表单元素

     -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handler1"
          :disabled="!isShowTable"
        >
          <el-option
            v-for="c1 in list1"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          @change="handler2"
          :disabled="!isShowTable"
        >
          <el-option
            v-for="c2 in list2"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="handler3"
          :disabled="!isShowTable"
        >
          <el-option
            v-for="c3 in list3"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      // 一、二、三级分类的数据
      list1: [],
      list2: [],
      list3: [],
      // 收集相应的一级，二级，三级分类的id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  props: ["isShowTable"],
  mounted() {
    this.getCategory1List();
  },
  methods: {
    // 获取一级分类数据
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    // 一级分类的select的事件的回调（当一级分类的options发生变化的时候获取相应二级分类的数据）
    async handler1() {
      // 清除数据
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";

      // 解构出1级分类的id用于获取二级分类的数据
      const { category1Id } = this.cForm;
      this.$emit("getCategoryId", { category1Id });
      // 获取二级分类的数据
      let result = await this.$API.attr.reqCategory2List(category1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    // 二级分类的事件回调
    async handler2() {
      // 清除数据
      this.list3 = [];
      this.cForm.category3Id = "";

      const { category2Id } = this.cForm;
      this.$emit("getCategoryId", { category2Id });
      let result = await this.$API.attr.reqCategory3List(category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    // 三级分类的事件回调
    handler3() {
      const { category3Id } = this.cForm;
      this.$emit("getCategoryId", { category3Id });
    },
  },
};
</script>

<style></style>
