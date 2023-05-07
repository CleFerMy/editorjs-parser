import {
	sanitizeHtml
}
from "./utitlities";
export default {
	paragraph: function(data, config, tunes) {
		let style = {};
		if (tunes) {
			if ('anyTuneName' in tunes) {
				if ('alignment' in tunes.anyTuneName) {
					style['textAlign'] = tunes.anyTuneName.alignment
				}
			}
		}
		return `<p className="${config.paragraph.pClass}" style=${Object.entries(style).map(([k, v]) => `${k}:${v}`).join(';')}> ${data.text} </p>`;
	},
	header: function(data) {
		return `<h${data.level}>${data.text}</h${data.level}>`;
	},
	list: function(data) {
		const type = data.style === "ordered" ? "ol" : "ul";
		const items = data.items.reduce(
			(acc, item) => acc + `<li><none></none>${item}</li>`, "");
		return `<${type}>${items}</${type}>`;
	},
	quote: function(data, config) {
		let alignment = "";
		if (config.quote.applyAlignment) {
			alignment = `style="text-align: ${data.alignment};"`;
		}
		return `<blockquote ${alignment}><p>${data.text}</p><cite>${data.caption}</cite></blockquote>`;
	},
	table: function(data) {
		let thead = ``;
		let theads = [];
		if (data.withHeadings) {
			if (data.content) {
				const shifted = data.content.shift();
				const thead_rows = `<tr>${shifted.reduce(
                  (acc, cell) => acc + ` < td > $ {
					cell
				} < /td>`,
				"")
		} < /tr>`;
		theads = shifted.reduce(function(acc, cell) {
			acc.push(cell);
			return acc;
		}, []);
		thead = `<thead>${thead_rows}</thead>`;
	}
}
const tbody_rows = data.content.map((row) => {
	return `<tr>${row.reduce(
              (acc, cell, index) => acc + ` < td data - label = "${theads[index]}"
	data - label - visible = "${thead !==''?'true':'false'}" > $ {
		cell
	} < /td>`,
	"")
} < /tr>`;
});
return `<table>${thead}<tbody>${tbody_rows.join("")}</tbody></table>`;
},
image: function(data, config) {
		const imageConditions = `${data.stretched ? "img-fullwidth" : ""} ${
      data.withBorder ? "img-border" : ""
    } ${data.withBackground ? "img-bg" : ""}`;
		const imgClass = config.image.imgClass || "";
		let imageSrc;
		if (data.url) {
			// simple-image was used and the image probably is not uploaded to this server
			// therefore, we use the absolute path provided in data.url
			// so, config.image.path property is useless in this case!
			imageSrc = data.url;
		} else if (config.image.path === "absolute") {
			imageSrc = data.file.url;
		} else {
			imageSrc = config.image.path.replace(/<(.+)>/, (match, p1) => data.file[p1]);
		}
		if (config.image.use === "img") {
			return `<img class="${imageConditions} ${imgClass}" src="${imageSrc}" alt="${data.caption}">`;
		} else if (config.image.use === "figure") {
			const figureClass = config.image.figureClass || "";
			const figCapClass = config.image.figCapClass || "";
			return `<figure class="${figureClass}"><img class="${imgClass} ${imageConditions}" src="${imageSrc}" alt="${data.caption}"><figcaption class="${figCapClass}">${data.caption}</figcaption></figure>`;
		}
	},
	code: function(data, config) {
		const markup = sanitizeHtml(data.code);
		return `<pre><code class="${config.code.codeBlockClass}">${markup}</code></pre>`;
	},
	raw: function(data) {
		return data.html;
	},
	delimiter: function(data) {
		return "<hr />";
	},
	embed: function(data, config) {
		if (config.embed.useProvidedLength) {
			data.length = `width="${data.width}" height="${data.height}"`;
		} else {
			data.length = "";
		}
		const regex = new RegExp(/<%data\.(.+?)%>/, "gm");
		if (config.embedMarkups[data.service]) {
			return config.embedMarkups[data.service].replace(regex, (match, p1) => data[p1]);
		} else {
			return config.embedMarkups["defaultMarkup"].replace(regex, (match, p1) => data[p1]);
		}
	},
	AnyButton: function(data) {
		let testURI = new URL(data.link, `https://${window.location.hostname}`);
		let target = "_blank";
		if (testURI.hostname === window.location.hostname) {
			target = "_self";
		}
		return `<a href="${data.link}" target="${target}" className="button">${data.text}</a>`;
	},
	checklist: function(data) {
		const items = data.items.reduce(
			(acc, item) => acc + `<div className="${item.checked ? 'checked': 'unchecked'}"><none></none>${item.text}</div>`, "");
		return `<div className="checklist">${items}</div>`;
	},
	warning: function(data) {
		return `<div className="warning"><p className="title">${data.title}</p><p className="text">${data.text}</p></div>`;
	},
};