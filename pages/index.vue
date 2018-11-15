<template>
  <div>
    <el-container>
      <div class="center-form">
        <el-card shadow="never">
          <div slot="header" class="clearfix">Введите код доступа</div>
          <div>
            <el-input placeholder="Код" v-model="code"></el-input>
            <p></p>
            <el-button type="primary" @click="loadWorkplace" plain>Продолжить</el-button>
          </div>
        </el-card>
      </div>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: null
    }
  },
  methods: {
    loadWorkplace() {
      this.$router.replace(`/workplace/${this.code}`);
    },
  },
}
</script>

<style lang="scss">
.center-form {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>
