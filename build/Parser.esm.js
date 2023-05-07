function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var isObject = function isObject(item) {
  return item && _typeof(item) === "object" && !Array.isArray(item);
};

var mergeDeep = function mergeDeep(target, source) {
  var output = Object.assign({}, target);

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(function (key) {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, _defineProperty({}, key, source[key]));else output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, _defineProperty({}, key, source[key]));
      }
    });
  }

  return output;
};

var sanitizeHtml = function sanitizeHtml(markup) {
  markup = markup.replace(/&/g, "&amp;");
  markup = markup.replace(/</g, "&lt;");
  markup = markup.replace(/>/g, "&gt;");
  return markup;
};

var embedMarkups = {
  youtube: "<div class=\"embed\"><iframe class=\"embed-youtube\" frameborder=\"0\" src=\"<%data.embed%>\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen <%data.length%>></iframe></div>",
  twitter: "<blockquote class=\"twitter-tweet\" class=\"embed-twitter\" <%data.length%>><a href=\"<%data.source%>\"></a></blockquote> <script async src=\"//platform.twitter.com/widgets.js\" charset=\"utf-8\"></script>",
  instagram: "<blockquote class=\"instagram-media\" <%data.length%>><a href=\"<%data.embed%>/captioned\"></a></blockquote><script async defer src=\"//www.instagram.com/embed.js\"></script>",
  codepen: "<div class=\"embed\"><iframe <%data.length%> scrolling=\"no\" src=\"<%data.embed%>\" frameborder=\"no\" loading=\"lazy\" allowtransparency=\"true\" allowfullscreen=\"true\"></iframe></div>",
  defaultMarkup: "<div class=\"embed\"><iframe src=\"<%data.embed%>\" <%data.length%> class=\"embed-unknown\" allowfullscreen=\"true\" frameborder=\"0\" ></iframe></div>"
};
var defaultParsers = {
  paragraph: function paragraph(data, config, tunes) {
    var style = {};

    if (tunes) {
      if ('anyTuneName' in tunes) {
        if ('alignment' in tunes.anyTuneName) {
          style['textAlign'] = tunes.anyTuneName.alignment;
        }
      }
    }

    return "<p className=\"".concat(config.paragraph.pClass, "\" style=").concat(Object.entries(style).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          k = _ref2[0],
          v = _ref2[1];

      return "\n\t\t$ {\n\t\t\tk\n\t\t}: $ {\n\t\t\tv\n\t\t}\n\t\t";
    }).join(';'), "> ").concat(data.text, " </p>");
  },
  header: function header(data) {
    return "<h".concat(data.level, ">").concat(data.text, "</h").concat(data.level, ">");
  },
  list: function list(data) {
    var type = data.style === "ordered" ? "ol" : "ul";
    var items = data.items.reduce(function (acc, item) {
      return acc + "<li><none></none>".concat(item, "</li>");
    }, "");
    return "<".concat(type, ">").concat(items, "</").concat(type, ">");
  },
  quote: function quote(data, config) {
    var alignment = "";

    if (config.quote.applyAlignment) {
      alignment = "style=\"text-align: ".concat(data.alignment, ";\"");
    }

    return "<blockquote ".concat(alignment, "><p>").concat(data.text, "</p><cite>").concat(data.caption, "</cite></blockquote>");
  },
  table: function table(data) {
    var thead = "";
    var theads = [];

    if (data.withHeadings) {
      if (data.content) {
        var shifted = data.content.shift();
        var thead_rows = "<tr>".concat(shifted.reduce(function (acc, cell) {
          return acc + " < td > $ {\n\t\t\t\t\tcell\n\t\t\t\t} < /td>";
        }, ""), " < /tr>");
        theads = shifted.reduce(function (acc, cell) {
          acc.push(cell);
          return acc;
        }, []);
        thead = "<thead>".concat(thead_rows, "</thead>");
      }
    }

    var tbody_rows = data.content.map(function (row) {
      return "<tr>".concat(row.reduce(function (acc, cell, index) {
        return acc + " < td data - label = \"".concat(theads[index], "\"\n\tdata - label - visible = \"").concat(thead !== '' ? 'true' : 'false', "\" > $ {\n\t\tcell\n\t} < /td>");
      }, ""), " < /tr>");
    });
    return "<table>".concat(thead, "<tbody>").concat(tbody_rows.join(""), "</tbody></table>");
  },
  image: function image(data, config) {
    var imageConditions = "".concat(data.stretched ? "img-fullwidth" : "", " ").concat(data.withBorder ? "img-border" : "", " ").concat(data.withBackground ? "img-bg" : "");
    var imgClass = config.image.imgClass || "";
    var imageSrc;

    if (data.url) {
      // simple-image was used and the image probably is not uploaded to this server
      // therefore, we use the absolute path provided in data.url
      // so, config.image.path property is useless in this case!
      imageSrc = data.url;
    } else if (config.image.path === "absolute") {
      imageSrc = data.file.url;
    } else {
      imageSrc = config.image.path.replace(/<(.+)>/, function (match, p1) {
        return data.file[p1];
      });
    }

    if (config.image.use === "img") {
      return "<img class=\"".concat(imageConditions, " ").concat(imgClass, "\" src=\"").concat(imageSrc, "\" alt=\"").concat(data.caption, "\">");
    } else if (config.image.use === "figure") {
      var figureClass = config.image.figureClass || "";
      var figCapClass = config.image.figCapClass || "";
      return "<figure class=\"".concat(figureClass, "\"><img class=\"").concat(imgClass, " ").concat(imageConditions, "\" src=\"").concat(imageSrc, "\" alt=\"").concat(data.caption, "\"><figcaption class=\"").concat(figCapClass, "\">").concat(data.caption, "</figcaption></figure>");
    }
  },
  code: function code(data, config) {
    var markup = sanitizeHtml(data.code);
    return "<pre><code class=\"".concat(config.code.codeBlockClass, "\">").concat(markup, "</code></pre>");
  },
  raw: function raw(data) {
    return data.html;
  },
  delimiter: function delimiter(data) {
    return "<hr />";
  },
  embed: function embed(data, config) {
    if (config.embed.useProvidedLength) {
      data.length = "width=\"".concat(data.width, "\" height=\"").concat(data.height, "\"");
    } else {
      data.length = "";
    }

    var regex = new RegExp(/<%data\.(.+?)%>/, "gm");

    if (config.embedMarkups[data.service]) {
      return config.embedMarkups[data.service].replace(regex, function (match, p1) {
        return data[p1];
      });
    } else {
      return config.embedMarkups["defaultMarkup"].replace(regex, function (match, p1) {
        return data[p1];
      });
    }
  },
  AnyButton: function AnyButton(data) {
    var testURI = new URL(data.link, "https://".concat(window.location.hostname));
    var target = "_blank";

    if (testURI.hostname === window.location.hostname) {
      target = "_self";
    }

    return "<a href=\"".concat(data.link, "\" target=\"").concat(target, "\" className=\"button\">").concat(data.text, "</a>");
  },
  checklist: function checklist(data) {
    var items = data.items.reduce(function (acc, item) {
      return acc + "<div className=\"".concat(item.checked ? 'checked' : 'unchecked', "\"><none></none>").concat(item.text, "</div>");
    }, "");
    return "<div className=\"checklist\">".concat(items, "</div>");
  },
  warning: function warning(data) {
    return "<div className=\"warning\"><p className=\"title\">".concat(data.title, "</p><p className=\"text\">").concat(data.text, "</p></div>");
  }
};
var defaultConfig = {
  image: {
    use: "figure",
    // figure or img (figcaption will be used for caption of figure)
    imgClass: "img",
    figureClass: "fig-img",
    figCapClass: "fig-cap",
    path: "absolute"
  },
  paragraph: {
    pClass: "paragraph"
  },
  code: {
    codeBlockClass: "code-block"
  },
  embed: {
    useProvidedLength: false // set to true if you want the returned width and height of editorjs to be applied
    // NOTE: sometimes source site overrides the lengths so it does not work 100%

  },
  quote: {
    applyAlignment: false // if set to true blockquote element will have text-align css property set

  }
};

var edjsParser = /*#__PURE__*/function () {
  function edjsParser() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var customs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var embeds = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, edjsParser);

    this.config = mergeDeep(defaultConfig, config);
    this.config.embedMarkups = Object.assign(embedMarkups, embeds);
    this.parsers = Object.assign(defaultParsers, customs);
  }

  _createClass(edjsParser, [{
    key: "parse",
    value: function parse(EditorJsObject) {
      var _this = this;

      var html = EditorJsObject.blocks.map(function (block) {
        var markup = _this.parseBlock(block);

        if (markup instanceof Error) {
          return ""; // parser for this kind of block doesn't exist
        }

        return markup;
      });
      return html.join("");
    }
  }, {
    key: "parseBlock",
    value: function parseBlock(block) {
      if (!this.parsers[block.type]) {
        return new Error("".concat(block.type, " is not supported! Define your own custom function."));
      }

      try {
        return this.parsers[block.type](block.data, this.config, 'tunes' in block ? block.tunes : {});
      } catch (err) {
        return err;
      }
    }
  }]);

  return edjsParser;
}();

export default edjsParser;
