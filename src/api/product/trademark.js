// 用于获取品牌管理的数据的模块
import request from "@/utils/request";
// 获取品牌列表的接口
// /admin/product/baseTrademark/{page}/{limit} get
export function reqTradeMarkList(page, limit) {
  return request.get(`/admin/product/baseTrademark/${page}/${limit}`);
}

// 处理添加品牌的操作 URL:/admin/product/baseTrademark/save post 携带两个参数：品牌名称，品牌logo
// 切记，给服务器传递的数据，不需要传递Id，id由服务器生成

// 修改品牌的内容 URL:/admin/product/baseTrademark/update put 携带3个参数：id,品牌名称,品牌logo
// 切记，对于修改某一个品牌的操作，前端需要带上id，以便于告诉服务器修改的是哪个品牌

export function reqAddOrUpdateTradeMark(tradeMark) {
  if (tradeMark.id) {
    //代表是修改品牌 put请求
    return request.put("/admin/product/baseTrademark/update", tradeMark);
  } else {
    // 代表是新增品牌 post请求
    return request.post("/admin/product/baseTrademark/save", tradeMark);
  }
}

// 删除品牌的接口 method:DELETE URL: /admin/product/baseTrademark/remove/{id}
export function reqDeleteTradeMark(id) {
  return request.delete(`/admin/product/baseTrademark/remove/${id}`);
}
