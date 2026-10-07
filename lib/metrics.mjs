// Avaliador seguro de fórmulas de métricas dos packs.
// Só aceita números, nomes de inputs, + - * / ( ) e as funções round/min/max.
// Nunca usa eval: os packs são dados e não devem executar código no app.

const FUNCS = { round: Math.round, min: Math.min, max: Math.max };

export function tokenize(src) {
  const tokens = [];
  const re = /\s*(?:(\d+(?:\.\d+)?)|([A-Za-z_][A-Za-z0-9_]*)|(.))/gy;
  let m;
  while (re.lastIndex < src.length && (m = re.exec(src))) {
    if (m[1] !== undefined) tokens.push({ t: 'num', v: Number(m[1]) });
    else if (m[2] !== undefined) tokens.push({ t: 'id', v: m[2] });
    else if (m[3] !== undefined && m[3].trim()) {
      if (!'+-*/(),'.includes(m[3])) throw new Error(`Carácter inválido na fórmula: "${m[3]}"`);
      tokens.push({ t: 'op', v: m[3] });
    }
  }
  return tokens;
}

// Parser recursivo: expr := term (('+'|'-') term)* ; term := factor (('*'|'/') factor)* ;
// factor := num | id | id '(' args ')' | '(' expr ')' | '-' factor
export function parse(src) {
  const tk = tokenize(src);
  let i = 0;
  const peek = () => tk[i];
  const eat = (v) => {
    const t = tk[i];
    if (!t || t.v !== v) throw new Error(`Esperava "${v}" na fórmula "${src}"`);
    i++;
  };
  const expr = () => {
    let n = term();
    while (peek() && (peek().v === '+' || peek().v === '-')) n = { op: tk[i++].v, a: n, b: term() };
    return n;
  };
  const term = () => {
    let n = factor();
    while (peek() && (peek().v === '*' || peek().v === '/')) n = { op: tk[i++].v, a: n, b: factor() };
    return n;
  };
  const factor = () => {
    const t = tk[i++];
    if (!t) throw new Error(`Fórmula incompleta: "${src}"`);
    if (t.t === 'num') return { num: t.v };
    if (t.v === '-') return { op: 'neg', a: factor() };
    if (t.v === '(') { const n = expr(); eat(')'); return n; }
    if (t.t === 'id') {
      if (peek() && peek().v === '(') {
        if (!FUNCS[t.v]) throw new Error(`Função desconhecida: ${t.v}`);
        i++;
        const args = [expr()];
        while (peek() && peek().v === ',') { i++; args.push(expr()); }
        eat(')');
        return { fn: t.v, args };
      }
      return { id: t.v };
    }
    throw new Error(`Token inesperado "${t.v}" em "${src}"`);
  };
  const ast = expr();
  if (i < tk.length) throw new Error(`Sobra texto na fórmula "${src}"`);
  return ast;
}

export function identifiers(ast, out = new Set()) {
  if (ast.id) out.add(ast.id);
  if (ast.a) identifiers(ast.a, out);
  if (ast.b) identifiers(ast.b, out);
  if (ast.args) ast.args.forEach((a) => identifiers(a, out));
  return out;
}

function run(ast, scope) {
  if ('num' in ast) return ast.num;
  if (ast.id) {
    if (!(ast.id in scope)) throw new Error(`Variável desconhecida: ${ast.id}`);
    return scope[ast.id];
  }
  if (ast.fn) return FUNCS[ast.fn](...ast.args.map((a) => run(a, scope)));
  if (ast.op === 'neg') return -run(ast.a, scope);
  const a = run(ast.a, scope);
  const b = run(ast.b, scope);
  switch (ast.op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? 0 : a / b;
  }
  throw new Error('Operação inválida');
}

/**
 * Calcula as métricas de um pack.
 * @param {object} metrics  bloco "metrics" do pack.json
 * @param {object} values   valores introduzidos pelo lead (os em falta usam o default)
 * @returns {Record<string, number>} inputs + outputs, pela ordem declarada
 */
export function evaluateMetrics(metrics, values = {}) {
  const scope = {};
  for (const inp of metrics.inputs) {
    const v = values[inp.key] ?? inp.default;
    const num = Number(v);
    if (!Number.isFinite(num)) throw new Error(`Valor inválido para ${inp.key}`);
    scope[inp.key] = Math.min(inp.max ?? Infinity, Math.max(inp.min ?? -Infinity, num));
  }
  for (const out of metrics.outputs) scope[out.key] = run(parse(out.formula), scope);
  return scope;
}
