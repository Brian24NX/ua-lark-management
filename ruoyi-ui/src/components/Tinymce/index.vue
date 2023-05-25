<template>
  <div v-loading="editorLoading" :class="{fullscreen:fullscreen}" class="tinymce-container"
       :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea"/>
    <div class="editor-custom-btn-container">
      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK"/>
    </div>
  </div>
</template>

<script>
  /**
   * docs:
   * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
   */
  import serverApi from 'axios'
  import editorImage from './components/EditorImage'
  import plugins from './plugins'
  import toolbar from './toolbar'
  import load from './dynamicLoadScript'
  import { userCode } from '@/utils/auth'

  // why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
  const vueRootPath = !!process.env.VUE_APP_ROOT_PATH ? process.env.VUE_APP_ROOT_PATH : ''
  const tinymceCDN = window.location.origin + vueRootPath + '/tinymce/tinymce.min.js'

  export default {
    name: 'Tinymce',
    components: { editorImage },
    props: {
      id: {
        type: String,
        default: function() {
          return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
        }
      },
      value: {
        type: String,
        default: ''
      },
      toolbar: {
        type: Array,
        required: false,
        default() {
          return []
        }
      },
      menubar: {
        type: String,
        default: 'file edit insert view format table'
      },
      height: {
        type: [Number, String],
        required: false,
        default: 450
      },
      width: {
        type: [Number, String],
        required: false,
        default: 'auto'
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        editorLoading: true,
        hasChange: false,
        hasInit: false,
        tinymceId: this.id,
        fullscreen: false
        // languageTypeList: 'zh_CN'
      }
    },
    computed: {
      // language() {
      //   return this.languageTypeList[this.$i18n.locale]
      // },
      containerWidth() {
        const width = this.width
        if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
          return `${width}px`
        }
        return width
      }
    },
    watch: {
      value(val) {
        if (!this.hasChange && this.hasInit) {
          this.$nextTick(() =>
            window.tinymce.get(this.tinymceId).setContent(val || ''))
        }
      }
      // language() {
      //   this.destroyTinymce()
      //   this.$nextTick(() => this.initTinymce())
      // }
    },
    mounted() {
      this.init()
    },
    activated() {
      if (window.tinymce) {
        this.initTinymce()
      }
    },
    deactivated() {
      this.destroyTinymce()
    },
    destroyed() {
      this.destroyTinymce()
    },
    methods: {
      init() {
        // dynamic load tinymce from cdn
        load(tinymceCDN, (err) => {
          if (err) {
            this.$message.error(err.message)
            return
          }
          this.initTinymce()
          this.editorLoading = false
        })
      },
      initTinymce() {
        console.log('this.readonly', this.readonly)
        const _this = this
        window.tinymce.init({
          image_dimensions: false, // 上传的图片不指定宽高
          language: 'zh_CN',
          readonly: this.readonly,
          skeletonScreen: true,
          auto_focus: false,
          branding: false,  // 去水印
          elementpath: true, // 禁用编辑器底部的状态栏
          statusbar: true, // 隐藏编辑器底部的状态栏
          powerpaste_allow_local_images: true, //复制粘贴图书是否允许本地图片
          paste_data_images: true, // 是否能粘贴图片
          paste_convert_word_fake_lists: false, // 插入word文档需要该属性
          paste_retain_style_properties: 'all', // 保留所有粘贴格式
          selector: `#${this.tinymceId}`,
          font_formats: 'SourceHanSansCN-Regular=\'SourceHanSansCN-Regular\';GillSans-Bold=\'GillSans-Bold\';GillSans-Regular=\'GillSans-Regular\';微软雅黑=\'微软雅黑\';宋体=\'宋体\';黑体=\'黑体\';仿宋=\'仿宋\';楷体=\'楷体\';隶书=\'隶书\';幼圆=\'幼圆\';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings', //字体
          height: this.height,
          body_class: 'panel-body ',
          object_resizing: false,
          toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
          menubar: false,
          plugins: plugins,
          max_height: 650,
          min_height: 350,
          fontsize_formats: '8px 10px 12px 14px 16px 18px 24px 36px 40px 42px', // 第二步
          style_formats: [
            {
              title: 'Line Height',
              items: [
                { title: '1', block: 'p', styles: { 'line-height': '1.0' } },
                { title: '1.5', block: 'p', styles: { 'line-height': '1.5' } },
                { title: '1.75', block: 'p', styles: { 'line-height': '1.75' } },
                { title: '2', block: 'p', styles: { 'line-height': '2' } },
                { title: '3', block: 'p', styles: { 'line-height': '3' } },
                { title: '4', block: 'p', styles: { 'line-height': '4' } },
                { title: '5', block: 'p', styles: { 'line-height': '5' } }
              ]
            }
          ],
          style_formats_merge: true,
          style_formats_autohide: true,
          end_container_on_empty_block: true,
          powerpaste_word_import: 'clean',
          code_dialog_height: 450,
          code_dialog_width: 1000,
          advlist_bullet_styles: 'square',
          advlist_number_styles: 'default',
          imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
          default_link_target: '_blank',
          link_title: false,
          nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
          init_instance_callback: editor => {
            if (_this.value) {
              editor.setContent(_this.value)
            }
            _this.hasInit = true
            editor.on('NodeChange Change KeyUp SetContent', () => {
              this.hasChange = true
              this.$emit('input', editor.getContent())
            })
          },
          setup(editor) {
            // editor.on('init', function(ed) {
            //   console.log(ed)
            //   ed.target.editorCommands.execCommand('fontName', false, '微软雅黑')
            // })
            editor.on('FullscreenStateChanged', (e) => {
              _this.fullscreen = e.state
            })
          },
          // it will try to keep these URLs intact
          // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
          // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
          convert_urls: false,
          // 整合七牛上传
          // images_dataimg_filter(img) {
          //   setTimeout(() => {
          //     const $image = $(img);
          //     $image.removeAttr('width');
          //     $image.removeAttr('height');
          //     if ($image[0].height && $image[0].width) {
          //       $image.attr('data-wscntype', 'image');
          //       $image.attr('data-wscnh', $image[0].height);
          //       $image.attr('data-wscnw', $image[0].width);
          //       $image.addClass('wscnph');
          //     }
          //   }, 0);
          //   return img
          // },
          urlconverter_callback: (url, node, onSave, name) => {
            return url
            // if (node === 'img' && url.startsWith('blob:')) {
            //   tinymce.activeEditor && tinymce.activeEditor.uploadImages()
            //   return url
            // } else {
            //   this.getBase64(url).then(base64 => {
            //     console.log('base64', base64)
            //     return base64
            //   });
            // }
          },
          images_upload_handler: (blobInfo, success, failure) => {
            console.log('blobInfo', blobInfo.base64())
            //  const fileName = blobInfo.filename();
            let newBase64 = 'data:image/jpeg;base64,' + blobInfo.base64()
            let base64toFile = this.base64toFile(newBase64, new Date().getTime())

            if (blobInfo.blob().size > _this.maxSize) {
              this.$message.error('图片上传最多5M')
              return
            }

            this.uploadPic(base64toFile, success, failure)
          }

          // images_upload_handler(blobInfo, success, failure, progress) {
          //   progress(0);
          //   let url = process.env.VUE_APP_BASE_API + "/file/upload"
          //   const token = _this.$store.getters.token;
          //   let headers = {
          //     'Content-Type': 'multipart/form-data',
          //     Authorization: "Bearer " + token,
          //   };
          //   let params = new FormData(); // 创建form对象
          //   params.append('file', blobInfo.blob())
          //   serverApi
          //     .post(url, params, {headers: headers})
          //     .then(resp => {
          //       success(resp.data.data);
          //       progress(100);
          //     })
          //     .catch(() => {
          //       failure('上传失败！');
          //     });
          // },
        })
      },
      uploadPic(data, success, failure) {
        let url = process.env.VUE_APP_BASE_API + process.env.VUE_APP_HVAC_PATH + 'activity/upload-img'
        const token = this.$store.getters.token
        let headers = {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + token,
          'userCode': userCode()
        }
        let params = new FormData() // 创建form对象
        params.append('img', data)
        serverApi
          .post(url, params, { headers: headers })
          .then(resp => {
            console.log('resp111', resp)
            success(resp.data.data.url)
          })
          .catch(() => {
            failure('上传失败！')
          })
      },
      base64toFile(dataurl, filename = 'file') {
        let arr = dataurl.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        let suffix = mime.split('/')[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], `${filename}.${suffix}`, {
          type: mime
        })
      },

      getBase64(img) {
        function getBase64Image(img, width, height) {
          let canvas = document.createElement('canvas')
          canvas.width = width ? width : img.width
          canvas.height = height ? height : img.height
          let ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          let dataURL = canvas.toDataURL()
          return dataURL
        }

        function Deferred() {
          var self = this
          self.promise = new Promise(function(resolve, reject) {
            self._resolve = resolve
            self._reject = reject
          })
        }

        Deferred.prototype.resolve = function(data) {
          this._resolve(data)
        }

        Deferred.prototype.reject = function(data) {
          //this._reject.call(this.promise,data);
          this._reject(data)
        }

        var image = new Image()
        image.crossOrigin = ''
        image.src = img
        //var deferred = $.Deferred();
        var deferred = new Deferred()
        if (img) {
          image.onload = function() {
            deferred.resolve(getBase64Image(image)) //将base64传给done上传处理
          }
        }
        return deferred.promise
      },

      destroyTinymce() {
        const tinymce = window.tinymce.get(this.tinymceId)
        if (this.fullscreen) {
          tinymce.execCommand('mceFullScreen')
        }
        console.log('tinymce', tinymce)
        if (tinymce) {
          tinymce.destroy()
        }
      },
      setReadonly() {
        window.tinymce.activeEditor.setMode('readonly')
      },
      setContent(value) {
        window.tinymce.get(this.tinymceId).setContent(value)
      },
      getContent() {
        window.tinymce.get(this.tinymceId).getContent()
      },
      imageSuccessCBK(arr) {
        arr.forEach(v => window.tinymce.get(this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`))
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tinymce-container {
    position: relative;
    line-height: normal;
    min-height: 450px;
  }

  .tinymce-container {
    ::v-deep {
      .mce-fullscreen {
        z-index: 10000;
      }
    }
  }

  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }

  .editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 4px;
    /*z-index: 2005;*/
  }

  .fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
  }

  .editor-upload-btn {
    display: inline-block;
  }
</style>
<style>
  .tinymce-container .el-loading-spinner {
    margin-top: -120px;
  }

  .tinymce-container .el-loading-spinner .circular {
    height: 125px;
    width: 125px;
  }
</style>
