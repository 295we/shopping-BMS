// 平台属性管理模块的请求文件
import request from "@/utils/request";

// 获取一级分类数据的接口 url: /admin/product/getCategory1 method:get
export function reqCategory1List() {
  return request.get(`/admin/product/getCategory1`);
}
// 获取二级分类数据的接口 GET /admin/product/getCategory2/{category1Id}
export function reqCategory2List(category1Id) {
  return request.get(`/admin/product/getCategory2/${category1Id}`);
}
// 获取三级分类数据的接口 GET /admin/product/getCategory3/{category2Id}
export function reqCategory3List(category2Id) {
  return request.get(`/admin/product/getCategory3/${category2Id}`);
}
// 获取平台属性的接口 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export function reqAttrList(category1Id, category2Id, category3Id) {
  return request.get(
    `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
  );
}
// 添加属性与属性值的接口 POST /admin/product/saveAttrInfo
export function reqAddOrUpdateAttr(data) {
  return request.post("/admin/product/saveAttrInfo", data);
}
/* 
{
  "attrName": "", //属性名
  "attrValueList": [    //属性名称中的属性值，因为属性值可以是多个，因此需要的是数组
    {
      "attrId": 0,    //属性名的id
      "valueName": "string"  //属性值
    }
  ],
  "categoryId": 0,  //category3Id
  "categoryLevel": 3,
}
*/
