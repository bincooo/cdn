## 全局｜自定义头部
```html
<script>
    window.config = {
        // 座右铭
        motto: "书山有路勤为径，学海无崖苦作舟。",
        // 菜单按钮
        menus: [
            {
                name: "博客",
                link: "https://cnblogs.com/bingco",
                method: 1 // 0当前页跳转， 1新标签页跳转
            },
            {
                name: "网盘文档",
                link: "https://alist.nn.ci",
                method: 1
            },
            {
                name: "管理",
                link: "/@manage",
                method: 0
            },
            {
                name: "百度授权",
                link: "https://openapi.baidu.com/oauth/2.0/authorize?response_type=token&client_id=tlCNxGqFdG3sf9uP6Ooi5CwNsU1rXPXt&redirect_uri=http://www.icu-web.tk:8082/baidu/oauth2.0/&scope=basic,netdisk",
                method: 1
            }
        ],
        // 代理配置
        // 特殊需求才需要配置，比如作者我自己做的百度不限速链接转发
        aria2: {
            jsonrpc: "http://localhost:16800/jsonrpc",
            proxy: location.origin, // 被转发的url
            userAgent: "netdisk;87875"
        }
    }
</script>
<script src="/static/skin.js"></script>
```