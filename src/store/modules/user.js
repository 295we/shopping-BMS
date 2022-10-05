import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter, asyncRoutes, constantRoutes, anyRoutes } from "@/router";
import router from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    buttons: [],
    routes: [],
    roles: [],
    // 项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的路由
    resultAsyncRoutes: [],
    // 用户最终需要展示的路由
    resultRoutes: [],
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  // 存储用户信息
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    // 菜单权限的标记 routes
    state.routes = userInfo.routes;
    // 按钮权限的标记 button
    state.buttons = userInfo.buttons;
    // 角色信息
    state.roles = userInfo.roles;
  },
  // 最终计算出来的异步路由
  SET_RESULTASYNCROUTES: (state, resultAsyncRoutes) => {
    // vuex保存当前用户的异步路由，注意，一个用户需要展示的路由包含：常量、异步、任意路由
    state.resultAsyncRoutes = resultAsyncRoutes;
    // 计算出当前用户需要展示的所有路由
    state.resultRoutes = constantRoutes.concat(
      state.resultAsyncRoutes,
      anyRoutes
    );
    // 给路由器添加新的路由
    router.addRoutes(state.resultRoutes);
  },
};

// 定义一个函数，两个数组进行对比，对比出当前的用户到底显示哪个异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 过滤出当前用户【超级管理员|普通员工】需要展示的异步路由
  return asyncRoutes.filter((item) => {
    // 如果数组中包含我们的路由的名字
    if (routes.indexOf(item.name) != -1) {
      // 如果item的children存在且不是空数组
      if (item.children && item.children.length) {
        // 递归 别忘记还有路由层级嵌套
        item.children = computedAsyncRoutes(item.children, routes);
      }
      return true;
    }
  });
};

const actions = {
  // 处理登录业务
  async login({ commit }, userInfo) {
    const { username, password } = userInfo;
    let result = await login({ username: username.trim(), password: password });
    if (result.code === 20000) {
      commit("SET_TOKEN", result.data.token);
      setToken(result.data.token);
      return "Success";
    } else {
      return Promise.reject(new Error("fail"));
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response;
          if (!data) {
            return reject("验证失败，请重新登录。");
          }
          // 这里的data,获取用户信息，由服务器返回三个信息，用户名，用户头像，以及路由的规则
          // vuex存储用户全部信息
          commit("SET_USERINFO", data);
          commit(
            "SET_RESULTASYNCROUTES",
            computedAsyncRoutes(asyncRoutes, data.routes)
          );
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken(); // must remove  token  first
          resetRouter();
          commit("RESET_STATE");
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
