// 注意：live2d_path 参数应使用绝对路径
const live2d_path = "./";

// 封装异步加载资源的方法
function loadExternalResource(url, type) {
	return new Promise((resolve, reject) => {
		let tag;

		if (type === "css") {
			tag = document.createElement("link");
			tag.rel = "stylesheet";
			tag.href = url;
		}
		else if (type === "js") {
			tag = document.createElement("script");
			tag.src = url;
		}
		if (tag) {
			tag.onload = () => resolve(url);
			tag.onerror = () => reject(url);
			document.head.appendChild(tag);
		}
	});
}

// 加载 waifu.css live2d.min.js waifu-tips.js
if (screen.width >= 768) {
	Promise.all([
		loadExternalResource(live2d_path + "style.css", "css"),
		loadExternalResource(live2d_path + "live2d.min.js", "js"),
		loadExternalResource(live2d_path + "tips.js", "js")
	]).then(() => {
		init({
			waifuPath: live2d_path + "tips.json",
			//cdnPath: "https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/"
			cdnPath: live2d_path + "api/"
		});
	});
}
