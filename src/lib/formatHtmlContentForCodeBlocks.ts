const PARAGRAPH_CODE_BLOCK_REGEX = /(?:<p>\s*<code>[\s\S]*?<\/code>\s*<\/p>\s*)+/gi
const SINGLE_CODE_PARAGRAPH_REGEX = /<p>\s*<code>([\s\S]*?)<\/code>\s*<\/p>/gi
const QL_CODE_BLOCK_CONTAINER_REGEX =
  /<div[^>]*class="ql-code-block-container"[^>]*>((?:\s*<div[^>]*class="ql-code-block"[^>]*>[\s\S]*?<\/div>\s*)+)<\/div>/gi
const SINGLE_QL_CODE_BLOCK_REGEX = /<div[^>]*class="ql-code-block"[^>]*>([\s\S]*?)<\/div>/gi

const normalizeCodeLine = (line: string) => line.replace(/<br\s*\/?>/gi, '').trimEnd()

export const formatHtmlContentForCodeBlocks = (html?: string | null) => {
  if (!html) {
    return ''
  }

  const formattedCodeContainer = html.replace(QL_CODE_BLOCK_CONTAINER_REGEX, (matchedCodeBlock, codeContainerInnerHtml) => {
    const lines = Array.from(String(codeContainerInnerHtml).matchAll(SINGLE_QL_CODE_BLOCK_REGEX), (match: RegExpMatchArray) =>
      normalizeCodeLine(match[1] || '')
    )

    if (!lines.length) {
      return matchedCodeBlock
    }

    return `<pre><code>${lines.join('\n')}</code></pre>`
  })

  return formattedCodeContainer.replace(PARAGRAPH_CODE_BLOCK_REGEX, (matchedCodeBlock) => {
    const lines = Array.from(matchedCodeBlock.matchAll(SINGLE_CODE_PARAGRAPH_REGEX), (match: RegExpMatchArray) => normalizeCodeLine(match[1] || ''))

    if (!lines.length) {
      return matchedCodeBlock
    }

    return `<pre><code>${lines.join('\n')}</code></pre>`
  })
}
