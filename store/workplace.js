import clone from 'lodash/cloneDeep.js';

export const state = () => ({
  current: {},
  code: 0,
  correct: false,
  selectGroup: -1,
});

export const mutations = {
  setWorkplace(state, workplace) {
    state.current = workplace;
    state.correct = true;
  },
  setCode(state, code) {
    state.code = code;
  },
  appendEmptyGroup(state) {
    state.current.groups.push({
      name: null,
      images: {}
    });
  },
  deleteGroup(state, idx) {
    state.current.groups.splice(idx, 1);
  },
  editableGroup(state, idx) {
    state.current.groups = Array.from(state.current.groups, (group, index) => {
      if (index === idx) {
        group.editable = true;
      }
      return group;
    });
  },
  saveGroup(state, payload) {
    state.current.groups = Array.from(state.current.groups, (group, index) => {
      if (index === payload.index) {
        group.editable = false;
        group.name = payload.update
      }
      return group;
    });
  },
  selectGroup(state, index) {
    state.selectGroup = index;
  },
  saveImages(state, images) {
    state.current.groups = Array.from(state.current.groups, (group, index) => {
      if (index === state.selectGroup) {
        // append images
        group.images = images;
      }

      return group;
    });
  },
  saveFio(state, payload) {
    state.current.groups = clone(Array.from(state.current.groups, (group, index) => {
      if (index === state.selectGroup) {
        for (let index in group.images) {
          let img = group.images[index];
          if (img.id === payload.id) {
            // append fio
            group.images[index] = Object.assign({}, clone(group.images[index]), { fio: payload.fio });
          }
        }
        // let img = group.images.filter((img) => img.id === payload.id);
      }

      return group;
    }));
  },
};

export const actions = {
  async getWorkplace({ commit }, code) {
    /*
    * TODO:: UNCOMMENT ON PRODUCTION
    * */
    // const { data } = await this.$axios.get(`workplace/${code}`);
    // commit('setWorkplace', data);
    // commit('setCode', code);

    return new Promise((resolve, reject) => {
      if (code === "123") {
        commit('setWorkplace', {
          name: 'Test workplace',
          groups: [
            { name: 'GroupName', id: 1, images: [] }
          ],
          images: [
            { id: 1, src: 'https://fakeimg.pl/350x600/' },
            { id: 2, src: 'https://fakeimg.pl/350x600/' },
            { id: 3, src: 'https://fakeimg.pl/350x600/' },
          ],
        });
        commit('setCode', code);
        resolve();
      } else {
        reject();
      }
    });


  },
};
