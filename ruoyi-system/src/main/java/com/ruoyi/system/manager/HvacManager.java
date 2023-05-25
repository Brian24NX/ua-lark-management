package com.ruoyi.system.manager;

import com.alibaba.fastjson2.JSONObject;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.utils.ServletUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.common.utils.http.OkHttpUtils;
import com.ruoyi.system.utils.SSLSocketClient;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * @author JunoSong
 * @version V1.0
 * @Package com.ruoyi.system.manager
 * @date 2023/3/1 14:04
 */
@Component
@Slf4j
public class HvacManager {
    @Value("${carrier.openapi.hvacHost}")
    private String hvacHost;
    @Value("${carrier.openapi.hvacSecret}")
    private String secret;


    private static final String ACTIVITY_PAGE_ADMIN = "/activity/pageAdmin";
    private static final String ACTIVITY_PAGE = "/activity/page";
    private static final String SIGNATURE_PREFIX = "?sign=SIGNATURE&timestamp=SIGNATURE_TIMESTAMP&appId=SIGNATURE_APP_ID";

    private static final String AUTHORIZATION = "Authorization";

    public Object getActivityPageAdmin(RequestBody body) throws IOException {
        return getResponseWithUrl(body, hvacHost + ACTIVITY_PAGE_ADMIN + SIGNATURE_PREFIX);
    }


    public AjaxResult getActivityPageAdmin(String jsonBody) throws IOException {
        HttpServletRequest request = ServletUtils.getRequest();
        String token = request.getHeader(AUTHORIZATION);

        String result = null;

        OkHttpUtils httpUtils = OkHttpUtils.builder().url(hvacHost + ACTIVITY_PAGE_ADMIN).postJsonBody(jsonBody);
        httpUtils.addHeader(AUTHORIZATION, token);
        String sync = httpUtils.sync();
        if (sync != null) {
            result = sync;
        }
        if (StringUtils.isNotBlank(result)){
            JSONObject jsonObject = JSONObject.parseObject(result);
            result = jsonObject.getString("data");
        }
        return AjaxResult.success(result);
    }

    public Object getActivityPage(RequestBody body) throws IOException {
        return getResponseWithUrl(body, hvacHost + ACTIVITY_PAGE + SIGNATURE_PREFIX);
    }

    public AjaxResult getActivityPage(String jsonBody) throws IOException {
        HttpServletRequest request = ServletUtils.getRequest();
        String token = request.getHeader(AUTHORIZATION);

        String result = null;

        OkHttpUtils httpUtils = OkHttpUtils.builder().url(hvacHost + ACTIVITY_PAGE).postJsonBody(jsonBody);
        httpUtils.addHeader(AUTHORIZATION, token);
        String sync = httpUtils.sync();
        if (sync != null) {
            result = sync;
        }
        if (StringUtils.isNotBlank(result)){
            JSONObject jsonObject = JSONObject.parseObject(result);
            result = jsonObject.getString("data");
        }
        return AjaxResult.success(result);
    }

    private Object getResponseWithUrl(RequestBody body,String url) throws IOException {
        HttpServletRequest request = ServletUtils.getRequest();
        String token = request.getHeader(AUTHORIZATION);
        Response response = null;
        String resultStr = null;
        OkHttpClient client = new OkHttpClient.Builder()
                .readTimeout(60, TimeUnit.SECONDS)
                .connectTimeout(60, TimeUnit.SECONDS)
//            .sslSocketFactory(SSLSocketClient.getSSLSocketFactory())
                .sslSocketFactory(SSLSocketClient.getSSLSocketFactory(), SSLSocketClient.getX509TrustManager())
                .hostnameVerifier(SSLSocketClient.getHostnameVerifier())
                .build();
        String signatureUrl = getSignatureUrl(url);
        Request requestPost = new Request.Builder().url(signatureUrl)
                .method("POST", body)
                .addHeader(AUTHORIZATION, token)
                .addHeader("Content-Type", "application/json; charset=utf-8").build();
        try {
            response = client.newCall(requestPost).execute();
            if (response.body() != null) {
                resultStr = response.body().string();
            }
        } catch (Exception e) {
            log.error("call getResponseWithUrl:{} failed",url,e);
            throw new IOException(e.getMessage(), e);
        }
        if (StringUtils.isNotBlank(resultStr)) {
            JSONObject jsonObject = JSONObject.parseObject(resultStr);
            if (jsonObject.getJSONObject("data") == null) {
                return jsonObject;
            } else {
                return jsonObject.getJSONObject("data");
            }
        }
        return resultStr;
    }

    private String getSignatureUrl(String url){
        String signatureUrl = url;
        if (StringUtils.contains(url, "SIGNATURE_TIMESTAMP") &&
                StringUtils.contains(url, "SIGNATURE_APP_ID")) {
            String timestamp = String.valueOf(System.currentTimeMillis());
            String appId = "juno-hvac-admin";
            String md5Key = timestamp + secret + appId;
            String encoded = DigestUtils.md5DigestAsHex(md5Key.getBytes());
            signatureUrl = StringUtils.replace(url, "SIGNATURE_TIMESTAMP", timestamp)
                    .replace("SIGNATURE_APP_ID", appId).replace("SIGNATURE", encoded);
        }
        return signatureUrl;
    }
}
