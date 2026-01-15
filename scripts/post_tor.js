hexo.extend.helper.register('post_tor', function(content) {
    if (!content) return ''
    const header_pattern = /<h([1-5])[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h[1-5]>/g
    const headers = [...content.matchAll(header_pattern)]
    if (!headers || headers.length === 0) return ''

    const stripHtml = html => String(html || '').replace(/<[^>]+>/g, '').trim()
    const f = headers.map(match => ({
        type: match[1],
        id: match[2],
        text: stripHtml(match[3]) || match[2]
    }))

    if (f.length === 0) return ''
    let out = ""
    for (const one of f) {
        const level = Number(one.type) || 1
        const tor_class = 'tor' + 'i'.repeat(level)
        out += `<a href="#${one.id}" class="${tor_class}">${one.text}</a><br>`
    }
    return out
});
