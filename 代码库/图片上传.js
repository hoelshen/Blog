function uploadBase64(optimizeBlobInfo){
  var imageUploadPath = TFL.getTblPath() + 'apis/qmeditor_upload.php?1=1' + (TFL.isDomainSetted() ? ('&domain='+ TFL.getDomain()) : '') + '&show_relative_path=1&relative_base_path=' + ( encodeURIComponent(TFL.cherryRichtext.options.relativeBasePath)) + '&image_prefix=' + TFL.cherryRichtext.options.imagePrefix;
  $.post(
      imageUploadPath,
      {
          from: 'snapscreen',
          base64: true,
          content: optimizeBlobInfo
      },
      function(data, status) {
          if(status === 'success'){
              data = trimScripTag(data);
              success(data);
          }else{
              failure(data);
          }
      }
  );
}
var optimizeBase64 = function(base64, proportion, callback) {
  //处理缩放，转格式
  var optimizeBlobInfo = '';
  var newImg = new Image();
  newImg.src = base64;
  newImg.onload = function() {
    var canvas = document.createElement("canvas");
    var w = this.width;
    var h = this.height;
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
    canvas.getContext("2d").drawImage(this, 0, 0, w, h);
    base64 = canvas.toDataURL("image/jpeg", proportion);
    optimizeBlobInfo = base64.replace('data:image/jpeg;base64,', '');
    if(base64.length > 5 * 1024 * 1024 && compressCount < 7){
      compressCount += 2;
      optimizeBase64(blobInfoBase64, 0.9 - (compressCount * 0.1));
    } else {
      compressCount = 0;
      uploadBase64(optimizeBlobInfo);
    }
    canvas.remove();
  }
}
var compressCount = 0;
var blobInfoBase64 = blobInfo.base64();
if (blobInfoBase64.indexOf('data:image') < 0) {
    blobInfoBase64 = `data:image/png;base64,${blobInfoBase64}`;
}
var originSize = blobInfoBase64.length;
if(blobInfoBase64.length > 5 * 1024 * 1024){
  optimizeBase64(blobInfoBase64, 0.9 - (compressCount * 0.1));
} else {
  uploadBase64(blobInfoBase64);
}