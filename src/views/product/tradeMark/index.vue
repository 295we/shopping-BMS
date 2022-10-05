<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 表格组件 -->
    <!-- 
注意1：elementUI当中的table组件，展示数据是按照一列一列的展示数据
prop
注意2：slot的的固定属性，row，就是data中的每一项 固定属性$index，就是data中数据的索引值
     -->
    <el-table style="width: 100%" :border="true" :data="list">
      <el-table-column label="序号" width="80px" align="center" type="index">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column label="品牌LOGO" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 70px; height: 50px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器  
    current-page:当前第几页
     page-size:每一页展示的条数 连续页码数
    :page-sizes :可操控的每一页展示的条数
    layout:调整对应的位置
    ->: 可以实现让组件中的某个元素去到最右边
    page-count:按钮的数量，大于等于 5 且小于等于 21 的奇数，如果修改为9，则连续的页码按钮是7个
    -->
    <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,total, sizes"
      :total="total"
      :background="true"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 
      对话框
      :visible.sync 控制对话框的显示与隐藏
       -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- form表单 -->
      <!-- model属性，这个属性的作用是，把表单的数据收集到哪个对象身上，将来表单验证也需要这个属性 -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="200px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="200px" prop="logoUrl">
          <!-- 上传图片 -->
          <!-- 
            action:设置图片上传的地址
            :on-success这个检测到图片上传成功之后就会触发它所绑定的回调
            :before-upload在图片上传之前会触发它所绑定的回调
           -->
          <el-upload
            class="avatar-uploader"
            action="http://gmall-h5-api.atguigu.cn/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    // 自定义校验规则
    const validateTmName = (rule, value, callback) => {
      if (value.trim().length < 2 || value.trim().length > 10) {
        callback(new Error("长度在 2 到 10 个字符"));
      } else {
        callback();
      }
    };
    return {
      page: 1, //代表分页器的第几页
      limit: 3, //当前页数展示数据条数
      total: 0, //总共数据的条数
      list: [], //列表展示的数据
      dialogFormVisible: false, //对话框显示与隐藏控制的属性
      tmForm: {
        // 收集品牌的信息：对象身上的属性不能瞎写，因为这个数据要通过请求传给后台
        tmName: "",
        logoUrl: "",
      },
      rules: {
        //表单验证
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          { validator: validateTmName, trigger: "change" },
        ],
        logoUrl: [{ required: true, message: "请选择品牌LOGO" }],
      },
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    async getPageList(page = 1) {
      const { limit } = this;
      // 获取品牌列表的接口
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 固定的形参pager
    handleCurrentChange(pager) {
      this.page = pager;
      this.getPageList(this.page);
    },
    // 当分页器某一页需要展示数据的条数发生变化的时候会触发 固定的形参limit
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList(this.page);
    },
    // 点击添加品牌的按钮
    showDialog() {
      this.dialogFormVisible = true;
      this.tmForm.tmName = "";
      this.tmForm.logoUrl = "";
    },
    // 点击修改品牌的按钮
    updateTradeMark(row) {
      // row 当前用户选中的品牌的信息
      // 将已有的品牌信息赋值给tmForm进行展示 这里不能将row赋值个tmForm，需要进行浅拷贝
      this.tmForm.id = row.id;
      this.tmForm.tmName = row.tmName;
      this.tmForm.logoUrl = row.logoUrl;
      this.dialogFormVisible = true;
    },

    // 上传图片相关的回调
    handleAvatarSuccess(res, file) {
      // 图片上传成功 res:上传成功之后返回个前端的数据 file:上传成功之后服务器返回给前端的数据
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      // 图片上传之前 判断要上传的图片是否符合要求
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加或修改品牌的信息
    async addOrUpdateTradeMark() {
      // 当全部验证的字段通过再去书写业务逻辑
      this.$refs["ruleForm"].validate(async (success) => {
        // 如果全部字段符合条件
        if (success) {
          this.dialogFormVisible = false;
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            // elementUI的弹出信息
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除品牌的操作
    deleteTradeMark(row) {
      this.$confirm(`你确定删除该品牌吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 再次获取品牌列表的数据
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
