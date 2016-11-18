## screenshot  基于jquery的视频截图插件

### 使用说明
~~~javascript
 $("targetParentID").screenshot("targetID", "previewBoxID",  Boolean || string('true' / 'false'));
~~~
### 参数说明

> targetParentID: 截图目标父级ID

> targetID: 截图目标ID

> previewBoxID: 是否预览，若是，提供预览框ID，否则传入空字符串，预览框默认宽100px

> Boolean || string: 是否保存

### 示例
~~~javascript
 $("#box").screenshot("#target", "#show", true);
~~~
