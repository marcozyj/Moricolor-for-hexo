const Prism = require('node-prismjs');
const titlecase = require('titlecase')

const regex = /<pre><code class="(.*)?">([\s\S]*?)<\/code><\/pre>/igm;
const map = {
    '&#39;': '\'',
    '&amp;': '&',
    '&gt;': '>',
    '&lt;': '<',
    '&quot;': '"'
}
/**
 * Unescape from Marked escape
 * @param {String} str
 * @return {String}
 */
function unescape(str) {
    if (!str || str === null) return ''
    const re = new RegExp('(' + Object.keys(map).join('|') + ')', 'g')
    return String(str).replace(re, (match) => map[match])
}
function formatLine(line, lang) {
    let parsedLine = ''
    if (Prism.languages[lang]) {
        parsedLine = Prism.highlight(line, Prism.languages[lang])
      } else {
        parsedLine = line
      }
    return `<span class="line">${parsedLine}</span>`
}
function normalizeLang(raw) {
    if (!raw) return ''
    const parts = String(raw).split(/\s+/)
    for (const part of parts) {
        if (!part) continue
        if (part.indexOf('language-') === 0) return part.slice('language-'.length).toLowerCase()
        if (part.indexOf('lang-') === 0) return part.slice('lang-'.length).toLowerCase()
    }
    return parts[0].toLowerCase()
}
function MoriPlugin(data) {
    data.content = data.content.replace(regex, (origin, rawLang, code) => {
        const lang = normalizeLang(rawLang)
        const displayLang = lang ? titlecase(lang) : 'Code'
        const startTag = `<figure class="highlight code" data-language="${displayLang}"><pre class="language-${lang}">`
        const endTag = `</pre><div class="tools"></div></figure>`
        code = unescape(code)
        code = code.trim().split("\n").map(e=>formatLine(e, lang)).join("\n")
        const parsedCode = code
        return startTag + parsedCode + endTag
      });
    return data;
}
hexo.extend.filter.register('after_post_render', MoriPlugin)
