package com.ruoyi.web.controller.hvac;

import com.alibaba.fastjson2.JSON;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.domain.PageQuery;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.system.domain.Activity;
import com.ruoyi.system.manager.HvacManager;
import com.ruoyi.system.utils.RoleDeptUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

/**
 * @author JunoSong
 * @version V1.0
 * @Package com.ruoyi.web.controller.hvac
 * @date 2023/3/1 10:42
 */
@RestController
@Slf4j
public class ActivityController {
    @Autowired
    RoleDeptUtils roleDeptUtils;
    @Autowired
    HvacManager hvacManager;


    private static final Long DEPT_ID = 108L;

    @PostMapping("/activity/page")
    public Object get(@RequestBody PageQuery<Activity> pageQuery) {
        Long userId = SecurityUtils.getUserId();
        String content = JSON.toJSONString(pageQuery);
        okhttp3.RequestBody requestBody = okhttp3.RequestBody.create(null, content);
        if (Boolean.TRUE.equals(roleDeptUtils.haveDept(userId,DEPT_ID))) {
            try {
                return hvacManager.getActivityPageAdmin(requestBody);
            } catch (Exception e) {
                log.error("call hvacManager failed",e);
                throw new ServiceException(e.getMessage());
            }
        }else {
            try {
                return hvacManager.getActivityPage(requestBody);
            } catch (IOException e) {
                throw new ServiceException(e.getMessage());
            }
        }
    }

    @PostMapping("/activity/page-json")
    public AjaxResult getJson(@RequestBody PageQuery<Activity> pageQuery) {
        Long userId = SecurityUtils.getUserId();
        String content = JSON.toJSONString(pageQuery);
        if (Boolean.TRUE.equals(roleDeptUtils.haveDept(userId,DEPT_ID))) {
            try {
                return hvacManager.getActivityPageAdmin(content);
            } catch (IOException e) {
                throw new ServiceException(e.getMessage());
            }
        }else {
            try {
                return hvacManager.getActivityPage(content);
            } catch (IOException e) {
                throw new ServiceException(e.getMessage());
            }
        }
    }
}
