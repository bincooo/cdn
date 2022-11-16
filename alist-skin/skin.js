let _config = {
    motto: "书山有路勤为径，学海无崖苦作舟。",
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
    aria2: {
    },
    cached: {
        is_dark: false,
        old_url: undefined,
        aria2: false
    }
}





const undef = undefined
const baseUrl = "https://cdn.jsdelivr.net/gh/medlar01/cdn@0.0.21/alist-skin"
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
    _config.cached.is_dark = document.body.classList.contains("hope-ui-dark")
    load("skinCss", "link", { rel: "stylesheet", href: `${baseUrl}/skin${_config.cached.is_dark  ? "-dark" : ""}.css` })
    load(undef, "script", { src: "https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js" }, ready)
}


function ready() {
    if (window.config) {
        _config = Object.assign(_config, window.config)
    }

    $.emitQuery = function(selector, cb, max = 5) {
        const $el = $(selector)
        if ($el.length > 0) cb($el)
        else {
            if (max < 1) return
            setTimeout(() => {
                $.emitQuery(selector, cb, max - 1)
            }, 300)
        }
    }

    $.emitQuery(".header .header-left", (el) => {
        const title = window.document.title.split("|")[1]
        el.append(`<br/><div class=title>
            <div class=name>${title}</div>
            <div class=motto>${_config.motto}</div>
        </div>`)


        function menu() {
            let html = ""
            for(let idx in _config.menus) {
                const data = _config.menus[idx]
                html += `<span class=menu data-idx=${idx}>${data.name}</span>`
                if (idx != _config.menus.length - 1) {
                    html += "<span>|<span>"
                }
            }
            return html
        }
        $(".header").after(`<div id=menus class="header hope-c-jKOUQW hope-c-PJLV-ikgiLXI-css">
            <div class=hope-c-PJLV-iicyfOA-css>${menu()}</div>
        </div>`)
        $(".header span[class='menu']").click(({target}) => {
            const data = _config.menus[target.dataset.idx]
            if (data.method == 0) {
                location.href = data.link
            }
            if (data.method == 1) {
                open(data.link)
            }
        })
    })

    // 主题css切换
    setInterval(() => {
        const is_dark = document.body.classList.contains("hope-ui-dark")
        if (is_dark != _config.cached.is_dark) {
            _config.cached.is_dark = is_dark
            $("#skinCss").remove()
            load("skinCss", "link", { rel: "stylesheet", href: `${baseUrl}/skin${_config.cached.is_dark  ? "-dark" : ""}.css` })
        }
    }, 500)


    // 监听地址栏变化
    setInterval(() => {
        if (location.href == _config.cached.old_url) {
            return
        }
        $.emitQuery(".obj-box a.hope-button", (el) => {
            // el.click(() => { _config.cached.aria2 = true })
            if (_config.aria2.proxy) {
                const href = el.attr("href")
                el.attr("href", href.replace(location.origin + "/p/", _config.aria2.proxy + "/baidu/"))
                _config.cached.old_url = location.href;
            }
        })
    }, 500)

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
    if (type == "send" && url == _config.aria2.jsonrpc) {
        let data = JSON.parse(args[0])
        data.jsonrpc = "5.0"
        data.params.splice(0, 1)
        data.params[0][0] = data.params[0][0].replace(location.origin + "/d/", _config.aria2.proxy + "/baidu/")
        data.params[1]["max-connection-per-server"] = "32"
        data.params[1]["user-agent"] = _config.aria2.userAgent
        args[0] = JSON.stringify(data)
        return
    }

    // if (type == "open" &&  url.startsWith(location.origin + "/d/") && _config.cached.aria2) {
    //     _config.cached.aria2 = false
    //     args[1] = args[1].replace(location.origin + "/d/", _config.aria2.proxy + "/baidu/")
    //     return
    // }
}