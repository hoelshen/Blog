```js
if (typeof jQuery !== 'undefined') {
    jQuery(() => {
        // 同步提交的表单：生成 token，写入 cookie，并做为参数提交
        jQuery(document).delegate('form', 'submit', (e) => {
            const token = tapd_dsc.gen_token_and_set_to_cookie();
            const ele = jQuery('<input>').attr('type', 'hidden')
                .attr('name', tapd_dsc.form_key)
                .val(token);
            jQuery(e.target).append(jQuery(ele));

            return true;
        });

        // 异步提交的表单：生成 token，写入 cookie，并做为请求头提交
        jQuery.ajaxPrefilter((options, originalOptions, jqXHR) => {
            if (options.type.toLowerCase() === 'post') {
                const token = tapd_dsc.gen_token_and_set_to_cookie();
                jqXHR.setRequestHeader(tapd_dsc.http_header_key, token);
            }
        });
    });
}
```
