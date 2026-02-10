import { r as reactExports, g as getDefaultExportFromCjs } from "./vendor-react-Df__x13C.js";
import { w as withPath, k as constant, s as svgPropertiesAndEvents, l as isNumber, d as clsx, m as upperFirst, n as createSelector, p as pickAxisType, o as pickAxisId, q as itemAxisPredicate, t as selectBaseAxis, v as combineGraphicalItemsSettings, x as combineGraphicalItemsData, y as selectChartDataAndAlwaysIgnoreIndexes, z as combineDisplayedData, A as combineAppliedValues, B as getValueByDataKey, E as selectAllErrorBarSettings, F as combineDomainOfAllAppliedNumericalValuesIncludingErrorValues, G as selectDomainDefinition, H as selectDomainFromUserPreference, I as selectChartLayout, J as combineNumericalDomain, K as selectStackOffsetType, M as combineAxisDomain, N as selectRealScaleType, O as combineNiceTicks, P as combineAxisDomainWithNiceTicks, Q as getTooltipNameProp, S as selectChartOffsetInternal, r as resolveDefaultProps, U as useAnimationId, V as getTransitionVal, W as JavascriptAnimate, X as interpolate, Y as roundTemplateLiteral, L as Layer, _ as Curve, $ as Sector, a0 as Rectangle, u as useAppDispatch, a1 as setActiveMouseOverItemIndex, a2 as mouseLeaveItem, a3 as setActiveClickItemIndex, a4 as svgPropertiesNoEvents, a5 as RegisterGraphicalItemId, a6 as SetPolarGraphicalItem, D as DefaultZIndexes, a7 as findAllByType, g as useAppSelector, a8 as SetPolarLegendPayload, Z as ZIndexLayer, a9 as SetTooltipEntrySettings, aa as get, ab as mathSign, ac as polarToCartesian, ad as PolarLabelListContextProvider, ae as selectActiveTooltipIndex, af as selectActiveTooltipDataKey, ag as selectActiveTooltipGraphicalItemId, ah as DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME, ai as DATA_ITEM_INDEX_ATTRIBUTE_NAME, aj as adaptEventsOfChild, ak as LabelListFromLabelProp, al as getMaxRadius, am as getPercentValue, an as svgPropertiesNoEventsFromUnknown, ao as Text, ap as updatePolarOptions, aq as RechartsStoreProvider, ar as ChartDataContextProvider, as as ReportMainChartProps, at as ReportChartProps, au as CategoricalChart, av as arrayTooltipSearcher } from "./CategoricalChart-BNQNLo93.js";
const cos = Math.cos;
const sin = Math.sin;
const sqrt = Math.sqrt;
const pi = Math.PI;
const tau = 2 * pi;
const symbolCircle = {
  draw(context, size) {
    const r = sqrt(size / pi);
    context.moveTo(r, 0);
    context.arc(0, 0, r, 0, tau);
  }
};
const symbolCross = {
  draw(context, size) {
    const r = sqrt(size / 5) / 2;
    context.moveTo(-3 * r, -r);
    context.lineTo(-r, -r);
    context.lineTo(-r, -3 * r);
    context.lineTo(r, -3 * r);
    context.lineTo(r, -r);
    context.lineTo(3 * r, -r);
    context.lineTo(3 * r, r);
    context.lineTo(r, r);
    context.lineTo(r, 3 * r);
    context.lineTo(-r, 3 * r);
    context.lineTo(-r, r);
    context.lineTo(-3 * r, r);
    context.closePath();
  }
};
const tan30 = sqrt(1 / 3);
const tan30_2 = tan30 * 2;
const symbolDiamond = {
  draw(context, size) {
    const y = sqrt(size / tan30_2);
    const x = y * tan30;
    context.moveTo(0, -y);
    context.lineTo(x, 0);
    context.lineTo(0, y);
    context.lineTo(-x, 0);
    context.closePath();
  }
};
const symbolSquare = {
  draw(context, size) {
    const w = sqrt(size);
    const x = -w / 2;
    context.rect(x, x, w, w);
  }
};
const ka = 0.8908130915292852;
const kr = sin(pi / 10) / sin(7 * pi / 10);
const kx = sin(tau / 10) * kr;
const ky = -cos(tau / 10) * kr;
const symbolStar = {
  draw(context, size) {
    const r = sqrt(size * ka);
    const x = kx * r;
    const y = ky * r;
    context.moveTo(0, -r);
    context.lineTo(x, y);
    for (let i = 1; i < 5; ++i) {
      const a2 = tau * i / 5;
      const c2 = cos(a2);
      const s2 = sin(a2);
      context.lineTo(s2 * r, -c2 * r);
      context.lineTo(c2 * x - s2 * y, s2 * x + c2 * y);
    }
    context.closePath();
  }
};
const sqrt3 = sqrt(3);
const symbolTriangle = {
  draw(context, size) {
    const y = -sqrt(size / (sqrt3 * 3));
    context.moveTo(0, y * 2);
    context.lineTo(-sqrt3 * y, -y);
    context.lineTo(sqrt3 * y, -y);
    context.closePath();
  }
};
const c = -0.5;
const s = sqrt(3) / 2;
const k = 1 / sqrt(12);
const a = (k / 2 + 1) * 3;
const symbolWye = {
  draw(context, size) {
    const r = sqrt(size / a);
    const x0 = r / 2, y0 = r * k;
    const x1 = x0, y1 = r * k + r;
    const x2 = -x1, y2 = y1;
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(c * x0 - s * y0, s * x0 + c * y0);
    context.lineTo(c * x1 - s * y1, s * x1 + c * y1);
    context.lineTo(c * x2 - s * y2, s * x2 + c * y2);
    context.lineTo(c * x0 + s * y0, c * y0 - s * x0);
    context.lineTo(c * x1 + s * y1, c * y1 - s * x1);
    context.lineTo(c * x2 + s * y2, c * y2 - s * x2);
    context.closePath();
  }
};
function Symbol$1(type, size) {
  let context = null, path = withPath(symbol);
  type = typeof type === "function" ? type : constant(type || symbolCircle);
  size = typeof size === "function" ? size : constant(size === void 0 ? 64 : +size);
  function symbol() {
    let buffer;
    if (!context) context = buffer = path();
    type.apply(this, arguments).draw(context, +size.apply(this, arguments));
    if (buffer) return context = null, buffer + "" || null;
  }
  symbol.type = function(_) {
    return arguments.length ? (type = typeof _ === "function" ? _ : constant(_), symbol) : type;
  };
  symbol.size = function(_) {
    return arguments.length ? (size = typeof _ === "function" ? _ : constant(+_), symbol) : size;
  };
  symbol.context = function(_) {
    return arguments.length ? (context = _ == null ? null : _, symbol) : context;
  };
  return symbol;
}
var _excluded$3 = ["type", "size", "sizeType"];
function _extends$3() {
  return _extends$3 = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends$3.apply(null, arguments);
}
function ownKeys$5(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$5(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$5(Object(t), true).forEach(function(r2) {
      _defineProperty$5(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$5(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$5(e, r, t) {
  return (r = _toPropertyKey$5(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey$5(t) {
  var i = _toPrimitive$5(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$5(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _objectWithoutProperties$3(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose$3(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose$3(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
var symbolFactories = {
  symbolCircle,
  symbolCross,
  symbolDiamond,
  symbolSquare,
  symbolStar,
  symbolTriangle,
  symbolWye
};
var RADIAN = Math.PI / 180;
var getSymbolFactory = (type) => {
  var name = "symbol".concat(upperFirst(type));
  return symbolFactories[name] || symbolCircle;
};
var calculateAreaSize = (size, sizeType, type) => {
  if (sizeType === "area") {
    return size;
  }
  switch (type) {
    case "cross":
      return 5 * size * size / 9;
    case "diamond":
      return 0.5 * size * size / Math.sqrt(3);
    case "square":
      return size * size;
    case "star": {
      var angle = 18 * RADIAN;
      return 1.25 * size * size * (Math.tan(angle) - Math.tan(angle * 2) * Math.tan(angle) ** 2);
    }
    case "triangle":
      return Math.sqrt(3) * size * size / 4;
    case "wye":
      return (21 - 10 * Math.sqrt(3)) * size * size / 8;
    default:
      return Math.PI * size * size / 4;
  }
};
var registerSymbol = (key, factory) => {
  symbolFactories["symbol".concat(upperFirst(key))] = factory;
};
var Symbols = (_ref) => {
  var {
    type = "circle",
    size = 64,
    sizeType = "area"
  } = _ref, rest = _objectWithoutProperties$3(_ref, _excluded$3);
  var props = _objectSpread$5(_objectSpread$5({}, rest), {}, {
    type,
    size,
    sizeType
  });
  var realType = "circle";
  if (typeof type === "string") {
    realType = type;
  }
  var getPath = () => {
    var symbolFactory = getSymbolFactory(realType);
    var symbol = Symbol$1().type(symbolFactory).size(calculateAreaSize(size, sizeType, realType));
    var s2 = symbol();
    if (s2 === null) {
      return void 0;
    }
    return s2;
  };
  var {
    className,
    cx,
    cy
  } = props;
  var filteredProps = svgPropertiesAndEvents(props);
  if (isNumber(cx) && isNumber(cy) && isNumber(size)) {
    return /* @__PURE__ */ reactExports.createElement("path", _extends$3({}, filteredProps, {
      className: clsx("recharts-symbols", className),
      transform: "translate(".concat(cx, ", ").concat(cy, ")"),
      d: getPath()
    }));
  }
  return null;
};
Symbols.registerSymbol = registerSymbol;
var Cell = (_props) => null;
Cell.displayName = "Cell";
var selectUnfilteredPolarItems = (state) => state.graphicalItems.polarItems;
var selectAxisPredicate = createSelector([pickAxisType, pickAxisId], itemAxisPredicate);
var selectPolarItemsSettings = createSelector([selectUnfilteredPolarItems, selectBaseAxis, selectAxisPredicate], combineGraphicalItemsSettings);
var selectPolarGraphicalItemsData = createSelector([selectPolarItemsSettings], combineGraphicalItemsData);
var selectPolarDisplayedData = createSelector([selectPolarGraphicalItemsData, selectChartDataAndAlwaysIgnoreIndexes], combineDisplayedData);
var selectPolarAppliedValues = createSelector([selectPolarDisplayedData, selectBaseAxis, selectPolarItemsSettings], combineAppliedValues);
createSelector([selectPolarDisplayedData, selectBaseAxis, selectPolarItemsSettings], (data, axisSettings, items) => {
  if (items.length > 0) {
    return data.flatMap((entry) => {
      return items.flatMap((item) => {
        var _axisSettings$dataKey;
        var valueByDataKey = getValueByDataKey(entry, (_axisSettings$dataKey = axisSettings.dataKey) !== null && _axisSettings$dataKey !== void 0 ? _axisSettings$dataKey : item.dataKey);
        return {
          value: valueByDataKey,
          errorDomain: []
          // polar charts do not have error bars
        };
      });
    }).filter(Boolean);
  }
  if ((axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.dataKey) != null) {
    return data.map((item) => ({
      value: getValueByDataKey(item, axisSettings.dataKey),
      errorDomain: []
    }));
  }
  return data.map((entry) => ({
    value: entry,
    errorDomain: []
  }));
});
var unsupportedInPolarChart = () => void 0;
var selectDomainOfAllPolarAppliedNumericalValues = createSelector([selectPolarDisplayedData, selectBaseAxis, selectPolarItemsSettings, selectAllErrorBarSettings, pickAxisType], combineDomainOfAllAppliedNumericalValuesIncludingErrorValues);
var selectPolarNumericalDomain = createSelector([selectBaseAxis, selectDomainDefinition, selectDomainFromUserPreference, unsupportedInPolarChart, selectDomainOfAllPolarAppliedNumericalValues, unsupportedInPolarChart, selectChartLayout, pickAxisType], combineNumericalDomain);
var selectPolarAxisDomain = createSelector([selectBaseAxis, selectChartLayout, selectPolarDisplayedData, selectPolarAppliedValues, selectStackOffsetType, pickAxisType, selectPolarNumericalDomain], combineAxisDomain);
var selectPolarNiceTicks = createSelector([selectPolarAxisDomain, selectBaseAxis, selectRealScaleType], combineNiceTicks);
createSelector([selectBaseAxis, selectPolarAxisDomain, selectPolarNiceTicks, pickAxisType], combineAxisDomainWithNiceTicks);
function ownKeys$4(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$4(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$4(Object(t), true).forEach(function(r2) {
      _defineProperty$4(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$4(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$4(e, r, t) {
  return (r = _toPropertyKey$4(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey$4(t) {
  var i = _toPrimitive$4(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$4(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var pickId = (_state, id) => id;
var selectSynchronisedPieSettings = createSelector([selectUnfilteredPolarItems, pickId], (graphicalItems, id) => graphicalItems.filter((item) => item.type === "pie").find((item) => item.id === id));
var emptyArray = [];
var pickCells = (_state, _id, cells) => {
  if ((cells === null || cells === void 0 ? void 0 : cells.length) === 0) {
    return emptyArray;
  }
  return cells;
};
var selectDisplayedData = createSelector([selectChartDataAndAlwaysIgnoreIndexes, selectSynchronisedPieSettings, pickCells], (_ref, pieSettings, cells) => {
  var {
    chartData
  } = _ref;
  if (pieSettings == null) {
    return void 0;
  }
  var displayedData;
  if ((pieSettings === null || pieSettings === void 0 ? void 0 : pieSettings.data) != null && pieSettings.data.length > 0) {
    displayedData = pieSettings.data;
  } else {
    displayedData = chartData;
  }
  if ((!displayedData || !displayedData.length) && cells != null) {
    displayedData = cells.map((cell) => _objectSpread$4(_objectSpread$4({}, pieSettings.presentationProps), cell.props));
  }
  if (displayedData == null) {
    return void 0;
  }
  return displayedData;
});
var selectPieLegend = createSelector([selectDisplayedData, selectSynchronisedPieSettings, pickCells], (displayedData, pieSettings, cells) => {
  if (displayedData == null || pieSettings == null) {
    return void 0;
  }
  return displayedData.map((entry, i) => {
    var _cells$i;
    var name = getValueByDataKey(entry, pieSettings.nameKey, pieSettings.name);
    var color;
    if (cells !== null && cells !== void 0 && (_cells$i = cells[i]) !== null && _cells$i !== void 0 && (_cells$i = _cells$i.props) !== null && _cells$i !== void 0 && _cells$i.fill) {
      color = cells[i].props.fill;
    } else if (typeof entry === "object" && entry != null && "fill" in entry) {
      color = entry.fill;
    } else {
      color = pieSettings.fill;
    }
    return {
      value: getTooltipNameProp(name, pieSettings.dataKey),
      color,
      // @ts-expect-error we need a better typing for our data inputs
      payload: entry,
      type: pieSettings.legendType
    };
  });
});
var selectPieSectors = createSelector([selectDisplayedData, selectSynchronisedPieSettings, pickCells, selectChartOffsetInternal], (displayedData, pieSettings, cells, offset) => {
  if (pieSettings == null || displayedData == null) {
    return void 0;
  }
  return computePieSectors({
    offset,
    pieSettings,
    displayedData,
    cells
  });
});
var isPlainObject$2 = {};
var hasRequiredIsPlainObject$1;
function requireIsPlainObject$1() {
  if (hasRequiredIsPlainObject$1) return isPlainObject$2;
  hasRequiredIsPlainObject$1 = 1;
  (function(exports$1) {
    Object.defineProperty(exports$1, Symbol.toStringTag, { value: "Module" });
    function isPlainObject2(object) {
      if (typeof object !== "object") {
        return false;
      }
      if (object == null) {
        return false;
      }
      if (Object.getPrototypeOf(object) === null) {
        return true;
      }
      if (Object.prototype.toString.call(object) !== "[object Object]") {
        const tag = object[Symbol.toStringTag];
        if (tag == null) {
          return false;
        }
        const isTagReadonly = !Object.getOwnPropertyDescriptor(object, Symbol.toStringTag)?.writable;
        if (isTagReadonly) {
          return false;
        }
        return object.toString() === `[object ${tag}]`;
      }
      let proto = object;
      while (Object.getPrototypeOf(proto) !== null) {
        proto = Object.getPrototypeOf(proto);
      }
      return Object.getPrototypeOf(object) === proto;
    }
    exports$1.isPlainObject = isPlainObject2;
  })(isPlainObject$2);
  return isPlainObject$2;
}
var isPlainObject$1;
var hasRequiredIsPlainObject;
function requireIsPlainObject() {
  if (hasRequiredIsPlainObject) return isPlainObject$1;
  hasRequiredIsPlainObject = 1;
  isPlainObject$1 = requireIsPlainObject$1().isPlainObject;
  return isPlainObject$1;
}
var isPlainObjectExports = /* @__PURE__ */ requireIsPlainObject();
const isPlainObject = /* @__PURE__ */ getDefaultExportFromCjs(isPlainObjectExports);
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;
function ownKeys$3(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$3(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$3(Object(t), true).forEach(function(r2) {
      _defineProperty$3(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$3(e, r, t) {
  return (r = _toPropertyKey$3(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey$3(t) {
  var i = _toPrimitive$3(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$3(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _extends$2() {
  return _extends$2 = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends$2.apply(null, arguments);
}
function _taggedTemplateLiteral(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var getTrapezoidPath = (x, y, upperWidth, lowerWidth, height) => {
  var widthGap = upperWidth - lowerWidth;
  var path;
  path = roundTemplateLiteral(_templateObject || (_templateObject = _taggedTemplateLiteral(["M ", ",", ""])), x, y);
  path += roundTemplateLiteral(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["L ", ",", ""])), x + upperWidth, y);
  path += roundTemplateLiteral(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["L ", ",", ""])), x + upperWidth - widthGap / 2, y + height);
  path += roundTemplateLiteral(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["L ", ",", ""])), x + upperWidth - widthGap / 2 - lowerWidth, y + height);
  path += roundTemplateLiteral(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["L ", ",", " Z"])), x, y);
  return path;
};
var defaultTrapezoidProps = {
  x: 0,
  y: 0,
  upperWidth: 0,
  lowerWidth: 0,
  height: 0,
  isUpdateAnimationActive: false,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: "ease"
};
var Trapezoid = (outsideProps) => {
  var trapezoidProps = resolveDefaultProps(outsideProps, defaultTrapezoidProps);
  var {
    x,
    y,
    upperWidth,
    lowerWidth,
    height,
    className
  } = trapezoidProps;
  var {
    animationEasing,
    animationDuration,
    animationBegin,
    isUpdateAnimationActive
  } = trapezoidProps;
  var pathRef = reactExports.useRef(null);
  var [totalLength, setTotalLength] = reactExports.useState(-1);
  var prevUpperWidthRef = reactExports.useRef(upperWidth);
  var prevLowerWidthRef = reactExports.useRef(lowerWidth);
  var prevHeightRef = reactExports.useRef(height);
  var prevXRef = reactExports.useRef(x);
  var prevYRef = reactExports.useRef(y);
  var animationId = useAnimationId(outsideProps, "trapezoid-");
  reactExports.useEffect(() => {
    if (pathRef.current && pathRef.current.getTotalLength) {
      try {
        var pathTotalLength = pathRef.current.getTotalLength();
        if (pathTotalLength) {
          setTotalLength(pathTotalLength);
        }
      } catch (_unused) {
      }
    }
  }, []);
  if (x !== +x || y !== +y || upperWidth !== +upperWidth || lowerWidth !== +lowerWidth || height !== +height || upperWidth === 0 && lowerWidth === 0 || height === 0) {
    return null;
  }
  var layerClass = clsx("recharts-trapezoid", className);
  if (!isUpdateAnimationActive) {
    return /* @__PURE__ */ reactExports.createElement("g", null, /* @__PURE__ */ reactExports.createElement("path", _extends$2({}, svgPropertiesAndEvents(trapezoidProps), {
      className: layerClass,
      d: getTrapezoidPath(x, y, upperWidth, lowerWidth, height)
    })));
  }
  var prevUpperWidth = prevUpperWidthRef.current;
  var prevLowerWidth = prevLowerWidthRef.current;
  var prevHeight = prevHeightRef.current;
  var prevX = prevXRef.current;
  var prevY = prevYRef.current;
  var from = "0px ".concat(totalLength === -1 ? 1 : totalLength, "px");
  var to = "".concat(totalLength, "px 0px");
  var transition = getTransitionVal(["strokeDasharray"], animationDuration, animationEasing);
  return /* @__PURE__ */ reactExports.createElement(JavascriptAnimate, {
    animationId,
    key: animationId,
    canBegin: totalLength > 0,
    duration: animationDuration,
    easing: animationEasing,
    isActive: isUpdateAnimationActive,
    begin: animationBegin
  }, (t) => {
    var currUpperWidth = interpolate(prevUpperWidth, upperWidth, t);
    var currLowerWidth = interpolate(prevLowerWidth, lowerWidth, t);
    var currHeight = interpolate(prevHeight, height, t);
    var currX = interpolate(prevX, x, t);
    var currY = interpolate(prevY, y, t);
    if (pathRef.current) {
      prevUpperWidthRef.current = currUpperWidth;
      prevLowerWidthRef.current = currLowerWidth;
      prevHeightRef.current = currHeight;
      prevXRef.current = currX;
      prevYRef.current = currY;
    }
    var animationStyle = t > 0 ? {
      transition,
      strokeDasharray: to
    } : {
      strokeDasharray: from
    };
    return /* @__PURE__ */ reactExports.createElement("path", _extends$2({}, svgPropertiesAndEvents(trapezoidProps), {
      className: layerClass,
      d: getTrapezoidPath(currX, currY, currUpperWidth, currLowerWidth, currHeight),
      ref: pathRef,
      style: _objectSpread$3(_objectSpread$3({}, animationStyle), trapezoidProps.style)
    }));
  });
};
var _excluded$2 = ["option", "shapeType", "activeClassName"];
function _objectWithoutProperties$2(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose$2(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose$2(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function ownKeys$2(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$2(Object(t), true).forEach(function(r2) {
      _defineProperty$2(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$2(e, r, t) {
  return (r = _toPropertyKey$2(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey$2(t) {
  var i = _toPrimitive$2(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$2(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function defaultPropTransformer(option, props) {
  return _objectSpread$2(_objectSpread$2({}, props), option);
}
function isSymbolsProps(shapeType, _elementProps) {
  return shapeType === "symbols";
}
function ShapeSelector(_ref) {
  var {
    shapeType,
    elementProps
  } = _ref;
  switch (shapeType) {
    case "rectangle":
      return /* @__PURE__ */ reactExports.createElement(Rectangle, elementProps);
    case "trapezoid":
      return /* @__PURE__ */ reactExports.createElement(Trapezoid, elementProps);
    case "sector":
      return /* @__PURE__ */ reactExports.createElement(Sector, elementProps);
    case "symbols":
      if (isSymbolsProps(shapeType)) {
        return /* @__PURE__ */ reactExports.createElement(Symbols, elementProps);
      }
      break;
    case "curve":
      return /* @__PURE__ */ reactExports.createElement(Curve, elementProps);
    default:
      return null;
  }
}
function getPropsFromShapeOption(option) {
  if (/* @__PURE__ */ reactExports.isValidElement(option)) {
    return option.props;
  }
  return option;
}
function Shape(_ref2) {
  var {
    option,
    shapeType,
    activeClassName = "recharts-active-shape"
  } = _ref2, props = _objectWithoutProperties$2(_ref2, _excluded$2);
  var shape;
  if (/* @__PURE__ */ reactExports.isValidElement(option)) {
    shape = /* @__PURE__ */ reactExports.cloneElement(option, _objectSpread$2(_objectSpread$2({}, props), getPropsFromShapeOption(option)));
  } else if (typeof option === "function") {
    shape = option(props, props.index);
  } else if (isPlainObject(option) && typeof option !== "boolean") {
    var nextProps = defaultPropTransformer(option, props);
    shape = /* @__PURE__ */ reactExports.createElement(ShapeSelector, {
      shapeType,
      elementProps: nextProps
    });
  } else {
    var elementProps = props;
    shape = /* @__PURE__ */ reactExports.createElement(ShapeSelector, {
      shapeType,
      elementProps
    });
  }
  if (props.isActive) {
    return /* @__PURE__ */ reactExports.createElement(Layer, {
      className: activeClassName
    }, shape);
  }
  return shape;
}
var useMouseEnterItemDispatch = (onMouseEnterFromProps, dataKey, graphicalItemId) => {
  var dispatch = useAppDispatch();
  return (data, index) => (event) => {
    onMouseEnterFromProps === null || onMouseEnterFromProps === void 0 || onMouseEnterFromProps(data, index, event);
    dispatch(setActiveMouseOverItemIndex({
      activeIndex: String(index),
      activeDataKey: dataKey,
      activeCoordinate: data.tooltipPosition,
      activeGraphicalItemId: graphicalItemId
    }));
  };
};
var useMouseLeaveItemDispatch = (onMouseLeaveFromProps) => {
  var dispatch = useAppDispatch();
  return (data, index) => (event) => {
    onMouseLeaveFromProps === null || onMouseLeaveFromProps === void 0 || onMouseLeaveFromProps(data, index, event);
    dispatch(mouseLeaveItem());
  };
};
var useMouseClickItemDispatch = (onMouseClickFromProps, dataKey, graphicalItemId) => {
  var dispatch = useAppDispatch();
  return (data, index) => (event) => {
    onMouseClickFromProps === null || onMouseClickFromProps === void 0 || onMouseClickFromProps(data, index, event);
    dispatch(setActiveClickItemIndex({
      activeIndex: String(index),
      activeDataKey: dataKey,
      activeCoordinate: data.tooltipPosition,
      activeGraphicalItemId: graphicalItemId
    }));
  };
};
var _excluded$1 = ["key"], _excluded2 = ["onMouseEnter", "onClick", "onMouseLeave"], _excluded3 = ["id"], _excluded4 = ["id"];
function ownKeys$1(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread$1(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$1(Object(t), true).forEach(function(r2) {
      _defineProperty$1(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty$1(e, r, t) {
  return (r = _toPropertyKey$1(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey$1(t) {
  var i = _toPrimitive$1(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$1(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _extends$1() {
  return _extends$1 = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends$1.apply(null, arguments);
}
function _objectWithoutProperties$1(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose$1(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose$1(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function SetPiePayloadLegend(props) {
  var cells = reactExports.useMemo(() => findAllByType(props.children, Cell), [props.children]);
  var legendPayload = useAppSelector((state) => selectPieLegend(state, props.id, cells));
  if (legendPayload == null) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(SetPolarLegendPayload, {
    legendPayload
  });
}
var SetPieTooltipEntrySettings = /* @__PURE__ */ reactExports.memo((_ref) => {
  var {
    dataKey,
    nameKey,
    sectors,
    stroke,
    strokeWidth,
    fill,
    name,
    hide,
    tooltipType,
    id
  } = _ref;
  var tooltipEntrySettings = {
    dataDefinedOnItem: sectors.map((p) => p.tooltipPayload),
    positions: sectors.map((p) => p.tooltipPosition),
    settings: {
      stroke,
      strokeWidth,
      fill,
      dataKey,
      nameKey,
      name: getTooltipNameProp(name, dataKey),
      hide,
      type: tooltipType,
      color: fill,
      unit: "",
      // why doesn't Pie support unit?
      graphicalItemId: id
    }
  };
  return /* @__PURE__ */ reactExports.createElement(SetTooltipEntrySettings, {
    tooltipEntrySettings
  });
});
var getTextAnchor = (x, cx) => {
  if (x > cx) {
    return "start";
  }
  if (x < cx) {
    return "end";
  }
  return "middle";
};
var getOuterRadius = (dataPoint, outerRadius, maxPieRadius) => {
  if (typeof outerRadius === "function") {
    return getPercentValue(outerRadius(dataPoint), maxPieRadius, maxPieRadius * 0.8);
  }
  return getPercentValue(outerRadius, maxPieRadius, maxPieRadius * 0.8);
};
var parseCoordinateOfPie = (pieSettings, offset, dataPoint) => {
  var {
    top,
    left,
    width,
    height
  } = offset;
  var maxPieRadius = getMaxRadius(width, height);
  var cx = left + getPercentValue(pieSettings.cx, width, width / 2);
  var cy = top + getPercentValue(pieSettings.cy, height, height / 2);
  var innerRadius = getPercentValue(pieSettings.innerRadius, maxPieRadius, 0);
  var outerRadius = getOuterRadius(dataPoint, pieSettings.outerRadius, maxPieRadius);
  var maxRadius = pieSettings.maxRadius || Math.sqrt(width * width + height * height) / 2;
  return {
    cx,
    cy,
    innerRadius,
    outerRadius,
    maxRadius
  };
};
var parseDeltaAngle = (startAngle, endAngle) => {
  var sign = mathSign(endAngle - startAngle);
  var deltaAngle = Math.min(Math.abs(endAngle - startAngle), 360);
  return sign * deltaAngle;
};
function getClassNamePropertyIfExists(u) {
  if (u && typeof u === "object" && "className" in u && typeof u.className === "string") {
    return u.className;
  }
  return "";
}
var renderLabelLineItem = (option, props) => {
  if (/* @__PURE__ */ reactExports.isValidElement(option)) {
    return /* @__PURE__ */ reactExports.cloneElement(option, props);
  }
  if (typeof option === "function") {
    return option(props);
  }
  var className = clsx("recharts-pie-label-line", typeof option !== "boolean" ? option.className : "");
  var {
    key
  } = props, otherProps = _objectWithoutProperties$1(props, _excluded$1);
  return /* @__PURE__ */ reactExports.createElement(Curve, _extends$1({}, otherProps, {
    type: "linear",
    className
  }));
};
var renderLabelItem = (option, props, value) => {
  if (/* @__PURE__ */ reactExports.isValidElement(option)) {
    return /* @__PURE__ */ reactExports.cloneElement(option, props);
  }
  var label = value;
  if (typeof option === "function") {
    label = option(props);
    if (/* @__PURE__ */ reactExports.isValidElement(label)) {
      return label;
    }
  }
  var className = clsx("recharts-pie-label-text", getClassNamePropertyIfExists(option));
  return /* @__PURE__ */ reactExports.createElement(Text, _extends$1({}, props, {
    alignmentBaseline: "middle",
    className
  }), label);
};
function PieLabels(_ref2) {
  var {
    sectors,
    props,
    showLabels
  } = _ref2;
  var {
    label,
    labelLine,
    dataKey
  } = props;
  if (!showLabels || !label || !sectors) {
    return null;
  }
  var pieProps = svgPropertiesNoEvents(props);
  var customLabelProps = svgPropertiesNoEventsFromUnknown(label);
  var customLabelLineProps = svgPropertiesNoEventsFromUnknown(labelLine);
  var offsetRadius = typeof label === "object" && "offsetRadius" in label && typeof label.offsetRadius === "number" && label.offsetRadius || 20;
  var labels = sectors.map((entry, i) => {
    var midAngle = (entry.startAngle + entry.endAngle) / 2;
    var endPoint = polarToCartesian(entry.cx, entry.cy, entry.outerRadius + offsetRadius, midAngle);
    var labelProps = _objectSpread$1(_objectSpread$1(_objectSpread$1(_objectSpread$1({}, pieProps), entry), {}, {
      // @ts-expect-error customLabelProps is contributing unknown props
      stroke: "none"
    }, customLabelProps), {}, {
      index: i,
      textAnchor: getTextAnchor(endPoint.x, entry.cx)
    }, endPoint);
    var lineProps = _objectSpread$1(_objectSpread$1(_objectSpread$1(_objectSpread$1({}, pieProps), entry), {}, {
      // @ts-expect-error customLabelLineProps is contributing unknown props
      fill: "none",
      // @ts-expect-error customLabelLineProps is contributing unknown props
      stroke: entry.fill
    }, customLabelLineProps), {}, {
      index: i,
      points: [polarToCartesian(entry.cx, entry.cy, entry.outerRadius, midAngle), endPoint],
      key: "line"
    });
    return /* @__PURE__ */ reactExports.createElement(ZIndexLayer, {
      zIndex: DefaultZIndexes.label,
      key: "label-".concat(entry.startAngle, "-").concat(entry.endAngle, "-").concat(entry.midAngle, "-").concat(i)
    }, /* @__PURE__ */ reactExports.createElement(Layer, null, labelLine && renderLabelLineItem(labelLine, lineProps), renderLabelItem(label, labelProps, getValueByDataKey(entry, dataKey))));
  });
  return /* @__PURE__ */ reactExports.createElement(Layer, {
    className: "recharts-pie-labels"
  }, labels);
}
function PieLabelList(_ref3) {
  var {
    sectors,
    props,
    showLabels
  } = _ref3;
  var {
    label
  } = props;
  if (typeof label === "object" && label != null && "position" in label) {
    return /* @__PURE__ */ reactExports.createElement(LabelListFromLabelProp, {
      label
    });
  }
  return /* @__PURE__ */ reactExports.createElement(PieLabels, {
    sectors,
    props,
    showLabels
  });
}
function PieSectors(props) {
  var {
    sectors,
    activeShape,
    inactiveShape: inactiveShapeProp,
    allOtherPieProps,
    shape,
    id
  } = props;
  var activeIndex = useAppSelector(selectActiveTooltipIndex);
  var activeDataKey = useAppSelector(selectActiveTooltipDataKey);
  var activeGraphicalItemId = useAppSelector(selectActiveTooltipGraphicalItemId);
  var {
    onMouseEnter: onMouseEnterFromProps,
    onClick: onItemClickFromProps,
    onMouseLeave: onMouseLeaveFromProps
  } = allOtherPieProps, restOfAllOtherProps = _objectWithoutProperties$1(allOtherPieProps, _excluded2);
  var onMouseEnterFromContext = useMouseEnterItemDispatch(onMouseEnterFromProps, allOtherPieProps.dataKey, id);
  var onMouseLeaveFromContext = useMouseLeaveItemDispatch(onMouseLeaveFromProps);
  var onClickFromContext = useMouseClickItemDispatch(onItemClickFromProps, allOtherPieProps.dataKey, id);
  if (sectors == null || sectors.length === 0) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, sectors.map((entry, i) => {
    if ((entry === null || entry === void 0 ? void 0 : entry.startAngle) === 0 && (entry === null || entry === void 0 ? void 0 : entry.endAngle) === 0 && sectors.length !== 1) return null;
    var graphicalItemMatches = activeGraphicalItemId == null || activeGraphicalItemId === id;
    var isActive = String(i) === activeIndex && (activeDataKey == null || allOtherPieProps.dataKey === activeDataKey) && graphicalItemMatches;
    var inactiveShape = activeIndex ? inactiveShapeProp : null;
    var sectorOptions = activeShape && isActive ? activeShape : inactiveShape;
    var sectorProps = _objectSpread$1(_objectSpread$1({}, entry), {}, {
      stroke: entry.stroke,
      tabIndex: -1,
      [DATA_ITEM_INDEX_ATTRIBUTE_NAME]: i,
      [DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME]: id
    });
    return /* @__PURE__ */ reactExports.createElement(Layer, _extends$1({
      key: "sector-".concat(entry === null || entry === void 0 ? void 0 : entry.startAngle, "-").concat(entry === null || entry === void 0 ? void 0 : entry.endAngle, "-").concat(entry.midAngle, "-").concat(i),
      tabIndex: -1,
      className: "recharts-pie-sector"
    }, adaptEventsOfChild(restOfAllOtherProps, entry, i), {
      // @ts-expect-error the types need a bit of attention
      onMouseEnter: onMouseEnterFromContext(entry, i),
      onMouseLeave: onMouseLeaveFromContext(entry, i),
      onClick: onClickFromContext(entry, i)
    }), /* @__PURE__ */ reactExports.createElement(Shape, _extends$1({
      option: shape !== null && shape !== void 0 ? shape : sectorOptions,
      index: i,
      shapeType: "sector",
      isActive
    }, sectorProps)));
  }));
}
function computePieSectors(_ref4) {
  var _pieSettings$paddingA;
  var {
    pieSettings,
    displayedData,
    cells,
    offset
  } = _ref4;
  var {
    cornerRadius,
    startAngle,
    endAngle,
    dataKey,
    nameKey,
    tooltipType
  } = pieSettings;
  var minAngle = Math.abs(pieSettings.minAngle);
  var deltaAngle = parseDeltaAngle(startAngle, endAngle);
  var absDeltaAngle = Math.abs(deltaAngle);
  var paddingAngle = displayedData.length <= 1 ? 0 : (_pieSettings$paddingA = pieSettings.paddingAngle) !== null && _pieSettings$paddingA !== void 0 ? _pieSettings$paddingA : 0;
  var notZeroItemCount = displayedData.filter((entry) => getValueByDataKey(entry, dataKey, 0) !== 0).length;
  var totalPaddingAngle = (absDeltaAngle >= 360 ? notZeroItemCount : notZeroItemCount - 1) * paddingAngle;
  var realTotalAngle = absDeltaAngle - notZeroItemCount * minAngle - totalPaddingAngle;
  var sum = displayedData.reduce((result, entry) => {
    var val = getValueByDataKey(entry, dataKey, 0);
    return result + (isNumber(val) ? val : 0);
  }, 0);
  var sectors;
  if (sum > 0) {
    var prev;
    sectors = displayedData.map((entry, i) => {
      var val = getValueByDataKey(entry, dataKey, 0);
      var name = getValueByDataKey(entry, nameKey, i);
      var coordinate = parseCoordinateOfPie(pieSettings, offset, entry);
      var percent = (isNumber(val) ? val : 0) / sum;
      var tempStartAngle;
      var entryWithCellInfo = _objectSpread$1(_objectSpread$1({}, entry), cells && cells[i] && cells[i].props);
      if (i) {
        tempStartAngle = prev.endAngle + mathSign(deltaAngle) * paddingAngle * (val !== 0 ? 1 : 0);
      } else {
        tempStartAngle = startAngle;
      }
      var tempEndAngle = tempStartAngle + mathSign(deltaAngle) * ((val !== 0 ? minAngle : 0) + percent * realTotalAngle);
      var midAngle = (tempStartAngle + tempEndAngle) / 2;
      var middleRadius = (coordinate.innerRadius + coordinate.outerRadius) / 2;
      var tooltipPayload = [{
        name,
        value: val,
        payload: entryWithCellInfo,
        dataKey,
        type: tooltipType,
        graphicalItemId: pieSettings.id
      }];
      var tooltipPosition = polarToCartesian(coordinate.cx, coordinate.cy, middleRadius, midAngle);
      prev = _objectSpread$1(_objectSpread$1(_objectSpread$1(_objectSpread$1({}, pieSettings.presentationProps), {}, {
        percent,
        cornerRadius: typeof cornerRadius === "string" ? parseFloat(cornerRadius) : cornerRadius,
        name,
        tooltipPayload,
        midAngle,
        middleRadius,
        tooltipPosition
      }, entryWithCellInfo), coordinate), {}, {
        value: val,
        dataKey,
        startAngle: tempStartAngle,
        endAngle: tempEndAngle,
        payload: entryWithCellInfo,
        paddingAngle: mathSign(deltaAngle) * paddingAngle
      });
      return prev;
    });
  }
  return sectors;
}
function PieLabelListProvider(_ref5) {
  var {
    showLabels,
    sectors,
    children
  } = _ref5;
  var labelListEntries = reactExports.useMemo(() => {
    if (!showLabels || !sectors) {
      return [];
    }
    return sectors.map((entry) => ({
      value: entry.value,
      payload: entry.payload,
      clockWise: false,
      parentViewBox: void 0,
      viewBox: {
        cx: entry.cx,
        cy: entry.cy,
        innerRadius: entry.innerRadius,
        outerRadius: entry.outerRadius,
        startAngle: entry.startAngle,
        endAngle: entry.endAngle,
        clockWise: false
      },
      fill: entry.fill
    }));
  }, [sectors, showLabels]);
  return /* @__PURE__ */ reactExports.createElement(PolarLabelListContextProvider, {
    value: showLabels ? labelListEntries : void 0
  }, children);
}
function SectorsWithAnimation(_ref6) {
  var {
    props,
    previousSectorsRef,
    id
  } = _ref6;
  var {
    sectors,
    isAnimationActive,
    animationBegin,
    animationDuration,
    animationEasing,
    activeShape,
    inactiveShape,
    onAnimationStart,
    onAnimationEnd
  } = props;
  var animationId = useAnimationId(props, "recharts-pie-");
  var prevSectors = previousSectorsRef.current;
  var [isAnimating, setIsAnimating] = reactExports.useState(false);
  var handleAnimationEnd = reactExports.useCallback(() => {
    if (typeof onAnimationEnd === "function") {
      onAnimationEnd();
    }
    setIsAnimating(false);
  }, [onAnimationEnd]);
  var handleAnimationStart = reactExports.useCallback(() => {
    if (typeof onAnimationStart === "function") {
      onAnimationStart();
    }
    setIsAnimating(true);
  }, [onAnimationStart]);
  return /* @__PURE__ */ reactExports.createElement(PieLabelListProvider, {
    showLabels: !isAnimating,
    sectors
  }, /* @__PURE__ */ reactExports.createElement(JavascriptAnimate, {
    animationId,
    begin: animationBegin,
    duration: animationDuration,
    isActive: isAnimationActive,
    easing: animationEasing,
    onAnimationStart: handleAnimationStart,
    onAnimationEnd: handleAnimationEnd,
    key: animationId
  }, (t) => {
    var stepData = [];
    var first = sectors && sectors[0];
    var curAngle = first === null || first === void 0 ? void 0 : first.startAngle;
    sectors === null || sectors === void 0 || sectors.forEach((entry, index) => {
      var prev = prevSectors && prevSectors[index];
      var paddingAngle = index > 0 ? get(entry, "paddingAngle", 0) : 0;
      if (prev) {
        var angle = interpolate(prev.endAngle - prev.startAngle, entry.endAngle - entry.startAngle, t);
        var latest = _objectSpread$1(_objectSpread$1({}, entry), {}, {
          startAngle: curAngle + paddingAngle,
          endAngle: curAngle + angle + paddingAngle
        });
        stepData.push(latest);
        curAngle = latest.endAngle;
      } else {
        var {
          endAngle,
          startAngle
        } = entry;
        var deltaAngle = interpolate(0, endAngle - startAngle, t);
        var _latest = _objectSpread$1(_objectSpread$1({}, entry), {}, {
          startAngle: curAngle + paddingAngle,
          endAngle: curAngle + deltaAngle + paddingAngle
        });
        stepData.push(_latest);
        curAngle = _latest.endAngle;
      }
    });
    previousSectorsRef.current = stepData;
    return /* @__PURE__ */ reactExports.createElement(Layer, null, /* @__PURE__ */ reactExports.createElement(PieSectors, {
      sectors: stepData,
      activeShape,
      inactiveShape,
      allOtherPieProps: props,
      shape: props.shape,
      id
    }));
  }), /* @__PURE__ */ reactExports.createElement(PieLabelList, {
    showLabels: !isAnimating,
    sectors,
    props
  }), props.children);
}
var defaultPieProps = {
  animationBegin: 400,
  animationDuration: 1500,
  animationEasing: "ease",
  cx: "50%",
  cy: "50%",
  dataKey: "value",
  endAngle: 360,
  fill: "#808080",
  hide: false,
  innerRadius: 0,
  isAnimationActive: "auto",
  label: false,
  labelLine: true,
  legendType: "rect",
  minAngle: 0,
  nameKey: "name",
  outerRadius: "80%",
  paddingAngle: 0,
  rootTabIndex: 0,
  startAngle: 0,
  stroke: "#fff",
  zIndex: DefaultZIndexes.area
};
function PieImpl(props) {
  var {
    id
  } = props, propsWithoutId = _objectWithoutProperties$1(props, _excluded3);
  var {
    hide,
    className,
    rootTabIndex
  } = props;
  var cells = reactExports.useMemo(() => findAllByType(props.children, Cell), [props.children]);
  var sectors = useAppSelector((state) => selectPieSectors(state, id, cells));
  var previousSectorsRef = reactExports.useRef(null);
  var layerClass = clsx("recharts-pie", className);
  if (hide || sectors == null) {
    previousSectorsRef.current = null;
    return /* @__PURE__ */ reactExports.createElement(Layer, {
      tabIndex: rootTabIndex,
      className: layerClass
    });
  }
  return /* @__PURE__ */ reactExports.createElement(ZIndexLayer, {
    zIndex: props.zIndex
  }, /* @__PURE__ */ reactExports.createElement(SetPieTooltipEntrySettings, {
    dataKey: props.dataKey,
    nameKey: props.nameKey,
    sectors,
    stroke: props.stroke,
    strokeWidth: props.strokeWidth,
    fill: props.fill,
    name: props.name,
    hide: props.hide,
    tooltipType: props.tooltipType,
    id
  }), /* @__PURE__ */ reactExports.createElement(Layer, {
    tabIndex: rootTabIndex,
    className: layerClass
  }, /* @__PURE__ */ reactExports.createElement(SectorsWithAnimation, {
    props: _objectSpread$1(_objectSpread$1({}, propsWithoutId), {}, {
      sectors
    }),
    previousSectorsRef,
    id
  })));
}
function Pie(outsideProps) {
  var props = resolveDefaultProps(outsideProps, defaultPieProps);
  var {
    id: externalId
  } = props, propsWithoutId = _objectWithoutProperties$1(props, _excluded4);
  var presentationProps = svgPropertiesNoEvents(propsWithoutId);
  return /* @__PURE__ */ reactExports.createElement(RegisterGraphicalItemId, {
    id: externalId,
    type: "pie"
  }, (id) => /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement(SetPolarGraphicalItem, {
    type: "pie",
    id,
    data: propsWithoutId.data,
    dataKey: propsWithoutId.dataKey,
    hide: propsWithoutId.hide,
    angleAxisId: 0,
    radiusAxisId: 0,
    name: propsWithoutId.name,
    nameKey: propsWithoutId.nameKey,
    tooltipType: propsWithoutId.tooltipType,
    legendType: propsWithoutId.legendType,
    fill: propsWithoutId.fill,
    cx: propsWithoutId.cx,
    cy: propsWithoutId.cy,
    startAngle: propsWithoutId.startAngle,
    endAngle: propsWithoutId.endAngle,
    paddingAngle: propsWithoutId.paddingAngle,
    minAngle: propsWithoutId.minAngle,
    innerRadius: propsWithoutId.innerRadius,
    outerRadius: propsWithoutId.outerRadius,
    cornerRadius: propsWithoutId.cornerRadius,
    presentationProps,
    maxRadius: props.maxRadius
  }), /* @__PURE__ */ reactExports.createElement(SetPiePayloadLegend, _extends$1({}, propsWithoutId, {
    id
  })), /* @__PURE__ */ reactExports.createElement(PieImpl, _extends$1({}, propsWithoutId, {
    id
  }))));
}
Pie.displayName = "Pie";
function ReportPolarOptions(props) {
  var dispatch = useAppDispatch();
  reactExports.useEffect(() => {
    dispatch(updatePolarOptions(props));
  }, [dispatch, props]);
  return null;
}
var _excluded = ["layout"];
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o, r, i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e);
    for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}
var defaultMargin = {
  top: 5,
  right: 5,
  bottom: 5,
  left: 5
};
var defaultPolarChartProps = {
  accessibilityLayer: true,
  stackOffset: "none",
  barCategoryGap: "10%",
  barGap: 4,
  margin: defaultMargin,
  reverseStackOrder: false,
  syncMethod: "index",
  layout: "radial",
  responsive: false,
  cx: "50%",
  cy: "50%",
  innerRadius: 0,
  outerRadius: "80%"
};
var PolarChart = /* @__PURE__ */ reactExports.forwardRef(function PolarChart2(props, ref) {
  var _polarChartProps$id;
  var polarChartProps = resolveDefaultProps(props.categoricalChartProps, defaultPolarChartProps);
  var {
    layout
  } = polarChartProps, otherCategoricalProps = _objectWithoutProperties(polarChartProps, _excluded);
  var {
    chartName,
    defaultTooltipEventType,
    validateTooltipEventTypes,
    tooltipPayloadSearcher
  } = props;
  var options = {
    chartName,
    defaultTooltipEventType,
    validateTooltipEventTypes,
    tooltipPayloadSearcher,
    eventEmitter: void 0
  };
  return /* @__PURE__ */ reactExports.createElement(RechartsStoreProvider, {
    preloadedState: {
      options
    },
    reduxStoreName: (_polarChartProps$id = polarChartProps.id) !== null && _polarChartProps$id !== void 0 ? _polarChartProps$id : chartName
  }, /* @__PURE__ */ reactExports.createElement(ChartDataContextProvider, {
    chartData: polarChartProps.data
  }), /* @__PURE__ */ reactExports.createElement(ReportMainChartProps, {
    layout,
    margin: polarChartProps.margin
  }), /* @__PURE__ */ reactExports.createElement(ReportChartProps, {
    baseValue: void 0,
    accessibilityLayer: polarChartProps.accessibilityLayer,
    barCategoryGap: polarChartProps.barCategoryGap,
    maxBarSize: polarChartProps.maxBarSize,
    stackOffset: polarChartProps.stackOffset,
    barGap: polarChartProps.barGap,
    barSize: polarChartProps.barSize,
    syncId: polarChartProps.syncId,
    syncMethod: polarChartProps.syncMethod,
    className: polarChartProps.className,
    reverseStackOrder: polarChartProps.reverseStackOrder
  }), /* @__PURE__ */ reactExports.createElement(ReportPolarOptions, {
    cx: polarChartProps.cx,
    cy: polarChartProps.cy,
    startAngle: polarChartProps.startAngle,
    endAngle: polarChartProps.endAngle,
    innerRadius: polarChartProps.innerRadius,
    outerRadius: polarChartProps.outerRadius
  }), /* @__PURE__ */ reactExports.createElement(CategoricalChart, _extends({}, otherCategoricalProps, {
    ref
  })));
});
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var allowedTooltipTypes = ["item"];
var defaultPieChartProps = _objectSpread(_objectSpread({}, defaultPolarChartProps), {}, {
  layout: "centric",
  startAngle: 0,
  endAngle: 360
});
var PieChart = /* @__PURE__ */ reactExports.forwardRef((props, ref) => {
  var propsWithDefaults = resolveDefaultProps(props, defaultPieChartProps);
  return /* @__PURE__ */ reactExports.createElement(PolarChart, {
    chartName: "PieChart",
    defaultTooltipEventType: "item",
    validateTooltipEventTypes: allowedTooltipTypes,
    tooltipPayloadSearcher: arrayTooltipSearcher,
    categoricalChartProps: propsWithDefaults,
    ref
  });
});
export {
  Cell as C,
  PieChart as P,
  Pie as a
};
