package com.lark;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

/**
 * 启动程序
 * 
 */
@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
public class LarkApplication
{
    public static void main(String[] args)
    {
        // System.setProperty("spring.devtools.restart.enabled", "false");
        SpringApplication.run(LarkApplication.class, args);
        System.out.println("(♥◠‿◠)ﾉﾞ  admin启动成功! ");
    }
}
