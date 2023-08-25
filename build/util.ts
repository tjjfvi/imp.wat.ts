const validIdent = /^(?!__proto__$)[\p{ID_Start}][\p{ID_Continue}]*$/u

export function stringifyName(name: string) {
  return validIdent.test(name) ? name : JSON.stringify(name)
}

export function stringifyProperty(name: string) {
  return validIdent.test(name) ? `.${name}` : `[${JSON.stringify(name)}]`
}

export function identBase(name: string) {
  return name.replace(/(?:^[^\p{ID_Start}]|[^\p{ID_Continue}]|_)+/gu, "_")
}

// JS reserved words (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#keywords):
export const reservedWords = [
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "new",
  "null",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "let",
  "static",
  "yield",
  "await",
]
