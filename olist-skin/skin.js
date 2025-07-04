const undef = undefined
let baseUrl = "https://jsd.onmicrosoft.cn/gh/bincooo/cdn@0.0.26.meta-4/olist-skin"
let version = "0.0.26.meta-4"
console.log(location)
let _c = {
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
            link: "./@manage",
            method: 0
        },
        {
            name: "IT工具",
            link: "https://it-tools.tech",
            method: 1
        }
    ],
    aria2: {
        jsonrpc: "http://localhost:16800/jsonrpc",
        proxy: location.origin + '/baidu/',
        replace: location.origin + "/d/",
        ua: "netdisk;87875",
        max: 32
    },
    cached: {
        is_dark: false,
        old_url: undefined,
        aria2: false
    }
}


// 加载jq
function load(id, el, props = {}, callback = () => {}) {
    if (id && !!document.querySelector("#" + id)) {
        return
    }
    let node = document.createElement(el)
        for(let k in props) node[k] = props[k]
        if (id) node.id = id
        document.head.appendChild(node)

        function stdOnEnd() {
            node.onload = function () {
                this.onerror = this.onload = null
                callback()
            }
            node.onerror = function () {
                this.onerror = this.onload = null
                console.err('Failed to load ' + link)
            }
        }

        function ieOnEnd() {
            node.onreadystatechange = function () {
                if (this.readyState !== 'complete' && this.readyState !== 'loaded') return
                this.onreadystatechange = null
                callback()
            }
        }

        ('onload' in node ? stdOnEnd : ieOnEnd)()
}

window.onload = function() {
    if (window.config?.version) {
        version = window.config.version
    }
    if (window.config?.baseUrl) {
        baseUrl = window.config.baseUrl + "/gh/bincooo/cdn@" + version + "/alist-skin"
    }

    load(undef, "script", { src: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" }, ready)

    _c.cached.is_dark = document.body.classList.contains("hope-ui-dark")
    load("skinCss", "link", { rel: "stylesheet", href: `${baseUrl}/skin${_c.cached.is_dark  ? "-dark" : ""}.css` })
}


function ready() {
    if (window.config) {
        _c = Object.assign(_c, window.config)
    }

    $.emitQuery = function(selector, cb, max = 30) {
        const $el = $(selector)
        if ($el.length > 0) cb($el)
        else {
            if (max < 1) return
            setTimeout(() => {
                $.emitQuery(selector, cb, max - 1)
            }, 500)
        }
    }

    $.emitQuery(".header .header-left", (el) => {
        const title = window.document.title.split("|")[1]
        el.append(`<br/><div class=title>
            <div class=name>${title}</div>
            <div class=motto>${_c.motto}</div>
        </div>`)

        function menu() {
            let html = ""
            for(let idx in _c.menus) {
                const data = _c.menus[idx]
                html += `<span class=menu data-idx=${idx}>${data.name}</span>`
                if (idx != _c.menus.length - 1) {
                    html += "<span>|</span>"
                }
            }
            return html
        }
        $(".header").after(`<div id=menus class="header hope-c-jKOUQW hope-c-PJLV-ikgiLXI-css">
            <div class=hope-c-PJLV-iicyfOA-css>${menu()}</div>
        </div>`)
        $(".header span[class='menu']").click(({target}) => {
            const data = _c.menus[target.dataset.idx]
            if (data.method === 0) {
                location.href = data.link
            }
            if (data.method === 1) {
                open(data.link)
            }
        })
    })

    // 主题css切换
    setInterval(() => {
        const is_dark = document.body.classList.contains("hope-ui-dark")
        if (is_dark !== _c.cached.is_dark) {
            _c.cached.is_dark = is_dark
            $("#skinCss").remove()
            load("skinCss", "link", { rel: "stylesheet", href: `${baseUrl}/skin${_c.cached.is_dark  ? "-dark" : ""}.css` })
        }
    }, 1000)


    setInterval(() => {
        if (_c.aria2.proxy) {
            const $obj = $(".obj-box a.hope-anchor:first-child:not([data-id])")
            if ($obj.length === 0) return
            $obj.attr("href", $obj.attr("href").replace(_c.aria2.replace, _c.aria2.proxy))
            $obj.attr("data-id", 1)
        }

    }, 1000)

    // 监听ajax的状态
    proxy()

    $.emitQuery(".footer", (el) => el.remove())
    console.log("加载Skin.js完毕~")
}

function proxy() {
    const origin = {
        open: XMLHttpRequest.prototype.open,
        send: XMLHttpRequest.prototype.send
    }
    XMLHttpRequest.prototype.open = function() {
        // aria2("open", arguments[1], arguments)
        this['cached'] = arguments
        origin.open.apply(this, arguments)
    }
    XMLHttpRequest.prototype.send = function(a, b) {
        aria2("send", this.cached[1], arguments)
        origin.send.apply(this, arguments)
    }
}

// 代理aria2
function aria2(type, url, args) {
    if (type === "send" && url === _c.aria2.jsonrpc) {
        let data = JSON.parse(args[0])
        data.params[1][0] = data.params[1][0].replace(_c.aria2.replace, _c.aria2.proxy)
        data.params[2]["max-connection-per-server"] = _c.aria2.max
        data.params[2]["user-agent"] = _c.aria2.ua
        args[0] = JSON.stringify(data)
    }

    // if (type == "open" &&  url.startsWith(location.origin + "/d/") && _c.cached.aria2) {
    //     _c.cached.aria2 = false
    //     args[1] = args[1].replace(location.origin + "/d/", _c.aria2.proxy + "/baidu/")
    //     return
    // }
}
