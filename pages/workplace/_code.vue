<template>
  <div>
    <el-container>
      <el-aside>
        <h2>
          Группы:
        </h2>
        <p>
          <small>Нажмите чтобы выбрать</small>
        </p>
        <template v-if="'groups' in workplace" v-for="(group, index) in workplace.groups">
          <div @click="selectGroup(index)" :key="index" class="group group-el" :class="{ isSelected: select === index }">
            <template v-if="'editable' in group && group.editable">
              <div>
                <el-input v-model="group_edit[index]" :value="group.name"></el-input>
              </div>
              <div>
                <el-button icon="el-icon-check" @click="saveGroup(index)" circle></el-button>
              </div>
            </template>
            <template v-else>
              <div>
                <template v-if="group.name">{{ group.name }}</template>
                <template v-else>Введите название</template>
              </div>
              <div>
                <el-button type="primary" icon="el-icon-edit" @click="editGroup(index)" circle></el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteGroup(index)" circle></el-button>
              </div>
            </template>
          </div>
        </template>
        <div @click="addEmptyGroup" class="group group-add">
          + Добавить группу
        </div>
      </el-aside>
      <el-main>
        <template v-if="select > -1 && select in workplace.groups">
          <h1 class="title-group">
            {{ selectedGroup.name }}
            <el-button type="success" @click="openSelectDialog">Выбрать фото</el-button>

            <el-dialog
              title="Доступные фотографии"
              :visible.sync="selectDialog"
              width="80%"
              :before-close="handleClose">
              <span>
                <div class="images">
                  <div class="image"
                       :class="{ selected: isSelectedImage(image.id) }"
                       @click="selectImage(image.id)"
                       :key="index"
                       v-for="(image, index) in images">
                    <img width="100%" :src="image.src">
                  </div>
                </div>
              </span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">Cancel</el-button>
                <el-button type="primary" @click="closeAndPushImages">Confirm</el-button>
              </span>
            </el-dialog>
          </h1>

          <!-- show images -->
          <div class="images">
            <div class="image image-big" :key="index" v-for="(image, index) in selectedGroup.images">
              <img width="100%" :src="image.src">
              <el-input @blur="saveFio(image.id)" v-model="fios[image.id]" :placeholder="image.fio"></el-input>
            </div>
          </div>

          <p>
            <el-button type="primary" plain>Сохранить</el-button>
          </p>
        </template>
        <template v-else>
          Выберите группу
        </template>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  middleware: 'check-workplace-code',
  data () {
    return {
      group_edit: [],
      selectDialog: false,
      selectImages: {},
      fios: {}
    };
  },
  computed: {
    ...mapState('workplace', {
      workplace: state => state.current,
      select: state => state.selectGroup,
      images: state => state.current.images,
    }),
    selectedGroup() {
      return this.workplace.groups[this.select];
    },
  },
  methods: {
    addEmptyGroup() {
      this.$store.commit('workplace/appendEmptyGroup');
    },
    deleteGroup(idx) {
      if (!confirm('Точно удалить ?')) return;
      this.$store.commit('workplace/deleteGroup', idx);
    },
    editGroup(index) {
      this.group_edit[index] = this.workplace.groups[index].name;
      this.$store.commit('workplace/editableGroup', index);
    },
    saveGroup(index) {
      this.$store.commit('workplace/saveGroup', {
        index,
        update: this.group_edit[index]
      });
    },
    selectGroup(index) {
      this.fios = {};
      this.selectImages = {};
      this.$store.commit('workplace/selectGroup', index);
    },
    selectImage(index) {
      const normalIndex = `img_${index}`;
      if (normalIndex in this.selectImages) {
        // delete
        this.$delete(this.selectImages, normalIndex);
      } else {
        this.$set(this.selectImages, normalIndex, this.images.find((img) => img.id === index));
      }
    },
    isSelectedImage(index) {
      return `img_${index}` in this.selectImages;
    },
    openSelectDialog() {
      // merge group photos
      this.selectImages = Object.assign({}, this.selectImages, this.workplace.groups[this.select].images);
      this.selectDialog = true;
    },
    handleClose() {
      if (!confirm('Изменения не будут применены. Закрыть ?')) return;

      this.selectImages = [];
      this.selectDialog = false;
    },
    closeAndPushImages() {
      this.$store.commit('workplace/saveImages', this.selectImages);
      this.selectImages = {};
      this.fios = {};
      this.selectDialog = false;
    },
    saveFio(id) {
      if (!this.fios[id]) return;
      this.$store.commit('workplace/saveFio', { id, fio: this.fios[id] })
    }
  }
}
</script>

<style lang="scss">
  .group {
    background-color: white;
    padding: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;

    &.isSelected {
      background-color: darken(white, 5%);
    }

    &.group-add {
      padding: 10px;
      border: 2px solid gray;
      background-color: rgba(255, 255, 255, .7);
    }
  }

  .title-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .images {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .image {
      max-width: 150px;
      margin-right: 10px;

      &.image-big {
        max-width: 200px;
      }

      &.selected img {
        border: 1px solid green;
      }
    }
  }
</style>
