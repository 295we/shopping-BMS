import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

// 咱们需要拆分路由

// 首先拆分出一个常量路由，不管用户是什么角色都能看见的路由
export const constantRoutes = [
  // 常量路由1 login
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  // 常量路由2 404
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
  // 常量路由3 首页
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "首页", icon: "dashboard" },
      },
    ],
  },
];

// 然后再暴露一个异步路由，根据不同的角色展示不同的路由
export const asyncRoutes = [
  {
    path: "/product",
    component: Layout,
    name: "Product",
    meta: { title: "商品管理", icon: "el-icon-goods" },
    children: [
      {
        path: "tradeMark",
        name: "TradeMark",
        component: () => import("@/views/product/tradeMark"),
        meta: { title: "品牌管理" },
      },
      {
        path: "attr",
        name: "Attr",
        component: () => import("@/views/product/Attr"),
        meta: { title: "平台属性管理" },
      },
      {
        path: "spu",
        name: "Spu",
        component: () => import("@/views/product/Spu"),
        meta: { title: "Spu管理" },
      },
      {
        path: "sku",
        name: "Sku",
        component: () => import("@/views/product/Sku"),
        meta: { title: "Sku管理" },
      },
    ],
  },
  // 权限管理相关路由
  {
    name: "Acl",
    path: "/acl",
    component: Layout,
    redirect: "/acl/user/list",
    meta: {
      title: "权限管理",
      icon: "el-icon-lock",
    },
    children: [
      {
        name: "User",
        path: "user/list",
        component: () => import("@/views/acl/user/list"),
        meta: {
          title: "用户管理",
        },
      },
      {
        name: "Role",
        path: "role/list",
        component: () => import("@/views/acl/role/list"),
        meta: {
          title: "角色管理",
        },
      },
      {
        name: "RoleAuth",
        path: "role/auth/:id",
        component: () => import("@/views/acl/role/roleAuth"),
        meta: {
          activeMenu: "/acl/role/list",
          title: "角色授权",
        },
        hidden: true,
      },
      {
        name: "Permission",
        path: "permission/list",
        component: () => import("@/views/acl/permission/list"),
        meta: {
          title: "菜单管理",
        },
      },
    ],
  },
];
// 最后再暴露一个任意路由 当路径出现错误的时候，重定向到404
export const anyRoutes =
  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true };

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

/* router.beforeEach((to, from, next) => {
  next({...to,replace:true})
}) */

export default router;
