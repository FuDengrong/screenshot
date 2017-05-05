## screenshot 

When watching movie in browser, you can use mouse and drag it on movies, it will draw a rectangular frame, and then you can save it, or upload to server to do something, for example, you can use the image which you draw to search the similar image.

### how to use?
~~~javascript
 $("targetParentID").screenshot("targetID", "previewBoxID",  Boolean || string('true' / 'false'));
~~~
### options

> targetParentID: target's parent id

> targetID: target's id

> previewBoxID: preview or not, if yes, fill prrview box' id

> Boolean || string: save or not

### example
~~~javascript
 $("#box").screenshot("#target", "#show", true);
~~~
