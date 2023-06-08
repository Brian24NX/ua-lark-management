<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item :label="$t('oldPassword')" prop="oldPassword">
      <el-input v-model="user.oldPassword" :placeholder="$t('pleaseEnter') + $t('oldPassword')" type="password" show-password/>
    </el-form-item>
    <el-form-item :label="$t('newPassword')" prop="newPassword">
      <el-input v-model="user.newPassword" :placeholder="$t('pleaseEnter') + $t('newPassword')" type="password" show-password/>
    </el-form-item>
    <el-form-item :label="$t('confirmPassword')" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" :placeholder="$t('pleaseEnter') + $t('confirmPassword')" type="password" show-password/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"  @click="submit">{{$t('save')}}</el-button>
      <el-button type="danger"  @click="close">{{$t('closes')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { updateUserPwd } from "@/api/system/user";

export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: this.$t('oldPasswordRules'), trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: this.$t('newPasswordRules1'), trigger: "blur" },
          { min: 6, max: 20, message: this.$t('newPasswordRules2'), trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: this.$t('confirmPasswordRules'), trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserPwd(this.user.oldPassword, this.user.newPassword).then(response => {
            this.$modal.msgSuccess(this.$t('modificationSucceeded'));
          });
        }
      });
    },
    close() {
      this.$tab.closePage();
    }
  }
};
</script>
