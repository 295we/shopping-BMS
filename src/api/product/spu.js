import request from "@/utils/request";

// 获取Spu列表数据的接口 GET /admin/product/{page}/{limit} 携带的参数：page,limit,category3Id
export function reqSpuList(page, limit, category3Id) {
  return request.get(`/admin/product/${page}/${limit}`, {
    params: {
      category3Id: category3Id,
    },
  });
}

// 获取某个spu信息  get  /admin/product/getSpuById/{spuId}
export function reqSpuInfo(spuId) {
  return request.get(`/admin/product/getSpuById/${spuId}`);
}

// 获取品牌信息列表 get /admin/product/baseTrademark/getTrademarkList
export function reqTrademarkList() {
  return request.get(`/admin/product/baseTrademark/getTrademarkList`);
}

// 获取spu图片列表 get  /admin/product/spuImageList/{spuId}
export function reqSpuImage(spuId) {
  return request.get(`/admin/product/spuImageList/${spuId}`);
}

// 获取全部销售属性 get /admin/product/baseSaleAttrList 返回销售属性 最多返回三个
export function reqBaseSaleAttrList() {
  return request.get(`/admin/product/baseSaleAttrList`);
}

// 修改或添加spu POST /admin/product/updateSpuInfo 修改或添加携带给服务器的参数区别只有是否携带id
export function reqAddOrUpdateSpu(spuInfo) {
  if (spuInfo.id) {
    return request.post(`/admin/product/updateSpuInfo`, spuInfo);
  } else {
    return request.post(`/admin/product/saveSpuInfo`, spuInfo);
  }
}

// 删除spu /admin/product/deleteSpu/{spuId} delete
export function reqDeleteSpu(spuId) {
  return request.delete(`/admin/product/deleteSpu/${spuId}`);
}

// 获取sku销售属性的数据 /admin/product/spuSaleAttrList/{spuId} get
export function reqSpuSaleAttrList(spuId) {
  return request.get(`/admin/product/spuSaleAttrList/${spuId}`);
}

// 获取平台属性的数据 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} get
export function reqAttrInfoList(category1Id, category2Id, category3Id) {
  return request.get(
    `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
  );
}

// 添加sku /admin/product/saveSkuInfo post 提交sku的接口
export function reqAddSku(skuInfo) {
  return request.post(`/admin/product/saveSkuInfo`, skuInfo);
}
// 获取SPU列表数据   /admin/product/findBySpuId/{spuId} get
export function reqSkuList(spuId) {
  return request.get(`/admin/product/findBySpuId/${spuId}`);
}
