package com.ruoyi.web.controller.ccr;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.common.core.domain.UserBaseInfo;
import com.ruoyi.system.service.ISysUserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @Author: jeremy.huang
 * @Date: 2023/3/21
 */
@RestController
@Slf4j
@Api("ccr")
public class CcrFeedbackController {

    @Autowired
    private ISysUserService userService;

    @ApiOperation("获取用户列表")
    @GetMapping("/ccr/searchUserList/{roleId}")
    public R<List<UserBaseInfo>> getUserListByDeptId(@PathVariable Long roleId) {
        return R.ok(userService.searchUserListByRoleId(roleId));
    }
}
