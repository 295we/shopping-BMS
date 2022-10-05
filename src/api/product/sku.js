import request from "@/utils/request";

// sku列表的接口  /admin/product/list/{page}/{limit} get
export function reqSkuList(page, limit) {
  return request.get(`/admin/product/list/${page}/${limit}`);
}

// sku上架 /admin/product/onSale/{skuId}  get
export function reqSale(skuId) {
  return request.get(`/admin/product/onSale/${skuId}`);
}
// sku下架 /admin/product/cancelSale/{skuId} get
export function reqCancelSale(skuId) {
  return request.get(`/admin/product/cancelSale/${skuId}`);
}
// 获取Sku详情 /admin/product/getSkuById/{skuId} get
export function reqSkuById(skuId) {
  return request.get(`/admin/product/getSkuById/${skuId}`);
}

// 删除当前sku /admin/product/deleteSku/{skuId} delete
export function reqDeleteSku(skuId) {
  return request.delete(`/admin/product/deleteSku/${skuId}`);
}
