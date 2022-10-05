import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en"; // lang i18n

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control

// 引入全局组件CategorySelect
import CategorySelect from "@/components/CategorySelect";
Vue.component(CategorySelect.name, CategorySelect);
// 引入全局组件HitButton
import HintButton from "@/components/HintButton";
Vue.component(HintButton.name, HintButton);

if (process.env.NODE_ENV === "production") {
  const { mockXHR } = require("../mock");
  mockXHR();
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale });
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false;

// 引入相关API请求接口
import API from "@/api";
Vue.prototype.$API = API; //任意组件实例的原型的原型对象可以访问到所有API相关的接口

new Vue({
  beforeCreate() {},
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
