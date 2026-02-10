import { r as reactExports } from "./vendor-react-Df__x13C.js";
import { r as resolveDefaultProps, u as useAppDispatch, aw as addLine, ax as removeLine, D as DefaultZIndexes, f as useIsPanorama, c as useClipPathId, g as useAppSelector, ay as selectXAxisSettings, az as selectYAxisSettings, h as selectAxisScale, aA as useViewBox, s as svgPropertiesAndEvents, Z as ZIndexLayer, L as Layer, d as clsx, C as CartesianLabelContextProvider, e as CartesianLabelFromLabelProp, aB as isWellBehavedNumber, i as isNumOrStr, aC as isNan } from "./CategoricalChart-BNQNLo93.js";
import { c as createLabeledScales, r as rectWithCoords } from "./AreaChart-D_YS4Ytt.js";
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
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
var renderLine = (option, props) => {
  var line;
  if (/* @__PURE__ */ reactExports.isValidElement(option)) {
    line = /* @__PURE__ */ reactExports.cloneElement(option, props);
  } else if (typeof option === "function") {
    line = option(props);
  } else {
    if (!isWellBehavedNumber(props.x1) || !isWellBehavedNumber(props.y1) || !isWellBehavedNumber(props.x2) || !isWellBehavedNumber(props.y2)) {
      return null;
    }
    line = /* @__PURE__ */ reactExports.createElement("line", _extends({}, props, {
      className: "recharts-reference-line-line"
    }));
  }
  return line;
};
var getHorizontalLineEndPoints = (yCoord, ifOverflow, position, yAxisOrientation, scales, viewBox) => {
  var {
    x,
    width
  } = viewBox;
  var coord = scales.y.apply(yCoord, {
    position
  });
  if (isNan(coord)) return null;
  if (ifOverflow === "discard" && !scales.y.isInRange(coord)) {
    return null;
  }
  var points = [{
    x: x + width,
    y: coord
  }, {
    x,
    y: coord
  }];
  return yAxisOrientation === "left" ? points.reverse() : points;
};
var getVerticalLineEndPoints = (xCoord, ifOverflow, position, xAxisOrientation, scales, viewBox) => {
  var {
    y,
    height
  } = viewBox;
  var coord = scales.x.apply(xCoord, {
    position
  });
  if (isNan(coord)) return null;
  if (ifOverflow === "discard" && !scales.x.isInRange(coord)) {
    return null;
  }
  var points = [{
    x: coord,
    y: y + height
  }, {
    x: coord,
    y
  }];
  return xAxisOrientation === "top" ? points.reverse() : points;
};
var getSegmentLineEndPoints = (segment, ifOverflow, position, scales) => {
  var points = segment.map((p) => scales.apply(p, {
    position
  }));
  if (ifOverflow === "discard" && points.some((p) => !scales.isInRange(p))) {
    return null;
  }
  return points;
};
var getEndPoints = (scales, viewBox, position, xAxisOrientation, yAxisOrientation, props) => {
  var {
    x: xCoord,
    y: yCoord,
    segment,
    ifOverflow
  } = props;
  var isFixedX = isNumOrStr(xCoord);
  var isFixedY = isNumOrStr(yCoord);
  if (isFixedY) {
    return getHorizontalLineEndPoints(yCoord, ifOverflow, position, yAxisOrientation, scales, viewBox);
  }
  if (isFixedX) {
    return getVerticalLineEndPoints(xCoord, ifOverflow, position, xAxisOrientation, scales, viewBox);
  }
  if (segment != null && segment.length === 2) {
    return getSegmentLineEndPoints(segment, ifOverflow, position, scales);
  }
  return null;
};
function ReportReferenceLine(props) {
  var dispatch = useAppDispatch();
  reactExports.useEffect(() => {
    dispatch(addLine(props));
    return () => {
      dispatch(removeLine(props));
    };
  });
  return null;
}
function ReferenceLineImpl(props) {
  var {
    xAxisId,
    yAxisId,
    shape,
    className,
    ifOverflow
  } = props;
  var isPanorama = useIsPanorama();
  var clipPathId = useClipPathId();
  var xAxis = useAppSelector((state) => selectXAxisSettings(state, xAxisId));
  var yAxis = useAppSelector((state) => selectYAxisSettings(state, yAxisId));
  var xAxisScale = useAppSelector((state) => selectAxisScale(state, "xAxis", xAxisId, isPanorama));
  var yAxisScale = useAppSelector((state) => selectAxisScale(state, "yAxis", yAxisId, isPanorama));
  var viewBox = useViewBox();
  if (!clipPathId || !viewBox || xAxis == null || yAxis == null || xAxisScale == null || yAxisScale == null) {
    return null;
  }
  var scales = createLabeledScales({
    x: xAxisScale,
    y: yAxisScale
  });
  var endPoints = getEndPoints(scales, viewBox, props.position, xAxis.orientation, yAxis.orientation, props);
  if (!endPoints) {
    return null;
  }
  var [{
    x: x1,
    y: y1
  }, {
    x: x2,
    y: y2
  }] = endPoints;
  var clipPath = ifOverflow === "hidden" ? "url(#".concat(clipPathId, ")") : void 0;
  var lineProps = _objectSpread(_objectSpread({
    clipPath
  }, svgPropertiesAndEvents(props)), {}, {
    x1,
    y1,
    x2,
    y2
  });
  var rect = rectWithCoords({
    x1,
    y1,
    x2,
    y2
  });
  return /* @__PURE__ */ reactExports.createElement(ZIndexLayer, {
    zIndex: props.zIndex
  }, /* @__PURE__ */ reactExports.createElement(Layer, {
    className: clsx("recharts-reference-line", className)
  }, renderLine(shape, lineProps), /* @__PURE__ */ reactExports.createElement(CartesianLabelContextProvider, _extends({}, rect, {
    lowerWidth: rect.width,
    upperWidth: rect.width
  }), /* @__PURE__ */ reactExports.createElement(CartesianLabelFromLabelProp, {
    label: props.label
  }), props.children)));
}
var referenceLineDefaultProps = {
  ifOverflow: "discard",
  xAxisId: 0,
  yAxisId: 0,
  fill: "none",
  stroke: "#ccc",
  fillOpacity: 1,
  strokeWidth: 1,
  position: "middle",
  zIndex: DefaultZIndexes.line
};
function ReferenceLine(outsideProps) {
  var props = resolveDefaultProps(outsideProps, referenceLineDefaultProps);
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement(ReportReferenceLine, {
    yAxisId: props.yAxisId,
    xAxisId: props.xAxisId,
    ifOverflow: props.ifOverflow,
    x: props.x,
    y: props.y,
    segment: props.segment
  }), /* @__PURE__ */ reactExports.createElement(ReferenceLineImpl, props));
}
ReferenceLine.displayName = "ReferenceLine";
export {
  ReferenceLine as R
};
