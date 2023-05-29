package com.lark.web.controller.tool;

import com.lark.common.core.domain.AjaxResult;
import com.lark.common.utils.MessageUtils;
import io.swagger.annotations.Api;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api("健康检查")
@RestController
public class HealthController {

    @GetMapping("/health")
    public AjaxResult health(){
        return AjaxResult.success(MessageUtils.message("demo.health"));
    }
}
