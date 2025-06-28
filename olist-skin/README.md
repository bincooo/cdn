## 全局｜自定义头部
```html
<script src="/static/skin.js"></script>
<scirpt>
/* 可自行定义头部菜单 */
config = {
	motto: "书山有路勤为径，学海无崖苦作舟。",
	menus: [
        {
            name: "博客",
            link: "https://www.1micro.top",
            method: 1 // 0当前页跳转， 1新标签页跳转
        },
        {
            name: "网盘文档",
            link: "https://docs.oplist.org/zh",
            method: 1
        },
        {
            name: "管理",
            link: "/@manage",
            method: 1
        },
        {
            name: "IT工具",
            link: "https://it-tools.tech",
            method: 1
        }
    ]
}
</script>
```