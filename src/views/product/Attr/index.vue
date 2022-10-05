<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :isShowTable="isShowTable"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 10px"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- table 展示平台属性 -->
        <el-table style="width: 100%" :border="true" :data="attrList">
          <el-table-column type="index" label="序号" width="80%" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150%">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                style="margin: 5px 20px"
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="index"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150%">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性或修改属性的结构 -->
      <div v-show="!isShowTable">
        <!-- 一个input -->
        <el-form ref="form" :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- 两个按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <!-- 一个table -->
        <el-table
          :border="true"
          style="width: 100%; margin: 20px 0px"
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80%" align="center">
          </el-table-column>
          <el-table-column label="属性值名称" width="width" prop="prop">
            <template slot-scope="{ row, $index }">
              <!-- 编辑模式 -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                v-if="row.showInp"
                :ref="$index"
              ></el-input>
              <!-- 查看模式 -->
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width" prop="prop">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`确定删除属性${row.valueName}吗？`"
                @onConfirm="delAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 两个按钮 -->
        <el-button
          type="primary"
          @click="saveAttrInfo"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 接收平台属性的字段
      attrList: [],
      // 控制table表格的显示与隐藏
      isShowTable: true,
      // 收集新增属性|修改属性使用的
      attrInfo: {
        attrName: "", //属性名
        // 属性值，每一个属性值都是一个对象，需要两个字段，一个id，一个value
        attrValueList: [],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //服务器需要区分几级id
      },
    };
  },
  methods: {
    // 自定义事件的回调
    getCategoryId(categoryId) {
      // 区分三级分类相应的id，以及将数据存储在父组件中
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
        this.getAttrList();
      }
    },
    // 获取平台属性的数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //可以在已有的属性值基础之上新增新的属性值
        valueName: "",
        // 展示span还是input
        showInp: true,
      });
      // 新push的元素对应的input框自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 添加属性按钮的回调
    addAttr() {
      // 先清空上一次的数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        // 收集三级分类的id
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
      // 再将table隐藏
      this.isShowTable = false;
    },
    // 修改某个属性
    updateAttr(row) {
      this.isShowTable = false;
      // 由于数据结构中存在对象里面套数组，数组里面又套对象，因此需要深拷贝解决这类问题
      this.attrInfo = cloneDeep(row); //将row进行了深拷贝，变成了独一无二的新对象
      // 在修改某一个属性的时候将相应的属性值元素添加上showInp标记
      this.attrInfo.attrValueList.forEach((item) => {
        // 需要用this.$set()来使showInp作为响应式数据
        this.$set(item, "showInp", false);
      });
    },
    // 失去焦点的事件---切换为查看模式，展示span
    toLook(row) {
      // 如果属性值为空，不能作为新的属性值，需要给用户提示，让他输入新的属性值
      if (row.valueName.trim() == "") {
        this.$message({
          type: "warning",
          message: "请输入一个正常的属性值",
        });
        return;
      }
      // 新增的属性值不能与已有的属性值重复
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        // 需要新增的元素去除，即row，不能拿自己跟自己比
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepeat === true) {
        this.$message({
          type: "warning",
          message: "请不要输入重复的值",
        });
        return;
      }

      row.showInp = false;
    },
    // 点击span切换为编辑模式
    toEdit(row, $index) {
      row.showInp = true;
      // 需要注意点击span的时候切换为input变为编辑模式，但是页面的重绘需要耗时
      // 点击span的时候input还没那么快出来
      this.$nextTick(() => {
        // 获取input并且使其聚焦
        this.$refs[$index].focus();
      });
    },
    // 气泡确认框-确定按钮删除属性的某个属性值的回调
    delAttrValue(index) {
      // 删除数组中指定索引值的元素
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 点击保存按钮发请求
    async saveAttrInfo() {
      // 整理参数：1，如果用户添加了很多属性值，且属性值为空的不应该提交给服务器
      // 2，提交给服务器的数据当中不应该出现showInp字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // ba保留属性值不为空的数组中的元素
          if (item.valueName != "") {
            // 删除掉showInp属性
            delete item.showInp;
            return true;
          }
        }
      );
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.$message({
          type: "success",
          message: "保存成功",
        });
        this.getAttrList();
        this.isShowTable = true;
      } catch (error) {
        this.$message({
          type: "error",
          message: "保存失败",
        });
        throw error;
      }
    },
  },
};
</script>

<style></style>
