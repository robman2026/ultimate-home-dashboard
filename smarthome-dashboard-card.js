/**
 * SmartHome Dashboard
 * Author: robman2026
 * GitHub: https://github.com/robman2026/ultimate-home-dashboard
 * Version: 1.0.2
 * License: MIT
 */

var Be = Object.defineProperty;
var We = (o, e, t) => e in o ? Be(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var f = (o, e, t) => We(o, typeof e != "symbol" ? e + "" : e, t);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis, pe = G.ShadowRoot && (G.ShadyCSS === void 0 || G.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ge = Symbol(), $e = /* @__PURE__ */ new WeakMap();
let Me = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== ge) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (pe && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = $e.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && $e.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Ge = (o) => new Me(typeof o == "string" ? o : o + "", void 0, ge), k = (o, ...e) => {
  const t = o.length === 1 ? o[0] : e.reduce((i, s, a) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + o[a + 1], o[0]);
  return new Me(t, o, ge);
}, Ve = (o, e) => {
  if (pe) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), s = G.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = t.cssText, o.appendChild(i);
  }
}, we = pe ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return Ge(t);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Je, defineProperty: qe, getOwnPropertyDescriptor: Ke, getOwnPropertyNames: Ye, getOwnPropertySymbols: Ze, getPrototypeOf: Qe } = Object, C = globalThis, ke = C.trustedTypes, Xe = ke ? ke.emptyScript : "", oe = C.reactiveElementPolyfillSupport, P = (o, e) => o, ce = { toAttribute(o, e) {
  switch (e) {
    case Boolean:
      o = o ? Xe : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, e) {
  let t = o;
  switch (e) {
    case Boolean:
      t = o !== null;
      break;
    case Number:
      t = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(o);
      } catch {
        t = null;
      }
  }
  return t;
} }, Ne = (o, e) => !Je(o, e), Se = { attribute: !0, type: String, converter: ce, reflect: !1, useDefault: !1, hasChanged: Ne };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), C.litPropertyMetadata ?? (C.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let L = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Se) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(e, i, t);
      s !== void 0 && qe(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: s, set: a } = Ke(this.prototype, e) ?? { get() {
      return this[t];
    }, set(r) {
      this[t] = r;
    } };
    return { get: s, set(r) {
      const d = s == null ? void 0 : s.call(this);
      a == null || a.call(this, r), this.requestUpdate(e, d, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Se;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const e = Qe(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const t = this.properties, i = [...Ye(t), ...Ze(t)];
      for (const s of i) this.createProperty(s, t[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, s] of t) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const s = this._$Eu(t, i);
      s !== void 0 && this._$Eh.set(s, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const s of i) t.unshift(we(s));
    } else e !== void 0 && t.push(we(e));
    return t;
  }
  static _$Eu(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((t) => t(this));
  }
  addController(e) {
    var t;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((t = e.hostConnected) == null || t.call(e));
  }
  removeController(e) {
    var t;
    (t = this._$EO) == null || t.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ve(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostConnected) == null ? void 0 : i.call(t);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((t) => {
      var i;
      return (i = t.hostDisconnected) == null ? void 0 : i.call(t);
    });
  }
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$ET(e, t) {
    var a;
    const i = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, i);
    if (s !== void 0 && i.reflect === !0) {
      const r = (((a = i.converter) == null ? void 0 : a.toAttribute) !== void 0 ? i.converter : ce).toAttribute(t, i.type);
      this._$Em = e, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(e, t) {
    var a, r;
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const d = i.getPropertyOptions(s), c = typeof d.converter == "function" ? { fromAttribute: d.converter } : ((a = d.converter) == null ? void 0 : a.fromAttribute) !== void 0 ? d.converter : ce;
      this._$Em = s;
      const p = c.fromAttribute(t, d.type);
      this[s] = p ?? ((r = this._$Ej) == null ? void 0 : r.get(s)) ?? p, this._$Em = null;
    }
  }
  requestUpdate(e, t, i, s = !1, a) {
    var r;
    if (e !== void 0) {
      const d = this.constructor;
      if (s === !1 && (a = this[e]), i ?? (i = d.getPropertyOptions(e)), !((i.hasChanged ?? Ne)(a, t) || i.useDefault && i.reflect && a === ((r = this._$Ej) == null ? void 0 : r.get(e)) && !this.hasAttribute(d._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: s, wrapped: a }, r) {
    i && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, r ?? t ?? this[e]), a !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [a, r] of this._$Ep) this[a] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [a, r] of s) {
        const { wrapped: d } = r, c = this[a];
        d !== !0 || this._$AL.has(a) || c === void 0 || this.C(a, void 0, r, c);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), (i = this._$EO) == null || i.forEach((s) => {
        var a;
        return (a = s.hostUpdate) == null ? void 0 : a.call(s);
      }), this.update(t)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var s;
      return (s = i.hostUpdated) == null ? void 0 : s.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
L.elementStyles = [], L.shadowRootOptions = { mode: "open" }, L[P("elementProperties")] = /* @__PURE__ */ new Map(), L[P("finalized")] = /* @__PURE__ */ new Map(), oe == null || oe({ ReactiveElement: L }), (C.reactiveElementVersions ?? (C.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, Ae = (o) => o, J = H.trustedTypes, Ce = J ? J.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, De = "$lit$", A = `lit$${Math.random().toFixed(9).slice(2)}$`, Pe = "?" + A, et = `<${Pe}>`, O = document, U = () => O.createComment(""), j = (o) => o === null || typeof o != "object" && typeof o != "function", me = Array.isArray, tt = (o) => me(o) || typeof (o == null ? void 0 : o[Symbol.iterator]) == "function", ae = `[ 	
\f\r]`, D = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ee = /-->/g, ze = />/g, E = RegExp(`>|${ae}(?:([^\\s"'>=/]+)(${ae}*=${ae}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Re = /'/g, Oe = /"/g, He = /^(?:script|style|textarea|title)$/i, it = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), l = it(1), M = Symbol.for("lit-noChange"), y = Symbol.for("lit-nothing"), Te = /* @__PURE__ */ new WeakMap(), z = O.createTreeWalker(O, 129);
function Ue(o, e) {
  if (!me(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ce !== void 0 ? Ce.createHTML(e) : e;
}
const st = (o, e) => {
  const t = o.length - 1, i = [];
  let s, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = D;
  for (let d = 0; d < t; d++) {
    const c = o[d];
    let p, m, g = -1, x = 0;
    for (; x < c.length && (r.lastIndex = x, m = r.exec(c), m !== null); ) x = r.lastIndex, r === D ? m[1] === "!--" ? r = Ee : m[1] !== void 0 ? r = ze : m[2] !== void 0 ? (He.test(m[2]) && (s = RegExp("</" + m[2], "g")), r = E) : m[3] !== void 0 && (r = E) : r === E ? m[0] === ">" ? (r = s ?? D, g = -1) : m[1] === void 0 ? g = -2 : (g = r.lastIndex - m[2].length, p = m[1], r = m[3] === void 0 ? E : m[3] === '"' ? Oe : Re) : r === Oe || r === Re ? r = E : r === Ee || r === ze ? r = D : (r = E, s = void 0);
    const b = r === E && o[d + 1].startsWith("/>") ? " " : "";
    a += r === D ? c + et : g >= 0 ? (i.push(p), c.slice(0, g) + De + c.slice(g) + A + b) : c + A + (g === -2 ? d : b);
  }
  return [Ue(o, a + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class I {
  constructor({ strings: e, _$litType$: t }, i) {
    let s;
    this.parts = [];
    let a = 0, r = 0;
    const d = e.length - 1, c = this.parts, [p, m] = st(e, t);
    if (this.el = I.createElement(p, i), z.currentNode = this.el.content, t === 2 || t === 3) {
      const g = this.el.content.firstChild;
      g.replaceWith(...g.childNodes);
    }
    for (; (s = z.nextNode()) !== null && c.length < d; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const g of s.getAttributeNames()) if (g.endsWith(De)) {
          const x = m[r++], b = s.getAttribute(g).split(A), v = /([.?@])?(.*)/.exec(x);
          c.push({ type: 1, index: a, name: v[2], strings: b, ctor: v[1] === "." ? at : v[1] === "?" ? rt : v[1] === "@" ? nt : se }), s.removeAttribute(g);
        } else g.startsWith(A) && (c.push({ type: 6, index: a }), s.removeAttribute(g));
        if (He.test(s.tagName)) {
          const g = s.textContent.split(A), x = g.length - 1;
          if (x > 0) {
            s.textContent = J ? J.emptyScript : "";
            for (let b = 0; b < x; b++) s.append(g[b], U()), z.nextNode(), c.push({ type: 2, index: ++a });
            s.append(g[x], U());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Pe) c.push({ type: 2, index: a });
      else {
        let g = -1;
        for (; (g = s.data.indexOf(A, g + 1)) !== -1; ) c.push({ type: 7, index: a }), g += A.length - 1;
      }
      a++;
    }
  }
  static createElement(e, t) {
    const i = O.createElement("template");
    return i.innerHTML = e, i;
  }
}
function N(o, e, t = o, i) {
  var r, d;
  if (e === M) return e;
  let s = i !== void 0 ? (r = t._$Co) == null ? void 0 : r[i] : t._$Cl;
  const a = j(e) ? void 0 : e._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== a && ((d = s == null ? void 0 : s._$AO) == null || d.call(s, !1), a === void 0 ? s = void 0 : (s = new a(o), s._$AT(o, t, i)), i !== void 0 ? (t._$Co ?? (t._$Co = []))[i] = s : t._$Cl = s), s !== void 0 && (e = N(o, s._$AS(o, e.values), s, i)), e;
}
class ot {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: i } = this._$AD, s = ((e == null ? void 0 : e.creationScope) ?? O).importNode(t, !0);
    z.currentNode = s;
    let a = z.nextNode(), r = 0, d = 0, c = i[0];
    for (; c !== void 0; ) {
      if (r === c.index) {
        let p;
        c.type === 2 ? p = new B(a, a.nextSibling, this, e) : c.type === 1 ? p = new c.ctor(a, c.name, c.strings, this, e) : c.type === 6 && (p = new lt(a, this, e)), this._$AV.push(p), c = i[++d];
      }
      r !== (c == null ? void 0 : c.index) && (a = z.nextNode(), r++);
    }
    return z.currentNode = O, s;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class B {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, t, i, s) {
    this.type = 2, this._$AH = y, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = N(this, e, t), j(e) ? e === y || e == null || e === "" ? (this._$AH !== y && this._$AR(), this._$AH = y) : e !== this._$AH && e !== M && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : tt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== y && j(this._$AH) ? this._$AA.nextSibling.data = e : this.T(O.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var a;
    const { values: t, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = I.createElement(Ue(i.h, i.h[0]), this.options)), i);
    if (((a = this._$AH) == null ? void 0 : a._$AD) === s) this._$AH.p(t);
    else {
      const r = new ot(s, this), d = r.u(this.options);
      r.p(t), this.T(d), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = Te.get(e.strings);
    return t === void 0 && Te.set(e.strings, t = new I(e)), t;
  }
  k(e) {
    me(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, s = 0;
    for (const a of e) s === t.length ? t.push(i = new B(this.O(U()), this.O(U()), this, this.options)) : i = t[s], i._$AI(a), s++;
    s < t.length && (this._$AR(i && i._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, t); e !== this._$AB; ) {
      const s = Ae(e).nextSibling;
      Ae(e).remove(), e = s;
    }
  }
  setConnected(e) {
    var t;
    this._$AM === void 0 && (this._$Cv = e, (t = this._$AP) == null || t.call(this, e));
  }
}
class se {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, s, a) {
    this.type = 1, this._$AH = y, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = y;
  }
  _$AI(e, t = this, i, s) {
    const a = this.strings;
    let r = !1;
    if (a === void 0) e = N(this, e, t, 0), r = !j(e) || e !== this._$AH && e !== M, r && (this._$AH = e);
    else {
      const d = e;
      let c, p;
      for (e = a[0], c = 0; c < a.length - 1; c++) p = N(this, d[i + c], t, c), p === M && (p = this._$AH[c]), r || (r = !j(p) || p !== this._$AH[c]), p === y ? e = y : e !== y && (e += (p ?? "") + a[c + 1]), this._$AH[c] = p;
    }
    r && !s && this.j(e);
  }
  j(e) {
    e === y ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class at extends se {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === y ? void 0 : e;
  }
}
class rt extends se {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== y);
  }
}
class nt extends se {
  constructor(e, t, i, s, a) {
    super(e, t, i, s, a), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = N(this, e, t, 0) ?? y) === M) return;
    const i = this._$AH, s = e === y && i !== y || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, a = e !== y && (i === y || s);
    s && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var t;
    typeof this._$AH == "function" ? this._$AH.call(((t = this.options) == null ? void 0 : t.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class lt {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    N(this, e);
  }
}
const re = H.litHtmlPolyfillSupport;
re == null || re(I, B), (H.litHtmlVersions ?? (H.litHtmlVersions = [])).push("3.3.3");
const ct = (o, e, t) => {
  const i = (t == null ? void 0 : t.renderBefore) ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const a = (t == null ? void 0 : t.renderBefore) ?? null;
    i._$litPart$ = s = new B(e.insertBefore(U(), a), a, void 0, t ?? {});
  }
  return s._$AI(o), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis;
class $ extends L {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ct(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return M;
  }
}
var Le;
$._$litElement$ = !0, $.finalized = !0, (Le = R.litElementHydrateSupport) == null || Le.call(R, { LitElement: $ });
const ne = R.litElementPolyfillSupport;
ne == null || ne({ LitElement: $ });
(R.litElementVersions ?? (R.litElementVersions = [])).push("4.2.2");
const T = k`
  :host {
    --sd-bg-deep:        #0b0f1e;
    --sd-bg-card:        rgba(18,26,52,0.85);
    --sd-bg-section:     rgba(255,255,255,0.04);
    --sd-border:         rgba(255,255,255,0.10);
    --sd-border-glow:    rgba(255,255,255,0.20);
    --sd-text-primary:   #eef0f8;
    --sd-text-secondary: rgba(200,210,240,0.55);
    --sd-text-muted:     rgba(180,195,230,0.30);
    --sd-gold:    #f59e0b;
    --sd-green:   #10b981;
    --sd-blue:    #3b82f6;
    --sd-cyan:    #06b6d4;
    --sd-red:     #ef4444;
    --sd-purple:  #8b5cf6;
    --sd-orange:  #f97316;
    --sd-radius:    18px;
    --sd-radius-sm: 12px;
    --sd-blur:      blur(20px);
    --sd-font:      'Outfit', system-ui, sans-serif;
    --sd-mono:      'JetBrains Mono', monospace;
    --sd-transition: 0.2s ease;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :host {
    display: block;
    font-family: var(--sd-font);
    color: var(--sd-text-primary);
  }

  .card {
    background: var(--sd-bg-card);
    border: 1px solid var(--sd-border);
    border-radius: var(--sd-radius);
    backdrop-filter: var(--sd-blur);
    -webkit-backdrop-filter: var(--sd-blur);
    padding: 16px;
    position: relative;
    overflow: hidden;
    transition: border-color var(--sd-transition);
  }
  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  }
  .card:hover { border-color: var(--sd-border-glow); }

  .label {
    font-size: 10px; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--sd-text-secondary);
    margin-bottom: 8px;
    display: flex; align-items: center; gap: 6px;
  }
  .label .dot { width: 7px; height: 7px; border-radius: 50%; }

  .value-big { font-size: 32px; font-weight: 200; color: var(--sd-text-primary); line-height: 1; }
  .value-sub  { font-size: 11px; color: var(--sd-text-secondary); margin-top: 2px; }

  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 8px;
    font-size: 10px; font-weight: 700;
  }
  .badge.green { background: rgba(16,185,129,0.15); color: var(--sd-green); }
  .badge.red   { background: rgba(239,68,68,0.15);  color: var(--sd-red);   }
  .badge.blue  { background: rgba(59,130,246,0.15); color: var(--sd-blue);  }
  .badge.gold  { background: rgba(245,158,11,0.15); color: var(--sd-gold);  }

  .sensor-dot {
    width: 8px; height: 8px; border-radius: 50%;
    display: inline-block; flex-shrink: 0;
  }
`, w = (o, e) => {
  var t;
  return e && ((t = o == null ? void 0 : o.states) == null ? void 0 : t[e]);
}, q = (o, e) => {
  const t = w(o, e);
  return t ? parseFloat(t.state) : null;
}, le = (o, e) => {
  var s;
  const t = w(o, e);
  if (!t) return "—";
  const i = ((s = t.attributes) == null ? void 0 : s.unit_of_measurement) ?? "";
  return `${t.state}${i}`;
}, Fe = (o, e) => {
  const t = w(o, e);
  return (t == null ? void 0 : t.state) === "on" || (t == null ? void 0 : t.state) === "open" || (t == null ? void 0 : t.state) === "playing";
}, _ = (o, e, t) => {
  var i, s;
  return (s = (i = w(o, e)) == null ? void 0 : i.attributes) == null ? void 0 : s[t];
}, V = (o, e, t, i) => o.callService(e, t, i), dt = (o) => o != null ? `${parseFloat(o).toFixed(1)}°` : "—", ht = (o) => o != null ? `${Math.round(o)}%` : "—";
class K extends $ {
  constructor() {
    super(), this._weatherTab = 0, this._tick();
  }
  connectedCallback() {
    super.connectedCallback(), this._interval = setInterval(() => this._tick(), 1e4);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), clearInterval(this._interval);
  }
  _tick() {
    const e = /* @__PURE__ */ new Date();
    this._time = `${String(e.getHours()).padStart(2, "0")}:${String(e.getMinutes()).padStart(2, "0")}`;
    const t = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], i = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this._date = `${t[e.getDay()]}, ${e.getDate()} ${i[e.getMonth()]} ${e.getFullYear()}`;
  }
  setConfig(e) {
    this.config = e;
  }
  _weatherIcon(e) {
    return {
      sunny: "☀️",
      clear: "☀️",
      partlycloudy: "⛅",
      cloudy: "☁️",
      rainy: "🌧️",
      pouring: "🌧️",
      snowy: "❄️",
      lightning: "⛈️",
      windy: "💨",
      fog: "🌫️",
      hail: "🌨️"
    }[e] ?? "🌡️";
  }
  render() {
    if (!this.hass || !this.config) return l``;
    const { weather_entity: e, sun_entity: t, location_name: i } = this.config, s = w(this.hass, e), a = (s == null ? void 0 : s.state) ?? "clear", r = _(this.hass, e, "temperature"), d = _(this.hass, e, "humidity"), c = _(this.hass, e, "pressure"), p = _(this.hass, e, "wind_speed"), m = _(this.hass, e, "forecast") ?? [], g = _(this.hass, t, "next_rising"), x = _(this.hass, t, "next_setting"), b = (v) => v ? new Date(v).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 }) : "—";
    return l`
      <!-- CLOCK CARD -->
      <div class="card clock-card">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span style="font-size:14px;">🏠</span>
          <span style="font-size:11px;color:var(--sd-text-secondary);font-weight:600;">
            ${i ?? "Home"}
          </span>
          <span style="margin-left:auto;" class="floor-badge">
            <span class="noc">● NOC</span>
          </span>
        </div>
        <div class="clock-time">${this._time}</div>
        <div class="clock-date">${this._date}</div>
        <div class="sun-row">
          <div class="sun-chip">
            <div class="sun-icon">☀️</div>
            <div>
              <div class="sun-lbl">Sunrise</div>
              <div class="sun-val">${b(g)}</div>
            </div>
          </div>
          <div class="sun-chip">
            <div class="sun-icon">🌅</div>
            <div>
              <div class="sun-lbl">Sunset</div>
              <div class="sun-val">${b(x)}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- WEATHER CARD (tap to cycle tabs) -->
      <div class="card weather-card" @click=${() => this._weatherTab = (this._weatherTab + 1) % 3}>

        ${this._weatherTab === 0 ? l`
          <div class="weather-desc-row">${a.replace(/-/g, " ").toUpperCase()}</div>
          <div class="weather-main">
            <div class="weather-icon">${this._weatherIcon(a)}</div>
            <div>
              <div class="weather-temp">${r ?? "—"}°</div>
              <div class="weather-sub">Feels like ${r ? Math.round(r - 2) : "—"}°</div>
            </div>
          </div>
          <div class="weather-stats">
            <div class="wstat"><div class="wv">${c ?? "—"}</div><div class="wl">hPa</div></div>
            <div class="wstat"><div class="wv">${d ?? "—"}%</div><div class="wl">Humidity</div></div>
            <div class="wstat"><div class="wv">${p ?? "—"} m/s</div><div class="wl">Wind</div></div>
          </div>
        ` : ""}

        ${this._weatherTab === 1 ? l`
          <div class="weather-desc-row">💨 WIND</div>
          <div style="display:flex;align-items:center;gap:14px;">
            <div style="width:70px;height:70px;border-radius:50%;border:2px solid rgba(255,255,255,0.1);background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;position:relative;flex-shrink:0;">
              <div style="font-size:22px;">🧭</div>
            </div>
            <div>
              <div style="font-size:32px;font-weight:200;color:#fff;line-height:1;">${p ?? "—"} <span style="font-size:13px;color:var(--sd-text-secondary);">m/s</span></div>
              <div style="font-size:11px;color:var(--sd-text-secondary);margin-top:4px;">Wind speed</div>
            </div>
          </div>
        ` : ""}

        ${this._weatherTab === 2 ? l`
          <div class="weather-desc-row">📅 FORECAST · 5 DAYS</div>
          ${m.slice(0, 5).map((v, S) => {
      const F = new Date(v.datetime), W = S === 0 ? "Today" : F.toLocaleDateString([], { weekday: "short", day: "numeric", month: "numeric" });
      return l`
              <div class="forecast-row">
                <div class="forecast-day">${W}</div>
                <div class="forecast-icon">${this._weatherIcon(v.condition)}</div>
                <div class="forecast-rain">${v.precipitation ? `💧 ${v.precipitation}mm` : "—"}</div>
                <div class="forecast-temp">${v.templow ?? "—"}° / ${v.temperature ?? "—"}°</div>
              </div>
            `;
    })}
        ` : ""}

        <div class="pager">
          ${[0, 1, 2].map((v) => l`
            <div class="pager-dot ${this._weatherTab === v ? "active" : ""}"></div>
          `)}
        </div>
      </div>
    `;
  }
  static getStubConfig() {
    return {
      location_name: "House — Floor 1",
      weather_entity: "weather.home",
      sun_entity: "sun.sun"
    };
  }
}
f(K, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  _time: { state: !0 },
  _date: { state: !0 },
  _weatherTab: { state: !0 }
}), f(K, "styles", [T, k`
    /* CLOCK */
    .clock-card {
      background: linear-gradient(135deg, rgba(30,50,100,0.85), rgba(20,30,70,0.85));
      border-color: rgba(96,165,250,0.2);
    }
    .floor-badge {
      display: inline-flex; align-items: center; gap: 5px;
      background: rgba(255,255,255,0.08); border-radius: 12px;
      padding: 3px 10px; font-size: 10px; font-weight: 700;
      color: rgba(255,255,255,0.5); margin-bottom: 8px;
    }
    .noc { color: var(--sd-blue); }
    .clock-time {
      font-size: 58px; font-weight: 200; line-height: 1;
      color: #fff; letter-spacing: -3px; font-family: var(--sd-mono);
    }
    .clock-date { font-size: 11px; color: var(--sd-text-secondary); margin: 5px 0 14px; }
    .sun-row { display: flex; gap: 8px; }
    .sun-chip {
      flex: 1; background: rgba(255,255,255,0.06);
      border-radius: 12px; padding: 8px 10px;
      display: flex; align-items: center; gap: 8px;
    }
    .sun-icon { font-size: 18px; flex-shrink: 0; }
    .sun-lbl { font-size: 9px; color: var(--sd-text-muted); text-transform: uppercase; letter-spacing: .05em; }
    .sun-val { font-size: 15px; font-weight: 600; color: #fff; }

    /* WEATHER */
    .weather-card { cursor: pointer; }
    .weather-desc-row { font-size: 9px; color: var(--sd-text-muted); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 8px; }
    .weather-main { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
    .weather-icon { font-size: 44px; line-height: 1; }
    .weather-temp { font-size: 46px; font-weight: 200; color: #fff; line-height: 1; }
    .weather-sub  { font-size: 11px; color: var(--sd-text-secondary); margin-top: 2px; }
    .weather-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 6px; }
    .wstat { background: rgba(255,255,255,0.05); border-radius: 10px; padding: 8px; text-align: center; }
    .wv { font-size: 13px; font-weight: 600; color: #fff; }
    .wl { font-size: 9px; color: var(--sd-text-muted); text-transform: uppercase; margin-top: 1px; }

    /* Forecast */
    .forecast-row {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
      font-size: 12px;
    }
    .forecast-row:last-child { border-bottom: none; }
    .forecast-day { flex: 1; font-weight: 600; color: rgba(255,255,255,0.7); }
    .forecast-icon { font-size: 16px; }
    .forecast-rain { color: var(--sd-blue); font-size: 10px; min-width: 50px; text-align: center; }
    .forecast-temp { font-weight: 700; font-size: 11px; min-width: 55px; text-align: right; }

    /* Pager dots */
    .pager { display: flex; gap: 3px; justify-content: center; margin-top: 8px; }
    .pager-dot { height: 3px; border-radius: 2px; background: rgba(255,255,255,0.2); transition: all .2s; }
    .pager-dot.active { width: 18px; background: #fff; }
    .pager-dot:not(.active) { width: 6px; }
  `]);
customElements.define("clock-weather-card", K);
class Y extends $ {
  setConfig(e) {
    this.config = e;
  }
  render() {
    if (!this.hass || !this.config) return l``;
    const e = this.config.members ?? [];
    return l`
      <div class="card">
        <div class="label">
          <span class="dot" style="background:var(--sd-blue)"></span>
          Household Members
        </div>
        <div class="members">
          ${e.map((t) => {
      const i = w(this.hass, t.person_entity), s = (i == null ? void 0 : i.state) === "home", a = _(this.hass, t.person_entity, "entity_picture"), r = (t.name ?? "?").split(" ").map((d) => d[0]).join("").substring(0, 2).toUpperCase();
      return l`
              <div class="member">
                <div class="avatar ${s ? "home" : "away"}">
                  ${a ? l`<img src="${a}" alt="${t.name}">` : r}
                </div>
                <div class="member-name">${t.name ?? "—"}</div>
                <div class="member-status ${s ? "home" : "away"}">
                  ${s ? "Home" : (i == null ? void 0 : i.state) ?? "Away"}
                </div>
              </div>
            `;
    })}
        </div>
      </div>
    `;
  }
  static getStubConfig() {
    return {
      members: [
        { name: "Patrik", person_entity: "person.patrik" },
        { name: "Anna", person_entity: "person.anna" }
      ]
    };
  }
}
f(Y, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}), f(Y, "styles", [T, k`    .members { display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-start; }
    .member { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; }
    .avatar {
      width: 46px; height: 46px; border-radius: 50%;
      background: rgba(255,255,255,0.08);
      border: 2px solid rgba(255,255,255,0.12);
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; color: #fff;
      transition: all .2s; position: relative; overflow: hidden;
    }
    .avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
    .avatar::after {
      content: ''; position: absolute; bottom: 0; right: 0;
      width: 10px; height: 10px; border-radius: 50%;
      border: 2px solid rgba(10,14,28,0.9);
    }
    .avatar.home  { border-color: var(--sd-green); }
    .avatar.home::after  { background: var(--sd-green); }
    .avatar.away::after  { background: rgba(255,255,255,0.2); }
    .avatar:hover { transform: scale(1.08); }
    .member-name   { font-size: 9px; color: var(--sd-text-secondary); text-align: center; }
    .member-status { font-size: 8px; text-align: center; }
    .member-status.home { color: var(--sd-green); }
    .member-status.away { color: var(--sd-text-muted); }
  `]);
customElements.define("members-card", Y);
class Z extends $ {
  setConfig(e) {
    this.config = e;
  }
  _getLightsOn() {
    var t;
    return (((t = this.config) == null ? void 0 : t.lights) ?? []).filter((i) => Fe(this.hass, i)).length;
  }
  _getSensorState(e, t) {
    const i = w(this.hass, e);
    if (!i) return null;
    const s = i.state === "on" || i.state === "open" || i.state === "detected", a = {
      presence: { on: "#10b981", off: "rgba(255,255,255,0.2)" },
      door: { on: "#ef4444", off: "#3b82f6" },
      motion: { on: "#f59e0b", off: "rgba(255,255,255,0.2)" }
    }[t] ?? { on: "#10b981", off: "rgba(255,255,255,0.2)" };
    return { on: s, color: s ? a.on : a.off };
  }
  render() {
    if (!this.hass || !this.config) return l``;
    const {
      name: e,
      icon: t,
      temp_sensor: i,
      hum_sensor: s,
      lights: a = [],
      presence_sensor: r,
      door_sensor: d,
      motion_sensor: c
    } = this.config, p = q(this.hass, i), m = q(this.hass, s), g = this._getLightsOn(), x = a.length > 0, b = r ? this._getSensorState(r, "presence") : null, v = d ? this._getSensorState(d, "door") : null, S = c ? this._getSensorState(c, "motion") : null;
    return l`
      <div class="card room-card ${g > 0 ? "active" : ""}"
           @click=${() => this._handleCardClick()}>

        <div class="room-icon">${t || "🏠"}</div>
        <div class="room-name">${e || "Room"}</div>

        ${g > 0 ? l`
          <div class="lights-on">💡 ${g} light${g > 1 ? "s" : ""} on</div>
        ` : ""}

        ${p != null ? l`
          <div class="temp-row">
            <span class="temp">${dt(p)}</span>
            ${m != null ? l`<span class="hum">💧 ${ht(m)}</span>` : ""}
          </div>
        ` : l`<div class="no-data">— / —</div>`}

        <!-- Sensor indicators -->
        <div class="sensor-row">
          ${b ? l`
            <div class="sensor-chip">
              <div class="dot" style="background:${b.color};
                ${b.on ? "box-shadow:0 0 5px " + b.color : ""}"></div>
              🧍
            </div>` : ""}
          ${v ? l`
            <div class="sensor-chip">
              <div class="dot" style="background:${v.color};
                box-shadow:0 0 5px ${v.color}88"></div>
              🚪
            </div>` : ""}
          ${S ? l`
            <div class="sensor-chip">
              <div class="dot" style="background:${S.color};
                ${S.on ? "box-shadow:0 0 5px " + S.color : ""}"></div>
              👁
            </div>` : ""}
        </div>

        <div class="btn-row" @click=${(F) => F.stopPropagation()}>
          ${x ? l`
            <div class="icon-btn ${g > 0 ? "active" : ""}"
                 @click=${() => this._toggleLights()}
                 title="Lights">💡</div>
          ` : ""}
          <div class="icon-btn" title="Climate">🌡</div>
          <div class="icon-btn" title="Info">ℹ</div>
        </div>
      </div>
    `;
  }
  _handleCardClick() {
    this.dispatchEvent(new CustomEvent("room-card-click", {
      bubbles: !0,
      composed: !0,
      detail: { config: this.config }
    }));
  }
  _toggleLights() {
    var i;
    const e = ((i = this.config) == null ? void 0 : i.lights) ?? [], t = e.some((s) => Fe(this.hass, s));
    e.forEach((s) => {
      const [a] = s.split(".");
      this.hass.callService(a, t ? "turn_off" : "turn_on", { entity_id: s });
    });
  }
  static getConfigElement() {
    return document.createElement("room-card-editor");
  }
  static getStubConfig() {
    return {
      name: "Living Room",
      icon: "🛋️",
      lights: [],
      temp_sensor: "",
      hum_sensor: "",
      presence_sensor: "",
      door_sensor: "",
      motion_sensor: ""
    };
  }
}
f(Z, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  _expanded: { state: !0 }
}), f(Z, "styles", [T, k`
    .room-card {
      cursor: pointer;
      transition: all 0.2s;
      min-height: 130px;
      display: flex; flex-direction: column;
      gap: 4px;
    }
    .room-card.active {
      background: linear-gradient(135deg,rgba(245,158,11,0.22),rgba(245,158,11,0.08));
      border-color: rgba(245,158,11,0.6);
      box-shadow: 0 0 20px rgba(245,158,11,0.18);
    }
    .room-icon { font-size: 24px; margin-bottom: 4px; }
    .room-name { font-size: 13px; font-weight: 700; color: #fff; }
    .lights-on { font-size: 9px; color: #fcd34d; font-weight: 700;
      text-shadow: 0 0 8px rgba(252,211,77,0.6); }

    .temp-row { display: flex; align-items: baseline; gap: 6px; margin-top: 4px; }
    .temp { font-size: 26px; font-weight: 300; color: #fff; }
    .hum  { font-size: 11px; color: #60a5fa; font-weight: 600; }

    .no-data { font-size: 12px; color: var(--sd-text-muted); }

    .sensor-row {
      display: flex; gap: 4px; margin-top: 6px; flex-wrap: wrap;
    }
    .sensor-chip {
      display: flex; align-items: center; gap: 3px;
      padding: 2px 6px; border-radius: 6px;
      background: rgba(255,255,255,0.06);
      font-size: 9px;
    }
    .sensor-chip .dot {
      width: 5px; height: 5px; border-radius: 50%;
    }

    .btn-row {
      display: flex; gap: 4px; margin-top: auto; padding-top: 8px;
    }
    .icon-btn {
      width: 26px; height: 26px; border-radius: 8px;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.15s;
      color: var(--sd-text-muted); font-size: 13px;
    }
    .icon-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
    .icon-btn.active { background: rgba(245,158,11,0.25); color: #f59e0b;
      border-color: rgba(245,158,11,0.4); }
  `]);
customElements.define("room-card", Z);
class Q extends $ {
  constructor() {
    super(), this._localOffset = 0, this._animFrame = null;
  }
  setConfig(e) {
    this.config = e;
  }
  _getState() {
    var t;
    const e = w(this.hass, (t = this.config) == null ? void 0 : t.cover_entity);
    return (e == null ? void 0 : e.state) ?? "unknown";
  }
  _action(e) {
    var c;
    const t = (c = this.config) == null ? void 0 : c.cover_entity;
    if (!t || (this._animFrame && (cancelAnimationFrame(this._animFrame), this._animFrame = null), e === "stop")) return;
    const i = this._localOffset, s = 25, a = performance.now(), r = (p) => {
      const m = (p - a) / 1e3;
      e === "open" ? this._localOffset = Math.min(100, i + m * s) : this._localOffset = Math.max(0, i - m * s), this.requestUpdate(), e === "open" && this._localOffset >= 100 || e === "close" && this._localOffset <= 0 ? this._animFrame = null : this._animFrame = requestAnimationFrame(r);
    };
    this._animFrame = requestAnimationFrame(r);
    const d = { open: "open_cover", close: "close_cover", stop: "stop_cover" };
    V(this.hass, "cover", d[e], { entity_id: t });
  }
  _renderGarageSVG() {
    const t = -(this._localOffset * 1.26);
    return l`
      <svg width="100%" viewBox="0 0 300 240" xmlns="http://www.w3.org/2000/svg"
           style="overflow:hidden;display:block;">
        <defs>
          <clipPath id="gdc" clipPathUnits="userSpaceOnUse">
            <rect x="24" y="100" width="252" height="124"/>
          </clipPath>
          <pattern id="checker" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <rect width="10" height="10" fill="#1a1f2e"/>
            <rect width="5" height="5" fill="#1e2436"/>
            <rect x="5" y="5" width="5" height="5" fill="#1e2436"/>
          </pattern>
        </defs>
        <!-- Sky -->
        <rect width="300" height="240" fill="#0a0f1e"/>
        <rect width="300" height="120" fill="#0d1428"/>
        <!-- Wall -->
        <rect x="0" y="62" width="300" height="178" fill="#c8cdd6"/>
        <!-- Balcony ledge -->
        <rect x="0" y="60" width="300" height="10" fill="#b0b8c4"/>
        <!-- Glass balcony -->
        <rect x="2" y="14" width="296" height="48" fill="rgba(220,235,255,0.15)" rx="1"/>
        <rect x="2" y="14" width="296" height="48" fill="none" stroke="rgba(200,215,240,0.4)" stroke-width="1" rx="1"/>
        <!-- Railing posts -->
        <rect x="2"   y="6" width="3" height="56" fill="rgba(220,230,245,0.7)" rx="1"/>
        <rect x="295" y="6" width="3" height="56" fill="rgba(220,230,245,0.7)" rx="1"/>
        <rect x="148" y="6" width="2" height="56" fill="rgba(220,230,245,0.5)" rx="1"/>
        <rect x="0"   y="5" width="300" height="4" fill="rgba(210,225,240,0.6)" rx="1"/>
        <!-- Basketball hoop pole -->
        <rect x="146" y="6" width="8" height="52" fill="rgba(180,190,210,0.5)" rx="1"/>
        <!-- Backboard -->
        <rect x="122" y="34" width="56" height="34" fill="#1a2030" rx="3" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
        <rect x="131" y="39" width="38" height="22" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1" rx="1"/>
        <!-- Rim -->
        <path d="M 132 68 Q 150 72 168 68" fill="none" stroke="#e05a10" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Net -->
        <line x1="134" y1="68" x2="136" y2="80" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
        <line x1="146" y1="71" x2="146" y2="82" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
        <line x1="150" y1="72" x2="150" y2="83" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
        <line x1="166" y1="68" x2="164" y2="80" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
        <!-- Pillars -->
        <rect x="0"   y="70" width="22" height="162" fill="#bcc3cc"/>
        <rect x="278" y="70" width="22" height="162" fill="#bcc3cc"/>
        <!-- Door frame -->
        <rect x="22" y="90"  width="256" height="12" fill="#a8b0ba"/>
        <rect x="22" y="90"  width="4"   height="136" fill="#a8b0ba"/>
        <rect x="274" y="90" width="4"   height="136" fill="#a8b0ba"/>
        <rect x="22" y="222" width="256" height="4"   fill="#a8b0ba"/>
        <!-- Interior -->
        <rect x="24" y="100" width="252" height="124" fill="#0a0d14"/>
        <!-- Door panels (animated) -->
        <g clip-path="url(#gdc)">
          <rect id="dp1" x="24" y="${100 + t}" width="252" height="24" fill="#3d4347"/>
          <rect id="dp2" x="24" y="${124 + t}" width="252" height="25" fill="#383e42"/>
          <rect id="dp3" x="24" y="${149 + t}" width="252" height="25" fill="#3d4347"/>
          <rect id="dp4" x="24" y="${174 + t}" width="252" height="25" fill="#383e42"/>
          <rect id="dp5" x="24" y="${199 + t}" width="252" height="25" fill="#3d4347"/>
          <line x1="24" y1="${124 + t}" x2="276" y2="${124 + t}" stroke="#2a2e31" stroke-width="1.5"/>
          <line x1="24" y1="${149 + t}" x2="276" y2="${149 + t}" stroke="#2a2e31" stroke-width="1.5"/>
          <line x1="24" y1="${174 + t}" x2="276" y2="${174 + t}" stroke="#2a2e31" stroke-width="1.5"/>
          <line x1="24" y1="${199 + t}" x2="276" y2="${199 + t}" stroke="#2a2e31" stroke-width="1.5"/>
          <circle cx="150" cy="${186 + t}" r="5" fill="#2e3337" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
        </g>
        <!-- Green indicator -->
        <circle cx="32" cy="104" r="3" fill="#22c55e" opacity="0.95"/>
        <circle cx="32" cy="104" r="5.5" fill="rgba(34,197,94,0.2)"/>
        <!-- Ground -->
        <rect x="0" y="224" width="300" height="16" fill="url(#checker)"/>
        <rect x="0" y="224" width="300" height="2" fill="#888f9a"/>
      </svg>
    `;
  }
  render() {
    if (!this.hass || !this.config) return l``;
    const e = this._getState(), t = e === "open" ? "open" : e === "closed" ? "closed" : "moving", i = { open: "OPEN", closed: "CLOSED", opening: "OPENING", closing: "CLOSING" }[e] ?? e.toUpperCase();
    return l`
      <div class="card garage-wrap">
        <div class="garage-header">
          <div class="garage-icon">🏠</div>
          <div>
            <div class="garage-title">${this.config.name ?? "Garage Door"}</div>
            <div class="garage-sub">House — ${this.config.floor ?? "Floor 1"}</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr auto;gap:14px;align-items:start;">
          <div class="garage-svg-wrap">${this._renderGarageSVG()}</div>
          <div class="controls">
            <div style="font-size:9px;color:var(--sd-text-muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;">Control</div>
            <button class="ctrl-btn open"  @click=${() => this._action("open")}>↑ Open</button>
            <button class="ctrl-btn stop"  @click=${() => this._action("stop")}>■ Stop</button>
            <button class="ctrl-btn close" @click=${() => this._action("close")}>↓ Close</button>
          </div>
        </div>

        <div class="status-bar">
          <span class="status-label">Status:</span>
          <span class="status-val ${t}">${i}</span>
          <span class="status-label">Position: ${Math.round(this._localOffset)}%</span>
        </div>
      </div>
    `;
  }
  static getConfigElement() {
    return document.createElement("garage-card-editor");
  }
  static getStubConfig() {
    return {
      name: "Garage Door",
      floor: "Floor 1",
      cover_entity: "cover.smart_garage",
      door_sensor: "binary_sensor.garage_door_garage_door_contact",
      temp_sensor: "sensor.temp_hum_garaj_temperature"
    };
  }
}
f(Q, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  _animOffset: { state: !0 },
  _animFrame: { state: !0 },
  _localOffset: { state: !0 }
}), f(Q, "styles", [T, k`
    .garage-wrap { display: flex; flex-direction: column; gap: 12px; }

    .garage-header {
      display: flex; align-items: center; gap: 10px;
    }
    .garage-icon {
      width: 40px; height: 40px; border-radius: 12px;
      background: rgba(255,255,255,0.08);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
    }
    .garage-title { font-size: 18px; font-weight: 700; color: #fff; }
    .garage-sub   { font-size: 11px; color: var(--sd-text-muted); }

    .garage-svg-wrap {
      border-radius: 12px; overflow: hidden;
      background: rgba(15,20,40,0.7);
    }

    .controls {
      display: flex; flex-direction: column; gap: 8px;
    }
    .ctrl-btn {
      width: 100%; padding: 12px;
      border: none; border-radius: 12px;
      font-size: 14px; font-weight: 700;
      cursor: pointer; transition: all 0.2s;
      display: flex; align-items: center; justify-content: center; gap: 6px;
    }
    .ctrl-btn.open  { background: linear-gradient(135deg,#16a34a,#22c55e); color:#fff; }
    .ctrl-btn.stop  { background: rgba(239,68,68,0.8); color: #fff; }
    .ctrl-btn.close { background: linear-gradient(135deg,#dc2626,#ef4444); color: #fff; }
    .ctrl-btn:hover { filter: brightness(1.1); transform: scale(1.01); }

    .status-bar {
      display: flex; justify-content: space-between;
      font-size: 11px; padding-top: 8px;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .status-label { color: var(--sd-text-muted); }
    .status-val   { font-weight: 700; }
    .status-val.open   { color: #f59e0b; }
    .status-val.closed { color: #10b981; }
    .status-val.moving { color: #f97316; }
  `]);
customElements.define("garage-card", Q);
class X extends $ {
  setConfig(e) {
    this.config = e;
  }
  render() {
    if (!this.hass || !this.config) return l``;
    const { power_entity: e, today_entity: t, month_entity: i, devices: s = [] } = this.config, a = q(this.hass, e), r = le(this.hass, t), d = le(this.hass, i), c = [45, 70, 55, 80, 60, 100];
    return l`
      <div class="card">
        <div class="label">
          <span class="dot" style="background:var(--sd-gold)"></span>
          ⚡ Power Consumption
        </div>

        <div class="energy-wrap">
          <div class="main-power">
            <span class="power-val">${(a == null ? void 0 : a.toFixed(1)) ?? "—"}</span>
            <span class="power-unit">kW</span>
          </div>

          <div>
            <div class="bar-chart">
              ${c.map((p, m) => l`
                <div class="bar ${m === c.length - 1 ? "current" : ""}"
                     style="height:${p}%"></div>
              `)}
            </div>
            <div class="bar-labels">
              <span>-5h</span><span>-4h</span><span>-3h</span>
              <span>-2h</span><span>-1h</span><span>now</span>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat">
              <div class="stat-val">${r}</div>
              <div class="stat-lbl">Today</div>
            </div>
            <div class="stat">
              <div class="stat-val">${d}</div>
              <div class="stat-lbl">Month</div>
            </div>
            <div class="stat">
              <div class="stat-val" style="color:var(--sd-gold)">
                ${a != null ? (a * 0.32).toFixed(2) + "€" : "—"}
              </div>
              <div class="stat-lbl">Est./hr</div>
            </div>
          </div>

          ${s.length > 0 ? l`
            <div class="devices-list">
              ${s.map((p) => l`
                <div class="device-row">
                  <span class="device-icon">${p.icon || "🔌"}</span>
                  <span class="device-name">${p.name}</span>
                  <span class="device-val">
                    ${le(this.hass, p.entity)}
                  </span>
                </div>
              `)}
            </div>
          ` : ""}
        </div>
      </div>
    `;
  }
  static getConfigElement() {
    return document.createElement("energy-card-editor");
  }
  static getStubConfig() {
    return {
      power_entity: "sensor.em_home_power",
      today_entity: "sensor.em_home_energy_today",
      month_entity: "sensor.em_home_energy_month",
      devices: [
        { name: "Laundry", icon: "🫧", entity: "sensor.em_laundry_power" }
      ]
    };
  }
}
f(X, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}), f(X, "styles", [T, k`
    .energy-wrap { display: flex; flex-direction: column; gap: 10px; }

    .main-power {
      display: flex; align-items: flex-end; gap: 6px;
    }
    .power-val { font-size: 42px; font-weight: 200; color: #fff; line-height: 1; }
    .power-unit { font-size: 16px; color: var(--sd-text-secondary); margin-bottom: 5px; }

    .bar-chart {
      display: flex; align-items: flex-end;
      gap: 3px; height: 48px;
    }
    .bar {
      flex: 1; border-radius: 3px 3px 0 0;
      background: rgba(245,158,11,0.35);
      transition: height 0.5s ease;
      min-height: 3px;
    }
    .bar.current {
      background: rgba(245,158,11,0.7);
      box-shadow: 0 0 8px rgba(245,158,11,0.4);
    }
    .bar-labels {
      display: flex; justify-content: space-between;
      font-size: 8px; color: var(--sd-text-muted);
      margin-top: 3px;
    }

    .stats-grid {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 6px;
    }
    .stat {
      background: rgba(255,255,255,0.05);
      border-radius: 10px; padding: 8px;
      text-align: center;
    }
    .stat-val { font-size: 14px; font-weight: 600; color: #fff; }
    .stat-lbl { font-size: 8px; color: var(--sd-text-muted); text-transform: uppercase; margin-top: 2px; }

    .devices-list { display: flex; flex-direction: column; gap: 6px; }
    .device-row {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 8px; border-radius: 8px;
      background: rgba(255,255,255,0.04);
    }
    .device-icon { font-size: 14px; }
    .device-name { font-size: 11px; color: var(--sd-text-secondary); flex: 1; }
    .device-val { font-size: 12px; font-weight: 700; color: var(--sd-gold); }
  `]);
customElements.define("energy-card", X);
class ee extends $ {
  constructor() {
    super(), this._activeTab = "spotify";
  }
  setConfig(e) {
    this.config = e;
  }
  _spotify() {
    const { spotify_entity: e } = this.config ?? {}, t = w(this.hass, e);
    return t ? {
      state: t.state,
      title: _(this.hass, e, "media_title") ?? "—",
      artist: _(this.hass, e, "media_artist") ?? "—",
      duration: _(this.hass, e, "media_duration") ?? 0,
      position: _(this.hass, e, "media_position") ?? 0,
      image: _(this.hass, e, "entity_picture") ?? null,
      volume: (_(this.hass, e, "volume_level") ?? 0.7) * 100,
      playing: t.state === "playing"
    } : null;
  }
  _spotifyCmd(e) {
    var d;
    const t = (d = this.config) == null ? void 0 : d.spotify_entity;
    if (!t) return;
    const i = {
      play_pause: ["media_player", "media_play_pause", { entity_id: t }],
      next: ["media_player", "media_next_track", { entity_id: t }],
      prev: ["media_player", "media_previous_track", { entity_id: t }]
    }, [s, a, r] = i[e] ?? [];
    s && V(this.hass, s, a, r);
  }
  _formatTime(e) {
    if (!e) return "0:00";
    const t = Math.floor(e / 60), i = Math.floor(e % 60);
    return `${t}:${String(i).padStart(2, "0")}`;
  }
  render() {
    if (!this.hass || !this.config) return l``;
    const e = this._spotify(), t = w(this.hass, this.config.tv_entity), i = e ? e.position / (e.duration || 1) * 100 : 0;
    return l`
      <div class="card">
        <div class="media-tabs">
          ${["spotify", "tv", "cam", "bell"].map((s) => l`
            <div class="tab ${this._activeTab === s ? "active" : ""}"
                 @click=${() => this._activeTab = s}>
              ${{ spotify: "🎵", tv: "📺", cam: "📷", bell: "🔔" }[s]} ${s.toUpperCase()}
            </div>
          `)}
        </div>

        ${this._activeTab === "spotify" ? l`
          <div class="album-art">
            ${e != null && e.image ? l`<img class="album-img" src="${e.image}" alt="album">` : l`<div class="album-placeholder">🎵</div>`}
          </div>
          <div class="track-name">${(e == null ? void 0 : e.title) ?? "—"}</div>
          <div class="track-artist">${(e == null ? void 0 : e.artist) ?? "—"}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${i}%"></div>
          </div>
          <div class="progress-times">
            <span>${this._formatTime(e == null ? void 0 : e.position)}</span>
            <span>${this._formatTime(e == null ? void 0 : e.duration)}</span>
          </div>
          <div class="controls">
            <button class="ctrl" @click=${() => this._spotifyCmd("prev")}>⏮</button>
            <button class="ctrl play"
              @click=${() => this._spotifyCmd("play_pause")}>
              ${e != null && e.playing ? "⏸" : "▶"}
            </button>
            <button class="ctrl" @click=${() => this._spotifyCmd("next")}>⏭</button>
          </div>
          <div class="vol-row">
            <div class="vol-lbl">🔊 Volume</div>
            <input type="range" min="0" max="100"
              .value=${(e == null ? void 0 : e.volume) ?? 70}
              style="width:100%;accent-color:var(--sd-green);"
              @change=${(s) => V(this.hass, "media_player", "volume_set", {
      entity_id: this.config.spotify_entity,
      volume_level: s.target.value / 100
    })}>
          </div>
        ` : ""}

        ${this._activeTab === "tv" ? l`
          <div class="tv-screen">📺</div>
          <div class="tv-state">
            ${t ? `${t.state === "on" ? "🟢 On" : "⭕ Off"} · ${_(this.hass, this.config.tv_entity, "friendly_name") ?? "TV"}` : "No TV entity configured"}
          </div>
          ${t ? l`
            <div class="controls" style="margin-top:12px;">
              <button class="ctrl" @click=${() => V(this.hass, "media_player", t.state === "on" ? "turn_off" : "turn_on", { entity_id: this.config.tv_entity })}>
                ${t.state === "on" ? "⏻" : "▶"}
              </button>
            </div>
          ` : ""}
        ` : ""}

        ${this._activeTab === "cam" ? l`
          <div class="placeholder-panel">
            <div class="placeholder-icon">📷</div>
            <div class="placeholder-text">Frigate / Reolink cameras<br>Connect in card config</div>
          </div>
        ` : ""}

        ${this._activeTab === "bell" ? l`
          <div class="placeholder-panel">
            <div style="width:60px;height:60px;border-radius:50%;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2);display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 10px;">🔔</div>
            <div class="placeholder-text">Doorbell · Ring history</div>
          </div>
        ` : ""}
      </div>
    `;
  }
  static getStubConfig() {
    return {
      spotify_entity: "media_player.spotify",
      tv_entity: "media_player.odin"
    };
  }
}
f(ee, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  _activeTab: { state: !0 }
}), f(ee, "styles", [T, k`
    .media-tabs {
      display: flex; gap: 2px; margin-bottom: 12px;
      background: rgba(255,255,255,0.05);
      border-radius: 10px; padding: 3px;
    }
    .tab {
      flex: 1; padding: 5px 2px; font-size: 9px; font-weight: 700;
      text-align: center; color: rgba(200,210,240,0.4);
      border-radius: 8px; cursor: pointer;
      transition: all .2s; text-transform: uppercase; letter-spacing: .04em;
    }
    .tab.active { background: rgba(255,255,255,0.12); color: #fff; }
    .tab:hover:not(.active) { color: rgba(255,255,255,0.7); }

    .album-art {
      width: 100%; aspect-ratio: 1; border-radius: 14px;
      overflow: hidden; margin-bottom: 10px;
      background: #0d1021;
      position: relative;
    }
    .album-img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .album-placeholder {
      width: 100%; height: 100%;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #1a1a2e, #533483);
      font-size: 48px;
    }

    .track-name {
      font-size: 15px; font-weight: 700; color: #fff;
      margin-bottom: 2px; white-space: nowrap;
      overflow: hidden; text-overflow: ellipsis;
    }
    .track-artist { font-size: 11px; color: var(--sd-text-secondary); margin-bottom: 8px; }

    .progress-bar {
      height: 3px; background: rgba(255,255,255,0.1);
      border-radius: 2px; margin-bottom: 4px; cursor: pointer;
      position: relative;
    }
    .progress-fill {
      height: 100%; border-radius: 2px;
      background: var(--sd-green); transition: width .5s linear;
    }
    .progress-times {
      display: flex; justify-content: space-between;
      font-size: 9px; color: var(--sd-text-muted);
      margin-bottom: 10px; font-family: var(--sd-mono);
    }

    .controls {
      display: flex; align-items: center; justify-content: space-around;
    }
    .ctrl {
      width: 32px; height: 32px; border-radius: 50%;
      background: rgba(255,255,255,0.07); border: none;
      cursor: pointer; color: rgba(255,255,255,0.5);
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; transition: all .15s;
    }
    .ctrl:hover { background: rgba(255,255,255,0.15); color: #fff; }
    .ctrl.play {
      width: 44px; height: 44px; font-size: 18px;
      background: var(--sd-green); color: #000;
    }
    .ctrl.play:hover { background: #059669; }

    .vol-row { margin-top: 10px; }
    .vol-lbl { font-size: 9px; color: var(--sd-text-muted); margin-bottom: 4px; }

    .tv-screen {
      background: rgba(0,0,0,0.4); border-radius: 10px;
      aspect-ratio: 16/9;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 10px;
      border: 1px solid rgba(255,255,255,0.06);
      font-size: 32px; opacity: 0.3;
    }
    .tv-state { font-size: 13px; color: var(--sd-text-secondary); text-align: center; }

    .placeholder-panel {
      text-align: center; padding: 30px 0;
    }
    .placeholder-icon { font-size: 36px; opacity: 0.25; margin-bottom: 8px; }
    .placeholder-text { font-size: 12px; color: var(--sd-text-muted); }
  `]);
customElements.define("media-card", ee);
class te extends $ {
  setConfig(e) {
    this.config = e;
  }
  _renderNumericTile(e) {
    var a, r;
    const t = q(this.hass, e.entity), i = ((r = (a = w(this.hass, e.entity)) == null ? void 0 : a.attributes) == null ? void 0 : r.unit_of_measurement) ?? "", s = e.max ? Math.min(100, t / e.max * 100) : null;
    return l`
      <div class="sensor-tile" style="border-top-color:${e.color ?? "var(--sd-blue)"}">
        <div class="tile-icon">${e.icon ?? "📊"}</div>
        <div class="tile-name">${e.name}</div>
        <div class="tile-val">${(t == null ? void 0 : t.toFixed(e.decimals ?? 1)) ?? "—"}
          <span style="font-size:12px;color:var(--sd-text-muted)">${i}</span>
        </div>
        ${e.sub ? l`<div class="tile-sub">${e.sub}</div>` : ""}
        ${s != null ? l`
          <div class="tile-bar">
            <div class="tile-fill" style="width:${s}%;background:${e.color ?? "var(--sd-blue)"}"></div>
          </div>` : ""}
      </div>
    `;
  }
  _renderBinarySensor(e) {
    const t = w(this.hass, e.entity), i = (t == null ? void 0 : t.state) === "on" || (t == null ? void 0 : t.state) === "open" || (t == null ? void 0 : t.state) === "detected", s = i ? e.alert_color ?? "var(--sd-red)" : e.ok_color ?? "var(--sd-blue)", a = i ? e.on_label ?? "Active" : e.off_label ?? "Clear";
    return l`
      <div class="binary-row">
        <div class="bin-dot" style="background:${s};box-shadow:0 0 5px ${s}88"></div>
        <span class="bin-name">${e.icon ?? ""} ${e.name}</span>
        <span class="bin-state" style="color:${s}">${a}</span>
      </div>
    `;
  }
  render() {
    if (!this.hass || !this.config) return l``;
    const { title: e, numeric_sensors: t = [], binary_sensors: i = [] } = this.config;
    return l`
      <div class="card">
        <div class="label">
          <span class="dot" style="background:var(--sd-cyan)"></span>
          ${e ?? "Sensor Overview"}
        </div>

        ${t.length > 0 ? l`
          <div class="sensors-grid" style="margin-bottom:${i.length ? "10px" : "0"}">
            ${t.map((s) => this._renderNumericTile(s))}
          </div>
        ` : ""}

        ${i.length > 0 ? l`
          <div class="binaries-list">
            ${i.map((s) => this._renderBinarySensor(s))}
          </div>
        ` : ""}
      </div>
    `;
  }
  static getStubConfig() {
    return {
      title: "Home Sensors",
      numeric_sensors: [
        { name: "Living Temp", entity: "sensor.temp_hum_livingroom_temperature", icon: "🌡", color: "#f59e0b", decimals: 1 },
        { name: "Humidity", entity: "sensor.temp_hum_livingroom_humidity", icon: "💧", color: "#3b82f6", max: 100 },
        { name: "Salt Level", entity: "sensor.salt_level", icon: "🧂", color: "#8b5cf6", max: 100 }
      ],
      binary_sensors: [
        { name: "Entry Door", entity: "binary_sensor.usa_intrare_contact", icon: "🚪", on_label: "Open", off_label: "Closed", alert_color: "#ef4444", ok_color: "#10b981" },
        { name: "Motion Hall", entity: "binary_sensor.motion_hol_etaj_occupancy", icon: "👁", on_label: "Detected", off_label: "Clear", alert_color: "#f59e0b" }
      ]
    };
  }
}
f(te, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}), f(te, "styles", [T, k`    .sensors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 8px;
    }
    .sensor-tile {
      background: rgba(255,255,255,0.05);
      border-radius: 12px; padding: 12px;
      border: 1px solid rgba(255,255,255,0.07);
      border-top-width: 3px;
      transition: all 0.2s;
    }
    .sensor-tile:hover { background: rgba(255,255,255,0.08); }
    .tile-icon  { font-size: 20px; margin-bottom: 6px; }
    .tile-name  { font-size: 9px; color: var(--sd-text-muted); text-transform: uppercase; letter-spacing:.06em; margin-bottom:4px; }
    .tile-val   { font-size: 22px; font-weight: 300; color: #fff; line-height:1; }
    .tile-sub   { font-size: 10px; color: var(--sd-text-secondary); margin-top: 2px; }
    .tile-bar   { margin-top: 6px; height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; }
    .tile-fill  { height: 100%; border-radius: 2px; }

    .binary-row {
      display: flex; align-items: center; gap: 6px;
      padding: 8px 10px; border-radius: 10px;
      background: rgba(255,255,255,0.04);
    }
    .bin-dot { width:8px;height:8px;border-radius:50%;flex-shrink:0; }
    .bin-name { font-size:11px;color:rgba(255,255,255,0.7);flex:1; }
    .bin-state{ font-size:11px;font-weight:700; }
    .binaries-list { display:flex;flex-direction:column;gap:5px; }
  `]);
customElements.define("sensor-overview-card", te);
class ie extends $ {
  constructor() {
    super(), this._activeFloor = 0;
  }
  setConfig(e) {
    this.config = e, this._activeFloor = 0;
  }
  getCardSize() {
    return 10;
  }
  render() {
    if (!this.hass || !this.config) return l``;
    const { floors: e = [], members: t, clock_weather: i, media: s, energy: a, sensor_overview: r } = this.config, d = e[this._activeFloor] ?? {}, c = d.rooms ?? [];
    return l`
      <div class="dashboard">

        <!-- TOP BAR -->
        <div class="topbar">
          <div class="topbar-logo">🏠 <span>${this.config.title ?? "Smart Home"}</span></div>

          ${e.map((p, m) => l`
            <div class="floor-tab ${this._activeFloor === m ? "active" : ""}"
                 @click=${() => this._activeFloor = m}>
              ${p.icon ?? "🏠"} ${p.name}
            </div>
          `)}

          <div class="status-chip">
            <div class="status-dot"></div>
            ${this.hass.connected ? "Connected" : "Offline"}
          </div>
        </div>

        <!-- MAIN CONTENT -->
        <div class="main">

          <!-- LEFT COLUMN -->
          <div class="col">
            ${i ? l`
              <clock-weather-card .hass=${this.hass} .config=${i}></clock-weather-card>
            ` : ""}
            ${t ? l`
              <members-card .hass=${this.hass} .config=${t}></members-card>
            ` : ""}
            ${d.garage ? l`
              <garage-card .hass=${this.hass} .config=${d.garage}></garage-card>
            ` : ""}
            ${r ? l`
              <sensor-overview-card .hass=${this.hass} .config=${r}></sensor-overview-card>
            ` : ""}
          </div>

          <!-- CENTER COLUMN -->
          <div class="col">
            <div class="rooms-grid">
              ${c.map((p) => l`
                <room-card .hass=${this.hass} .config=${p}></room-card>
              `)}
            </div>
            ${a ? l`
              <energy-card .hass=${this.hass} .config=${a}></energy-card>
            ` : ""}
          </div>

          <!-- RIGHT COLUMN -->
          <div class="col">
            ${s ? l`
              <media-card .hass=${this.hass} .config=${s} style="flex:1;"></media-card>
            ` : ""}
          </div>

        </div>

        <!-- BOTTOM NAV -->
        <div class="bottom-nav">
          <div class="nav-pill">
            ${e.map((p, m) => l`
              <div class="nav-btn ${this._activeFloor === m ? "active" : ""}"
                   @click=${() => this._activeFloor = m}
                   title="${p.name}">
                ${p.icon ?? "🏠"}
              </div>
            `)}
          </div>
        </div>

      </div>
    `;
  }
  static getConfigElement() {
    return document.createElement("dashboard-card-editor");
  }
  static getStubConfig() {
    return {
      title: "Smart Home",
      clock_weather: {
        location_name: "House — Floor 1",
        weather_entity: "weather.home",
        sun_entity: "sun.sun"
      },
      members: {
        members: [{ name: "Patrik", person_entity: "person.patrik" }]
      },
      floors: [{
        name: "Floor 1",
        icon: "🏠",
        rooms: [{
          name: "Living Room",
          icon: "🛋️",
          temp_sensor: "sensor.temp_hum_livingroom_temperature",
          hum_sensor: "sensor.temp_hum_livingroom_humidity",
          lights: ["light.baldachin_leds"],
          presence_sensor: "binary_sensor.presence_kitchen",
          door_sensor: "binary_sensor.geam_sufragerie_dreapta_contact",
          motion_sensor: "binary_sensor.motion_hol_etaj_occupancy"
        }],
        garage: {
          name: "Garage Door",
          cover_entity: "cover.smart_garage",
          door_sensor: "binary_sensor.garage_door_garage_door_contact"
        }
      }],
      energy: {
        power_entity: "sensor.em_home_power",
        today_entity: "sensor.em_home_energy_today",
        month_entity: "sensor.em_home_energy_month",
        devices: []
      },
      media: {
        spotify_entity: "media_player.spotify",
        tv_entity: "media_player.odin"
      }
    };
  }
}
f(ie, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  _activeFloor: { state: !0 }
}), f(ie, "styles", k`
    :host {
      --sd-bg-deep:        #0b0f1e;
      --sd-bg-card:        rgba(18,26,52,0.85);
      --sd-border:         rgba(255,255,255,0.10);
      --sd-border-glow:    rgba(255,255,255,0.20);
      --sd-text-primary:   #eef0f8;
      --sd-text-secondary: rgba(200,210,240,0.55);
      --sd-text-muted:     rgba(180,195,230,0.30);
      --sd-gold:    #f59e0b;
      --sd-green:   #10b981;
      --sd-blue:    #3b82f6;
      --sd-cyan:    #06b6d4;
      --sd-red:     #ef4444;
      --sd-purple:  #8b5cf6;
      --sd-radius:    18px;
      --sd-radius-sm: 12px;
      --sd-blur:      blur(20px);
      --sd-font:      'Outfit', system-ui, sans-serif;
      --sd-mono:      'JetBrains Mono', monospace;
      --sd-transition: 0.2s ease;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    :host {
      display: block;
      font-family: var(--sd-font);
      color: var(--sd-text-primary);
      height: 100vh;
      overflow: hidden;
      position: relative;
    }

    /* Ambient background */
    :host::before {
      content: '';
      position: absolute; inset: 0;
      background:
        radial-gradient(ellipse 60% 80% at 85% 50%, rgba(200,110,20,0.35) 0%, transparent 60%),
        radial-gradient(ellipse 40% 50% at 10% 20%, rgba(30,50,120,0.28) 0%, transparent 60%);
      pointer-events: none; z-index: 0;
    }

    .dashboard {
      position: relative; z-index: 1;
      display: grid;
      grid-template-rows: 48px 1fr 58px;
      height: 100vh;
    }

    /* TOP BAR */
    .topbar {
      display: flex; align-items: center; gap: 10px;
      padding: 0 20px;
      background: rgba(10,14,28,0.75);
      border-bottom: 1px solid var(--sd-border);
      backdrop-filter: var(--sd-blur);
    }
    .topbar-logo { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; margin-right: 12px; }
    .floor-tab {
      display: flex; align-items: center; gap: 5px;
      padding: 4px 14px; border-radius: 20px; cursor: pointer;
      font-size: 11px; font-weight: 600; color: var(--sd-text-secondary);
      border: 1px solid transparent; transition: all .2s; user-select: none;
    }
    .floor-tab.active { background: rgba(255,255,255,0.1); color: #fff; border-color: var(--sd-border-glow); }
    .floor-tab:hover:not(.active) { color: rgba(255,255,255,0.7); }
    .status-chip {
      margin-left: auto; display: flex; align-items: center; gap: 5px;
      padding: 3px 10px; border-radius: 12px;
      background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.25);
      font-size: 10px; font-weight: 700; color: var(--sd-green);
    }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--sd-green); animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }

    /* MAIN GRID */
    .main {
      display: grid;
      grid-template-columns: 300px 1fr 340px;
      gap: 12px; padding: 12px;
      overflow: hidden; min-height: 0;
    }
    .col { display: flex; flex-direction: column; gap: 10px; min-height: 0; overflow-y: auto; }
    .col::-webkit-scrollbar { width: 0; }

    /* Rooms grid */
    .rooms-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }

    /* BOTTOM NAV */
    .bottom-nav {
      display: flex; align-items: center; justify-content: center;
      padding: 8px; background: rgba(10,14,28,0.7);
      border-top: 1px solid var(--sd-border);
      backdrop-filter: var(--sd-blur);
    }
    .nav-pill {
      display: flex; gap: 4px;
      background: rgba(18,26,52,0.85);
      border: 1px solid var(--sd-border);
      border-radius: 30px; padding: 6px 12px;
    }
    .nav-btn {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all .2s; font-size: 16px;
      color: var(--sd-text-muted);
    }
    .nav-btn:hover { color: rgba(255,255,255,0.8); }
    .nav-btn.active { background: rgba(245,158,11,0.2); color: var(--sd-gold); }

    /* Responsive */
    @media (max-width: 1200px) {
      .main { grid-template-columns: 280px 1fr 300px; }
    }
    @media (max-width: 900px) {
      .main { grid-template-columns: 1fr; grid-template-rows: auto; overflow-y: auto; }
      .rooms-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      .topbar .floor-tab { display: none; }
      .main { padding: 8px; gap: 8px; }
      .rooms-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `);
customElements.define("smarthome-dashboard-card", ie);
class de extends $ {
  constructor() {
    super(), this._activeSection = "general", this._activeFloor = 0, this._activeRoom = 0;
  }
  setConfig(e) {
    this.config = e;
  }
  _fire(e) {
    this.dispatchEvent(new CustomEvent("config-changed", {
      bubbles: !0,
      composed: !0,
      detail: { config: e }
    }));
  }
  _set(e, t) {
    const i = e.split("."), s = JSON.parse(JSON.stringify(this.config));
    let a = s;
    for (let d = 0; d < i.length - 1; d++) {
      const c = isNaN(i[d]) ? i[d] : parseInt(i[d]);
      a = a[c];
    }
    const r = isNaN(i[i.length - 1]) ? i[i.length - 1] : parseInt(i[i.length - 1]);
    a[r] = t, this._fire(s);
  }
  _addFloor() {
    const e = [...this.config.floors ?? [], { name: "New Floor", icon: "🏠", rooms: [] }];
    this._fire({ ...this.config, floors: e }), this._activeFloor = e.length - 1;
  }
  _addRoom() {
    const e = JSON.parse(JSON.stringify(this.config.floors ?? []));
    e[this._activeFloor] && (e[this._activeFloor].rooms = [
      ...e[this._activeFloor].rooms ?? [],
      { name: "New Room", icon: "🏠", lights: [] }
    ], this._fire({ ...this.config, floors: e }), this._activeRoom = e[this._activeFloor].rooms.length - 1);
  }
  _removeRoom(e) {
    const t = JSON.parse(JSON.stringify(this.config.floors ?? []));
    t[this._activeFloor].rooms.splice(e, 1), this._fire({ ...this.config, floors: t }), this._activeRoom = Math.max(0, this._activeRoom - 1);
  }
  render() {
    var a, r, d, c, p, m, g, x, b, v, S, F, W, ue, ve, fe, be, ye, xe, _e;
    if (!this.hass || !this.config) return l``;
    const e = this.config.floors ?? [], t = e[this._activeFloor] ?? {}, i = t.rooms ?? [], s = i[this._activeRoom] ?? {};
    return l`
      <div class="editor">

        <!-- Section navigation -->
        <div class="section-tabs">
          ${[
      ["general", "🏠 General"],
      ["floors", "🗺️ Floors & Rooms"],
      ["climate", "🌡️ Climate"],
      ["energy", "⚡ Energy"],
      ["media", "🎵 Media"],
      ["sensors", "📡 Sensors"]
    ].map(([n, h]) => l`
            <div class="stab ${this._activeSection === n ? "active" : ""}"
                 @click=${() => this._activeSection = n}>
              ${h}
            </div>
          `)}
        </div>

        <div class="section-body">

          <!-- ═══ GENERAL ═══ -->
          ${this._activeSection === "general" ? l`
            <ha-textfield
              label="Dashboard title"
              .value=${this.config.title ?? "Smart Home"}
              @change=${(n) => this._fire({ ...this.config, title: n.target.value })}>
            </ha-textfield>

            <div class="group-title">Clock & Weather</div>
            <ha-entity-picker
              label="Weather entity"
              .hass=${this.hass}
              .value=${((a = this.config.clock_weather) == null ? void 0 : a.weather_entity) ?? ""}
              .includeDomains=${["weather"]}
              @value-changed=${(n) => this._set("clock_weather.weather_entity", n.detail.value)}>
            </ha-entity-picker>
            <ha-entity-picker
              label="Sun entity"
              .hass=${this.hass}
              .value=${((r = this.config.clock_weather) == null ? void 0 : r.sun_entity) ?? ""}
              .includeDomains=${["sun"]}
              @value-changed=${(n) => this._set("clock_weather.sun_entity", n.detail.value)}>
            </ha-entity-picker>
            <ha-textfield
              label="Location name"
              .value=${((d = this.config.clock_weather) == null ? void 0 : d.location_name) ?? ""}
              @change=${(n) => this._set("clock_weather.location_name", n.target.value)}>
            </ha-textfield>

            <div class="group-title">Household Members</div>
            <div class="info-box">Add person entities to show home/away status with avatars.</div>
            ${(((c = this.config.members) == null ? void 0 : c.members) ?? []).map((n, h) => l`
              <div class="field-row">
                <ha-textfield
                  label="Name"
                  .value=${n.name ?? ""}
                  @change=${(u) => this._set("members.members." + h + ".name", u.target.value)}>
                </ha-textfield>
                <ha-entity-picker
                  label="Person entity"
                  .hass=${this.hass}
                  .value=${n.person_entity ?? ""}
                  .includeDomains=${["person"]}
                  @value-changed=${(u) => this._set("members.members." + h + ".person_entity", u.detail.value)}>
                </ha-entity-picker>
              </div>
            `)}
            <mwc-button outlined
              @click=${() => {
      var h;
      const n = [...((h = this.config.members) == null ? void 0 : h.members) ?? [], { name: "", person_entity: "" }];
      this._fire({ ...this.config, members: { ...this.config.members, members: n } });
    }}>
              + Add member
            </mwc-button>
          ` : ""}

          <!-- ═══ FLOORS & ROOMS ═══ -->
          ${this._activeSection === "floors" ? l`

            <!-- Floor selector -->
            <div class="group-title">Floors</div>
            <div class="floor-selector">
              ${e.map((n, h) => l`
                <div class="floor-chip ${this._activeFloor === h ? "active" : ""}"
                     @click=${() => {
      this._activeFloor = h, this._activeRoom = 0;
    }}>
                  ${n.icon ?? "🏠"} ${n.name}
                </div>
              `)}
              <div class="floor-chip add" @click=${this._addFloor}>+ Add floor</div>
            </div>

            ${e[this._activeFloor] ? l`
              <div class="field-row">
                <ha-textfield
                  label="Floor name"
                  .value=${t.name ?? ""}
                  @change=${(n) => this._set("floors." + this._activeFloor + ".name", n.target.value)}>
                </ha-textfield>
                <ha-textfield
                  label="Floor icon (emoji)"
                  .value=${t.icon ?? ""}
                  @change=${(n) => this._set("floors." + this._activeFloor + ".icon", n.target.value)}>
                </ha-textfield>
              </div>

              <!-- Rooms list -->
              <div class="group-title">Rooms on this floor</div>
              <div class="room-list">
                ${i.map((n, h) => {
      var u;
      return l`
                  <div class="room-row ${this._activeRoom === h ? "active" : ""}"
                       @click=${() => this._activeRoom = h}>
                    <span class="room-row-icon">${n.icon ?? "🏠"}</span>
                    <span class="room-row-name">${n.name ?? "Room " + (h + 1)}</span>
                    <span class="room-row-sensors">
                      ${n.temp_sensor ? "🌡" : ""}
                      ${n.presence_sensor ? "🧍" : ""}
                      ${n.door_sensor ? "🚪" : ""}
                      ${n.motion_sensor ? "👁" : ""}
                      ${(((u = n.lights) == null ? void 0 : u.length) ?? 0) > 0 ? "💡" + n.lights.length : ""}
                    </span>
                    <ha-icon-button
                      .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                      @click=${(Ie) => {
        Ie.stopPropagation(), this._removeRoom(h);
      }}>
                    </ha-icon-button>
                  </div>
                `;
    })}
              </div>
              <mwc-button outlined @click=${this._addRoom}>+ Add room</mwc-button>

              ${i[this._activeRoom] ? l`
                <div class="group-title">Edit: ${s.name ?? "Room"}</div>
                <div class="field-row">
                  <ha-textfield
                    label="Room name"
                    .value=${s.name ?? ""}
                    @change=${(n) => this._set("floors." + this._activeFloor + ".rooms." + this._activeRoom + ".name", n.target.value)}>
                  </ha-textfield>
                  <ha-textfield
                    label="Icon (emoji)"
                    .value=${s.icon ?? ""}
                    @change=${(n) => this._set("floors." + this._activeFloor + ".rooms." + this._activeRoom + ".icon", n.target.value)}>
                  </ha-textfield>
                </div>
              ` : ""}

            ` : ""}
          ` : ""}

          <!-- ═══ CLIMATE ═══ -->
          ${this._activeSection === "climate" ? l`
            <div class="info-box">Select the active floor and room to configure climate sensors.</div>

            <div class="floor-selector">
              ${e.map((n, h) => l`
                <div class="floor-chip ${this._activeFloor === h ? "active" : ""}"
                     @click=${() => {
      this._activeFloor = h, this._activeRoom = 0;
    }}>
                  ${n.icon} ${n.name}
                </div>
              `)}
            </div>

            ${i.length > 0 ? l`
              <div class="floor-selector">
                ${i.map((n, h) => l`
                  <div class="floor-chip ${this._activeRoom === h ? "active" : ""}"
                       @click=${() => this._activeRoom = h}>
                    ${n.icon} ${n.name}
                  </div>
                `)}
              </div>

              ${i[this._activeRoom] ? l`
                <div class="group-title">${s.name} — Climate</div>
                <ha-entity-picker
                  label="Temperature sensor"
                  .hass=${this.hass}
                  .value=${s.temp_sensor ?? ""}
                  .includeDomains=${["sensor"]}
                  allow-custom-entity
                  @value-changed=${(n) => this._set("floors." + this._activeFloor + ".rooms." + this._activeRoom + ".temp_sensor", n.detail.value)}>
                </ha-entity-picker>
                <ha-entity-picker
                  label="Humidity sensor"
                  .hass=${this.hass}
                  .value=${s.hum_sensor ?? ""}
                  .includeDomains=${["sensor"]}
                  allow-custom-entity
                  @value-changed=${(n) => this._set("floors." + this._activeFloor + ".rooms." + this._activeRoom + ".hum_sensor", n.detail.value)}>
                </ha-entity-picker>
                <ha-entity-picker
                  label="Climate / Thermostat entity (optional)"
                  .hass=${this.hass}
                  .value=${s.climate_entity ?? ""}
                  .includeDomains=${["climate"]}
                  allow-custom-entity
                  @value-changed=${(n) => this._set("floors." + this._activeFloor + ".rooms." + this._activeRoom + ".climate_entity", n.detail.value)}>
                </ha-entity-picker>

                <div class="group-title">${s.name} — Lights</div>
                ${(s.lights ?? []).map((n, h) => l`
                  <ha-entity-picker
                    label=${"Light " + (h + 1)}
                    .hass=${this.hass}
                    .value=${n}
                    .includeDomains=${["light", "switch"]}
                    allow-custom-entity
                    @value-changed=${(u) => this._set("floors." + this._activeFloor + ".rooms." + this._activeRoom + ".lights." + h, u.detail.value)}>
                  </ha-entity-picker>
                `)}
                <mwc-button outlined @click=${() => {
      const n = [...s.lights ?? [], ""];
      this._set("floors." + this._activeFloor + ".rooms." + this._activeRoom + ".lights", n);
    }}>+ Add light</mwc-button>

                <div class="group-title">${s.name} — Sensors</div>
                <ha-entity-picker
                  label="Presence sensor"
                  .hass=${this.hass}
                  .value=${s.presence_sensor ?? ""}
                  .includeDomains=${["binary_sensor"]}
                  allow-custom-entity
                  @value-changed=${(n) => this._set("floors." + this._activeFloor + ".rooms." + this._activeRoom + ".presence_sensor", n.detail.value)}>
                </ha-entity-picker>
                <ha-entity-picker
                  label="Door / Window contact"
                  .hass=${this.hass}
                  .value=${s.door_sensor ?? ""}
                  .includeDomains=${["binary_sensor"]}
                  allow-custom-entity
                  @value-changed=${(n) => this._set("floors." + this._activeFloor + ".rooms." + this._activeRoom + ".door_sensor", n.detail.value)}>
                </ha-entity-picker>
                <ha-entity-picker
                  label="Motion sensor"
                  .hass=${this.hass}
                  .value=${s.motion_sensor ?? ""}
                  .includeDomains=${["binary_sensor"]}
                  allow-custom-entity
                  @value-changed=${(n) => this._set("floors." + this._activeFloor + ".rooms." + this._activeRoom + ".motion_sensor", n.detail.value)}>
                </ha-entity-picker>
              ` : ""}
            ` : l`<div class="info-box">Add rooms in the Floors & Rooms tab first.</div>`}
          ` : ""}

          <!-- ═══ ENERGY ═══ -->
          ${this._activeSection === "energy" ? l`
            <ha-entity-picker
              label="Main power sensor (W or kW)"
              .hass=${this.hass}
              .value=${((p = this.config.energy) == null ? void 0 : p.power_entity) ?? ""}
              .includeDomains=${["sensor"]}
              allow-custom-entity
              @value-changed=${(n) => this._set("energy.power_entity", n.detail.value)}>
            </ha-entity-picker>
            <ha-entity-picker
              label="Today energy (kWh)"
              .hass=${this.hass}
              .value=${((m = this.config.energy) == null ? void 0 : m.today_entity) ?? ""}
              .includeDomains=${["sensor"]}
              allow-custom-entity
              @value-changed=${(n) => this._set("energy.today_entity", n.detail.value)}>
            </ha-entity-picker>
            <ha-entity-picker
              label="Month energy (kWh)"
              .hass=${this.hass}
              .value=${((g = this.config.energy) == null ? void 0 : g.month_entity) ?? ""}
              .includeDomains=${["sensor"]}
              allow-custom-entity
              @value-changed=${(n) => this._set("energy.month_entity", n.detail.value)}>
            </ha-entity-picker>

            <div class="group-title">Device Monitors</div>
            ${(((x = this.config.energy) == null ? void 0 : x.devices) ?? []).map((n, h) => l`
              <div class="field-row">
                <ha-textfield label="Name" .value=${n.name ?? ""} @change=${(u) => this._set("energy.devices." + h + ".name", u.target.value)}></ha-textfield>
                <ha-entity-picker label="Power sensor" .hass=${this.hass} .value=${n.entity ?? ""} .includeDomains=${["sensor"]} allow-custom-entity @value-changed=${(u) => this._set("energy.devices." + h + ".entity", u.detail.value)}></ha-entity-picker>
              </div>
            `)}
            <mwc-button outlined @click=${() => {
      var h;
      const n = [...((h = this.config.energy) == null ? void 0 : h.devices) ?? [], { name: "", icon: "🔌", entity: "" }];
      this._set("energy.devices", n);
    }}>+ Add device</mwc-button>

            <div class="group-title">Salt Level Sensor</div>
            <ha-entity-picker
              label="Salt level entity (%)"
              .hass=${this.hass}
              .value=${((b = this.config.energy) == null ? void 0 : b.salt_entity) ?? ""}
              .includeDomains=${["sensor"]}
              allow-custom-entity
              @value-changed=${(n) => this._set("energy.salt_entity", n.detail.value)}>
            </ha-entity-picker>
          ` : ""}

          <!-- ═══ MEDIA ═══ -->
          ${this._activeSection === "media" ? l`
            <ha-entity-picker
              label="Spotify / Music player entity"
              .hass=${this.hass}
              .value=${((v = this.config.media) == null ? void 0 : v.spotify_entity) ?? ""}
              .includeDomains=${["media_player"]}
              allow-custom-entity
              @value-changed=${(n) => this._set("media.spotify_entity", n.detail.value)}>
            </ha-entity-picker>
            <ha-entity-picker
              label="TV entity (media_player.odin)"
              .hass=${this.hass}
              .value=${((S = this.config.media) == null ? void 0 : S.tv_entity) ?? ""}
              .includeDomains=${["media_player"]}
              allow-custom-entity
              @value-changed=${(n) => this._set("media.tv_entity", n.detail.value)}>
            </ha-entity-picker>

            <div class="group-title">Cameras (Frigate / Reolink)</div>
            ${(((F = this.config.media) == null ? void 0 : F.cameras) ?? []).map((n, h) => l`
              <div class="field-row">
                <ha-textfield label="Camera name" .value=${n.name ?? ""} @change=${(u) => this._set("media.cameras." + h + ".name", u.target.value)}></ha-textfield>
                <ha-entity-picker label="Camera entity" .hass=${this.hass} .value=${n.entity ?? ""} .includeDomains=${["camera"]} allow-custom-entity @value-changed=${(u) => this._set("media.cameras." + h + ".entity", u.detail.value)}></ha-entity-picker>
              </div>
            `)}
            <mwc-button outlined @click=${() => {
      var h;
      const n = [...((h = this.config.media) == null ? void 0 : h.cameras) ?? [], { name: "", entity: "" }];
      this._set("media.cameras", n);
    }}>+ Add camera</mwc-button>
          ` : ""}

          <!-- ═══ SENSORS ═══ -->
          ${this._activeSection === "sensors" ? l`
            <div class="info-box">Configure the sensor overview card shown in the left column.</div>

            <div class="group-title">Numeric Sensors</div>
            ${(((W = this.config.sensor_overview) == null ? void 0 : W.numeric_sensors) ?? []).map((n, h) => l`
              <div class="field-row">
                <ha-textfield label="Name" .value=${n.name ?? ""} @change=${(u) => this._set("sensor_overview.numeric_sensors." + h + ".name", u.target.value)}></ha-textfield>
                <ha-entity-picker label="Sensor entity" .hass=${this.hass} .value=${n.entity ?? ""} .includeDomains=${["sensor"]} allow-custom-entity @value-changed=${(u) => this._set("sensor_overview.numeric_sensors." + h + ".entity", u.detail.value)}></ha-entity-picker>
              </div>
            `)}
            <mwc-button outlined @click=${() => {
      var h;
      const n = [...((h = this.config.sensor_overview) == null ? void 0 : h.numeric_sensors) ?? [], { name: "", icon: "📊", entity: "", color: "#3b82f6" }];
      this._set("sensor_overview.numeric_sensors", n);
    }}>+ Add numeric sensor</mwc-button>

            <div class="group-title">Binary Sensors (Door/Motion/etc.)</div>
            ${(((ue = this.config.sensor_overview) == null ? void 0 : ue.binary_sensors) ?? []).map((n, h) => l`
              <div class="field-row">
                <ha-textfield label="Name" .value=${n.name ?? ""} @change=${(u) => this._set("sensor_overview.binary_sensors." + h + ".name", u.target.value)}></ha-textfield>
                <ha-entity-picker label="Binary sensor" .hass=${this.hass} .value=${n.entity ?? ""} .includeDomains=${["binary_sensor"]} allow-custom-entity @value-changed=${(u) => this._set("sensor_overview.binary_sensors." + h + ".entity", u.detail.value)}></ha-entity-picker>
              </div>
            `)}
            <mwc-button outlined @click=${() => {
      var h;
      const n = [...((h = this.config.sensor_overview) == null ? void 0 : h.binary_sensors) ?? [], { name: "", icon: "🚪", entity: "", on_label: "Active", off_label: "Clear", alert_color: "#ef4444", ok_color: "#10b981" }];
      this._set("sensor_overview.binary_sensors", n);
    }}>+ Add binary sensor</mwc-button>

            <div class="group-title">Garage Door</div>
            <ha-entity-picker
              label="Garage cover entity"
              .hass=${this.hass}
              .value=${((be = (fe = (ve = this.config.floors) == null ? void 0 : ve[0]) == null ? void 0 : fe.garage) == null ? void 0 : be.cover_entity) ?? ""}
              .includeDomains=${["cover"]}
              allow-custom-entity
              @value-changed=${(n) => this._set("floors.0.garage.cover_entity", n.detail.value)}>
            </ha-entity-picker>
            <ha-entity-picker
              label="Garage door contact sensor"
              .hass=${this.hass}
              .value=${((_e = (xe = (ye = this.config.floors) == null ? void 0 : ye[0]) == null ? void 0 : xe.garage) == null ? void 0 : _e.door_sensor) ?? ""}
              .includeDomains=${["binary_sensor"]}
              allow-custom-entity
              @value-changed=${(n) => this._set("floors.0.garage.door_sensor", n.detail.value)}>
            </ha-entity-picker>
          ` : ""}

        </div><!-- /section-body -->
      </div>
    `;
  }
}
f(de, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 },
  _activeSection: { state: !0 },
  _activeFloor: { state: !0 },
  _activeRoom: { state: !0 }
}), f(de, "styles", k`
    :host { display: block; }

    .editor {
      font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
    }

    /* Section tabs */
    .section-tabs {
      display: flex; gap: 0;
      border-bottom: 1px solid var(--divider-color);
      margin-bottom: 0;
      overflow-x: auto;
    }
    .stab {
      padding: 10px 14px; font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: .07em;
      color: var(--secondary-text-color); cursor: pointer;
      border-bottom: 2px solid transparent; white-space: nowrap;
      transition: all .2s;
    }
    .stab.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
    .stab:hover:not(.active) { color: var(--primary-text-color); }

    .section-body { padding: 16px; }

    .field-group { margin-bottom: 16px; }
    .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
    .field-row.single { grid-template-columns: 1fr; }

    ha-entity-picker, ha-textfield, ha-icon-picker { width: 100%; display: block; margin-bottom: 10px; }

    .group-title {
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .08em; color: var(--secondary-text-color);
      margin: 16px 0 8px; padding-bottom: 4px;
      border-bottom: 1px solid var(--divider-color);
    }

    /* Floor / Room selectors */
    .floor-selector { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
    .floor-chip {
      padding: 4px 12px; border-radius: 16px; cursor: pointer;
      font-size: 11px; font-weight: 600;
      border: 1px solid var(--divider-color);
      background: transparent; color: var(--secondary-text-color);
      transition: all .15s;
    }
    .floor-chip.active { background: var(--primary-color); color: #fff; border-color: var(--primary-color); }
    .floor-chip.add { border-style: dashed; }
    .floor-chip.add:hover { background: rgba(var(--primary-color-rgb), 0.1); }

    /* Room list */
    .room-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
    .room-row {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 10px; border-radius: 8px;
      border: 1px solid var(--divider-color);
      cursor: pointer; transition: all .15s;
    }
    .room-row:hover { background: rgba(var(--primary-color-rgb), 0.05); }
    .room-row.active { border-color: var(--primary-color); background: rgba(var(--primary-color-rgb), 0.08); }
    .room-row-icon { font-size: 18px; }
    .room-row-name { flex: 1; font-size: 13px; }
    .room-row-sensors { font-size: 10px; color: var(--secondary-text-color); }

    mwc-button { display: block; margin-top: 8px; }

    .info-box {
      padding: 10px 12px; border-radius: 8px; margin-bottom: 12px;
      background: rgba(var(--info-color-rgb, 33,150,243), 0.1);
      border: 1px solid rgba(var(--info-color-rgb, 33,150,243), 0.25);
      font-size: 12px; color: var(--primary-text-color);
      line-height: 1.5;
    }
  `);
customElements.define("dashboard-card-editor", de);
class he extends $ {
  setConfig(e) {
    this.config = e;
  }
  _changed(e, t) {
    this.dispatchEvent(new CustomEvent("config-changed", {
      bubbles: !0,
      composed: !0,
      detail: { config: { ...this.config, [e]: t } }
    }));
  }
  _addLight() {
    this._changed("lights", [...this.config.lights ?? [], ""]);
  }
  _removeLight(e) {
    const t = [...this.config.lights ?? []];
    t.splice(e, 1), this._changed("lights", t);
  }
  _updateLight(e, t) {
    const i = [...this.config.lights ?? []];
    i[e] = t, this._changed("lights", i);
  }
  render() {
    return !this.hass || !this.config ? l`` : l`
      <div class="editor">

        <!-- ── BASIC INFO ── -->
        <div class="section-title">Basic Info</div>

        <div class="row">
          <ha-textfield
            label="Room name"
            .value=${this.config.name ?? ""}
            @change=${(e) => this._changed("name", e.target.value)}>
          </ha-textfield>
          <ha-textfield
            label="Icon (emoji)"
            .value=${this.config.icon ?? ""}
            @change=${(e) => this._changed("icon", e.target.value)}
            style="max-width:90px">
          </ha-textfield>
        </div>

        <!-- ── CLIMATE ── -->
        <div class="section-title">Climate Sensors</div>

        <ha-entity-picker
          label="Temperature sensor"
          .hass=${this.hass}
          .value=${this.config.temp_sensor ?? ""}
          .includeDomains=${["sensor"]}
          allow-custom-entity
          @value-changed=${(e) => this._changed("temp_sensor", e.detail.value)}>
        </ha-entity-picker>

        <ha-entity-picker
          label="Humidity sensor"
          .hass=${this.hass}
          .value=${this.config.hum_sensor ?? ""}
          .includeDomains=${["sensor"]}
          allow-custom-entity
          @value-changed=${(e) => this._changed("hum_sensor", e.detail.value)}>
        </ha-entity-picker>

        <!-- ── LIGHTS ── -->
        <div class="section-title">Lights</div>

        <div class="lights-list">
          ${(this.config.lights ?? []).map((e, t) => l`
            <div class="light-row">
              <ha-entity-picker
                label="Light ${t + 1}"
                .hass=${this.hass}
                .value=${e}
                .includeDomains=${["light", "switch"]}
                allow-custom-entity
                @value-changed=${(i) => this._updateLight(t, i.detail.value)}>
              </ha-entity-picker>
              <ha-icon-button
                class="remove-btn"
                .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                @click=${() => this._removeLight(t)}>
              </ha-icon-button>
            </div>
          `)}
          <mwc-button class="add-btn" outlined
            @click=${this._addLight}
            label="+ Add light">
          </mwc-button>
        </div>

        <!-- ── PRESENCE & SECURITY ── -->
        <div class="section-title">Presence & Security Sensors</div>

        <ha-entity-picker
          label="Presence sensor"
          .hass=${this.hass}
          .value=${this.config.presence_sensor ?? ""}
          .includeDomains=${["binary_sensor"]}
          allow-custom-entity
          @value-changed=${(e) => this._changed("presence_sensor", e.detail.value)}>
        </ha-entity-picker>

        <ha-entity-picker
          label="Door / Window contact sensor"
          .hass=${this.hass}
          .value=${this.config.door_sensor ?? ""}
          .includeDomains=${["binary_sensor"]}
          allow-custom-entity
          @value-changed=${(e) => this._changed("door_sensor", e.detail.value)}>
        </ha-entity-picker>

        <ha-entity-picker
          label="Motion sensor"
          .hass=${this.hass}
          .value=${this.config.motion_sensor ?? ""}
          .includeDomains=${["binary_sensor"]}
          allow-custom-entity
          @value-changed=${(e) => this._changed("motion_sensor", e.detail.value)}>
        </ha-entity-picker>

        <!-- ── THERMOSTAT ── -->
        <div class="section-title">Thermostat / HVAC (optional)</div>

        <ha-entity-picker
          label="Climate / thermostat entity"
          .hass=${this.hass}
          .value=${this.config.climate_entity ?? ""}
          .includeDomains=${["climate"]}
          allow-custom-entity
          @value-changed=${(e) => this._changed("climate_entity", e.detail.value)}>
        </ha-entity-picker>

      </div>
    `;
  }
}
f(he, "properties", {
  hass: { attribute: !1 },
  config: { attribute: !1 }
}), f(he, "styles", k`
    :host {
      display: block;
      font-family: var(--paper-font-body1_-_font-family, sans-serif);
    }
    .editor {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--secondary-text-color);
      margin-bottom: -6px;
      padding-bottom: 4px;
      border-bottom: 1px solid var(--divider-color);
    }
    .row {
      display: flex;
      gap: 8px;
      align-items: flex-start;
    }
    .row > * { flex: 1; }
    ha-entity-picker,
    ha-icon-picker,
    ha-selector,
    ha-textfield {
      width: 100%;
    }
    .lights-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .light-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .light-row ha-entity-picker { flex: 1; }
    .remove-btn {
      --mdc-icon-button-size: 36px;
      color: var(--error-color);
    }
    .add-btn {
      width: 100%;
      margin-top: 4px;
    }
  `);
customElements.define("room-card-editor", he);
window.customCards = window.customCards ?? [];
const je = [
  { type: "smarthome-dashboard-card", cls: ie, name: "Smart Home Dashboard", description: "Full smart home dashboard — rooms, energy, media, sensors, garage", preview: !0 },
  { type: "room-card", cls: Z, name: "Room Card", description: "Per-room climate, lights, presence, door and motion sensors", preview: !0 },
  { type: "clock-weather-card", cls: K, name: "Clock & Weather Card", description: "Live clock, weather and forecast", preview: !0 },
  { type: "members-card", cls: Y, name: "Household Members Card", description: "Person entities with home/away presence", preview: !0 },
  { type: "energy-card", cls: X, name: "Energy Card", description: "Real-time power consumption with history and device breakdown", preview: !0 },
  { type: "garage-card", cls: Q, name: "Garage Door Card", description: "Animated garage door with HA cover entity control", preview: !0 },
  { type: "media-card", cls: ee, name: "Media Card", description: "Spotify, TV, cameras and doorbell in one panel", preview: !0 },
  { type: "sensor-overview-card", cls: te, name: "Sensor Overview Card", description: "Flexible numeric and binary sensor display", preview: !0 }
];
je.forEach(({ type: o, name: e, description: t, preview: i }) => {
  window.customCards.find((s) => s.type === o) || window.customCards.push({ type: o, name: e, description: t, preview: i });
});
console.groupCollapsed("%c🏠 Smart Home Dashboard Card", "color:#f59e0b;font-weight:bold;font-size:14px;");
console.log("Version: 1.0.0");
console.log("Cards:", je.map((o) => o.type).join(", "));
console.groupEnd();