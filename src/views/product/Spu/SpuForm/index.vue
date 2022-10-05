<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spuInfo">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuInfo.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spuInfo.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="SPU描述"
          v-model="spuInfo.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 
          上传图片
          file-list:照片墙需要展示的数据【数组：数组里面的元素务必要有name和url属性】
          on-preview:照片墙预览照片的时候会触发的回调
          on-success:图片上传成功触发的回调
           -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}个属性未选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            :label="unSelect.name"
            :value="`${unSelect.id}:${unSelect.name}`"
            v-for="unSelect in unSelectSaleAttr"
            :key="unSelect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 10px"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
      </el-form-item>
      <el-form-item>
        <!-- 展示的是当前spu属于自己的销售属性 -->
        <el-table style="width: 100%" border :data="spuInfo.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80%" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column label="属性值名称列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                @close="row.spuSaleAttrValueList.splice(index, 1)"
                :disable-transitions="false"
                style="margin-bottom: 10px"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- el-input会和 el-button进行切换
              @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
                @click="showInput"
               -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="mini"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spuInfo.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // 需要满足添加spu的时候点击保存时发送post请求请求体的规范
      spuInfo: {
        category3Id: 0,
        description: "",
        spuName: "",
        tmId: "", //品牌的id
        spuImageList: [
          //图片的收集
          /* {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            spuId: 0,
          }, */
        ],
        // 项目全部的销售属性，三条
        spuSaleAttrList: [
          //平台属性与属性值的收集
          /* {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "string",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "string",
                saleAttrName: "string",
                saleAttrValueName: "string",
                spuId: 0,
              },
            ],
          }, */
        ],
      }, //存储spu信息属性
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储Spu图片的数据
      saleAttrList: [], //销售属性的数据
      attrIdAndAttrName: "", //收集未选择的销售属性的id
    };
  },
  methods: {
    // 照片墙删除图片时的回调
    handleRemove(file, fileList) {
      // file:删除的那张图片的信息
      // fileList:剩余的图片的全部信息
      // 收集照片墙图片的数据,我们先收集到这里，提交服务器时再处理一次，因为name，url是不需要的
      this.spuImageList = fileList;
    },
    // 照片墙图片预览时的回调
    handlePictureCardPreview(file) {
      // 将图片地址赋值给这个属性
      this.dialogImageUrl = file.url;
      // 对话框显示
      this.dialogVisible = true;
    },
    // 照片墙图片上传成功触发的回调
    handlerSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },

    // 初始化SpuForm数据
    async initSpuData({ id }) {
      // 获取spu信息
      let spuResult = await this.$API.spu.reqSpuInfo(id);
      if (spuResult.code == 200) {
        this.spuInfo = spuResult.data;
      }
      // 品牌信息
      let tradeMarkResult = await this.$API.spu.reqTrademarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取spu图片数据
      let spuImageResult = await this.$API.spu.reqSpuImage(id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        // 由于照片墙显示的需要是数组而且数组里面的对象需要有name,url这两个字段，需要处理一下
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
      // 获取平台所有销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 已经收集到了需要添加的销售属性的信息
      // 把收集到的销售属性的数据进行分割并存储到spuInfo的spuSaleList对象内,分割字符串并解构
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      this.spuInfo.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      });
      this.attrIdAndAttrName = "";
    },
    // 控制input和btn的展示和隐藏
    addSaleAttrValue(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    // input的blur行为，使btn显示inp隐藏
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      // 第一个判断
      if (inputValue.trim() == "") {
        this.$message.error("属性值不能为空");
        this.$refs.saveTagInput.focus();
        return;
      }
      // 第二个判断
      let result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      );
      if (!result) {
        this.$message.error("属性值不能重复");
        this.$refs.saveTagInput.focus();
        return;
      }
      // 执行的代码
      row.spuSaleAttrValueList.push({
        baseSaleAttrId,
        saleAttrValueName: inputValue,
      });
      row.inputVisible = false;
    },
    // 添加或修改spu
    async addOrUpdateSpu() {
      // 整理参数；需要整理照片墙的数据，需要携带imgName,imgUrl这两个字段
      this.spuInfo.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.imgUrl,
        };
      });

      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spuInfo);
      if (result.code == 200) {
        this.$message.success("保存spu成功");
        this.$emit("changeScene", {
          num: 0,
          flag: this.spuInfo.id ? "修改" : "添加",
        });
      }
      // 清空保存时回显的数据
      Object.assign(this._data, this.$options.data());
    },
    // 点击添加spu按钮获取添加spu得到的数据
    async addSpuData(category3Id) {
      // 品牌信息
      let tradeMarkResult = await this.$API.spu.reqTrademarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取平台所有销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
      this.spuInfo.category3Id = category3Id; //因为新增spu时服务器不会返回category3Id
    },
    // 点击取消按钮
    cancel() {
      this.$emit("changeScene", { num: 0, flag: "修改" });
      // this.$options.data()返回的是初始的响应式数据
      // this._data 是已经被操作的响应式数据，同时也为data
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr() {
      let resultArr = this.saleAttrList.filter((item) => {
        return this.spuInfo.spuSaleAttrList.every((item1) => {
          // 例如： 尺寸 != 颜色 every返回true，则filter保留“尺寸”
          return item.name != item1.saleAttrName;
        });
      });
      return resultArr;
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: middle;
}
</style>
