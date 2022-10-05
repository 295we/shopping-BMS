import mockRequest from "@/utils/mockRequest";

export default {
  state: {
    list: {},
  },
  mutations: {
    GETDATA(state, list) {
      state.list = list;
    },
  },
  actions: {
    async getData(context) {
      let result = await mockRequest.get(`/home/list`);
      if (result.code == 200) {
        context.commit("GETDATA", result.data);
      }
    },
  },
  getters: {},
};
