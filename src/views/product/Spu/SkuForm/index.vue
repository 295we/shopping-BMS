<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input
          placeholder="重量(千克)"
          v-model.number="skuInfo.weight"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          placeholder="规格描述"
          rows="4"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form label-width="80px" :inline="true">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrInfoList"
            :key="attr.id"
          >
            <el-select
              placeholder="请选择"
              v-model="attr.attrIdAndValueId"
              style="margin-bottom: 10px"
            >
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form label-width="80px" :inline="true">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                size="small"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设为默认</el-button
              >
              <el-button size="small" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      // 收集sku的数据
      skuInfo: {
        // 第一类收集的数据：父组件给的数据
        category3Id: 0, //父组件给的
        spuId: 0, //父组件给的
        tmId: 0, //父组件给的
        // 第二类收集的数据：v-model收集
        price: 0,
        skuName: "",
        weight: 0, //这里后台数据库设计问题，导致weight必须为num类型
        skuDesc: "",
        // 第三类：需要自己写代码收集
        // 平台属性
        skuAttrValueList: [
          {
            skuId: 0,
            valueId: 0,
          },
        ],
        skuDefaultImg: "",
        skuImageList: [
          /* {
            imgName: "string",
            imgUrl: "string",
            isDefault: "string",
            spuImgId: 0,
          }, */
        ],
        // 收集销售属性
        skuSaleAttrValueList: [
          /* {
            saleAttrId: 0,
            saleAttrName: "string",
            saleAttrValueId: 0,
            saleAttrValueName: "string",
            skuId: 0,
            spuId: 0,
          }, */
        ],
      },
      spu: {},
      // 收集图片数据的字段,但是缺少isDefault字段
      imageList: [],
    };
  },
  methods: {
    async getData(category1Id, category2Id, spu) {
      // 收集父组件给予的数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      // 获取图片的数据
      let result = await this.$API.spu.reqSpuImage(spu.id);
      if (result.code == 200) {
        let list = result.data;
        list.forEach((element) => {
          element.isDefault = 0;
        });
        this.spuImageList = list;
      }
      // 获取销售属性的数据
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }
      // 获取平台属性的数据
      let result2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    // table表格复选框按钮的事件
    handleSelectionChange(selection) {
      // 可以获取到用户选中图片信息的数据，但是数据种缺少需要的isDefault字段
      this.imageList = selection;
    },
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      // 收集默认图片的地址，到时候要传给服务器
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    cancel() {
      this.$emit("changeScene", { num: 0, flag: "" });
      // 清除数据
      Object.assign(this._data, this.$options.data());
    },
    // 保存按钮的事件
    async save() {
      // 整理参数
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
      // 整理平台属性
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      // 整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.attrIdAndValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      // 整理图片的属性
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      let result = await this.$API.spu.reqAddSku(this.skuInfo);
      if (result.code == 200) {
        this.$message.success("添加sku成功");
        Object.assign(this._data, this.$options.data());
        this.$emit("changeScene", { num: 0, flag: "" });
      }
    },
  },
};
</script>

<style></style>
