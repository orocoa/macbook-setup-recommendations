/** Adapted from Remocn Mondrian Split, MIT, Copyright (c) 2026 Remocn.
 * Original retained in outputs/mondrian-loading-20261018/source-reference/.
 * Browser clock, loading gate and content reveal are UiWeb additions. */
                                                                                                                                                                                                                             
                                                         
                                                                                                                                                                                                                                                                                                                                                                                
export const defaultMondrian                           ={seed:42,splits:9,lineWeight:7,expandCell:3,lineColor:'#121212',redColor:'#f4c20d',yellowColor:'#d62d20',blueColor:'#1f4e9e',fieldColor:'#ffffff',speed:1,revealMs:600,rise:12};
export const mondrianRanges={seed:[0,9999,1],splits:[3,12,1],lineWeight:[2,48,1],expandCell:[0,12,1],speed:[0,3,.1],revealMs:[80,2000,10],rise:[0,48,1]}         ;
export function validateMondrian(value        )                 {
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.getPrototypeOf(value)!==Object.prototype)throw Error('蒙德里安加载设置无效。');
 const v=value                          ,keys=Object.keys(defaultMondrian);
 if(Reflect.ownKeys(v).length!==keys.length||keys.some(key=>!Object.hasOwn(Object.getOwnPropertyDescriptor(v,key)??{},'value')))throw Error('蒙德里安加载设置字段不完整或含未知字段。');
 for(const [key,[min,max]] of Object.entries(mondrianRanges))if(typeof v[key]!=='number'||!Number.isFinite(v[key])||Number(v[key])<min||Number(v[key])>max)throw Error('蒙德里安加载 '+key+' 超出范围。');
 for(const key of ['seed','splits','lineWeight','expandCell'])if(!Number.isInteger(v[key]))throw Error('构图参数须为整数。');
 if(Number(v.expandCell)>Number(v.splits))throw Error('扩张格子不能超出格子数量。');
 for(const key of ['lineColor','redColor','yellowColor','blueColor','fieldColor'])if(typeof v[key]!=='string'||!/^#[\da-f]{6}$/i.test(v[key]          ))throw Error('加载动画颜色须为六位十六进制。');
 return structuredClone(v)                    ;
}
export function createMondrianEngine(){
 // Cubic Bezier inversion keeps the original authored timing without Remotion.
 const Easing={bezier:(x1       ,y1       ,x2       ,y2       )=>(x       )=>{
  if(x<=0)return 0;if(x>=1)return 1;
  const at=(t       ,a       ,b       )=>3*(1-t)*(1-t)*t*a+3*(1-t)*t*t*b+t*t*t;
  let lo=0,hi=1;for(let n=0;n<26;n++){const mid=(lo+hi)/2;if(at(mid,x1,x2)<x)lo=mid;else hi=mid}return at((lo+hi)/2,y1,y2);
 },poly:(power       )=>(x       )=>Math.pow(x,power)};
 // Standard 31-based string hashing and Mulberry32; deterministic per cut.
 const random=(seed       )=>{let hash=0;for(let i=0;i<seed.length;i++)hash=(Math.imul(hash,31)+seed.charCodeAt(i))|0;let bits=hash+0x6d2b79f5;bits=Math.imul(bits^(bits>>>15),bits|1);bits^=bits+Math.imul(bits^(bits>>>7),bits|61);return ((bits^(bits>>>14))>>>0)/4294967296};
                                   
                                                   
                                                             

                              
                     
                
                  
                      
                      
                     
                    
                       
                     
                      
                 
                     
 

                                 
                     
                                                 
     
                 
                  
  

                            
             
             
             
             
 

                             
            
            
                
                 
 

                    
                        
                                            
               
 

                   
                          
                   
               
 

                    
                
               
             
                
 

                    
                          
                   
 

const mondrianSplitDefaults = {
  seed: 7,
  splits: 7,
  lineWeight: 14,
  expandCell: 0,
  lineColor: "#121212",
  redColor: "#d62d20",
  yellowColor: "#f4c20d",
  blueColor: "#1f4e9e",
  fieldColor: "#d62d20",
};

const LINE_START = 3;
const LINE_GAP = 5;
const LINE_DRAW = 10;
const FILL_LAG = 7;
const FILL_GAP = 4;
const FILL_WIPE = 9;
const FIELD_LAG = 6;
const FIELD_WIPE = 12;
const HOLD = 14;
const TRACK_COUNT = 3;
const TRACK_GAP = 5;
const TRACK_SLIDE = 20;
const EXPAND_LEAD = 4;
const SIDE_GAP = 3;
const SIDE_PUSH = 22;
const SLIDE_PEAK = 0.72;
const SLIDE_OVER = 0.035;
const RESERVE = 0.045;
const WIND = 0.22;
const DIP = 0.035;
const DIP_SHARE = 0.2;
const SIDES                      = ["left", "top", "right", "bottom"];
const SLOTS                      = ["blue", "yellow", "red", "blue", "yellow"];
const FALLBACK_CUTS = [0.38, 0.62, 0.3, 0.7, 0.5];

const drawEase = Easing.bezier(0.16, 1, 0.3, 1);
const wipeEase = Easing.bezier(0.7, 0, 0.2, 1);
const riseEase = Easing.bezier(0.65, 0, 0.3, 1);
const settleEase = Easing.bezier(0.4, 0, 0.6, 1);
const windEase = Easing.bezier(0.45, 0, 0.55, 1);
const pushEase = Easing.poly(2.5);
const contentEase = Easing.bezier(0.22, 0, 0.2, 1);


const finite = (value        , fallback        ) =>
  Number.isFinite(value) ? value : fallback;
const clamp = (value        , min        , max        ) =>
  Math.min(max, Math.max(min, value));
const mix = (from        , to        , amount        ) =>
  from + (to - from) * amount;
const progress = (time        , start        , duration        ) =>
  clamp((time - start) / duration, 0, 1);
const other = (axis                   )                    =>
  axis === "x" ? "y" : "x";
const lowEdge = (box                  , axis                   ) =>
  axis === "x" ? box.x0 : box.y0;
const extent = (box                  , axis                   ) =>
  axis === "x" ? box.x1 - box.x0 : box.y1 - box.y0;
const area = (box                  ) => extent(box, "x") * extent(box, "y");
const splitCount = (splits        ) =>
  Math.round(clamp(finite(splits, mondrianSplitDefaults.splits), 3, 12));
const coloredCount = (count        ) => clamp(Math.round(count * 0.3), 1, 5);

const touches = (a                  , b                  ) => {
  const overlapX = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
  const overlapY = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
  const beside = Math.abs(a.x1 - b.x0) < 0.5 || Math.abs(b.x1 - a.x0) < 0.5;
  const stacked = Math.abs(a.y1 - b.y0) < 0.5 || Math.abs(b.y1 - a.y0) < 0.5;
  return (beside && overlapY > 0.5) || (stacked && overlapX > 0.5);
};

const choose = (weights                   , roll        ) => {
  let remaining = roll * weights.reduce((sum, value) => sum + value, 0);
  for (let index = 0; index < weights.length; index++) {
    remaining -= weights[index];
    if (remaining <= 0) return index;
  }
  return weights.length - 1;
};

const slide = (amount        ) => {
  if (amount >= 1) return 1;
  if (amount <= SLIDE_PEAK) {
    return (1 + SLIDE_OVER) * riseEase(amount / SLIDE_PEAK);
  }
  const settle = settleEase((amount - SLIDE_PEAK) / (1 - SLIDE_PEAK));
  return mix(1 + SLIDE_OVER, 1, settle);
};

const push = (amount        , dip        ) => {
  if (amount >= 1) return 1;
  if (amount <= 0) return 0;
  if (amount < WIND) return -dip * windEase(amount / WIND);
  return mix(-dip, 1, pushEase((amount - WIND) / (1 - WIND)));
};

const stretch = (
  from0        ,
  from1        ,
  to0        ,
  to1        ,
  min        ,
  max        ,
) => {
  if (from0 === to0 && from1 === to1) return (value        ) => value;
  return (value        ) => {
    if (value <= from0) {
      return min + (value - min) * ((to0 - min) / (from0 - min));
    }
    if (value >= from1) {
      return max - (max - value) * ((max - to1) / (max - from1));
    }
    return to0 + (value - from0) * ((to1 - to0) / (from1 - from0));
  };
};

const wipe = (
  box                  ,
  { axis, fromEnd }          ,
  amount        ,
)                    => {
  const width = box.x1 - box.x0;
  const height = box.y1 - box.y0;
  if (axis === "x") {
    const span = width * amount;
    return {
      x: fromEnd ? box.x1 - span : box.x0,
      y: box.y0,
      width: span,
      height,
    };
  }
  const span = height * amount;
  return {
    x: box.x0,
    y: fromEnd ? box.y1 - span : box.y0,
    width,
    height: span,
  };
};

const inFrame = (rect                   , width        , height        ) =>
  rect.width > 0.01 &&
  rect.height > 0.01 &&
  rect.x < width &&
  rect.y < height &&
  rect.x + rect.width > 0 &&
  rect.y + rect.height > 0;

const placeBoxes = (
  cuts                                           ,
  positions                   ,
  width        ,
  height        ,
) => {
  const boxes                     = [{ x0: 0, y0: 0, x1: width, y1: height }];
  for (let id = 0; id < cuts.length; id++) {
    const { axis, node } = cuts[id];
    const box = boxes[node];
    const at = positions[id];
    boxes.push(
      axis === "x" ? { ...box, x1: at } : { ...box, y1: at },
      axis === "x" ? { ...box, x0: at } : { ...box, y0: at },
    );
  }
  return boxes;
};

const percent = (value        , size        ) =>
  `${(clamp(value / size, 0, 1) * 100).toFixed(4)}%`;

function getMondrianSplitTimeline({
  splits = mondrianSplitDefaults.splits,
}                                     = {}) {
  const count = splitCount(splits);
  const fill = LINE_START + (count - 1) * LINE_GAP + FILL_LAG;
  const field = fill + (coloredCount(count) - 1) * FILL_GAP + FIELD_LAG;
  const reflow = field + FIELD_WIPE + HOLD;
  const settled = reflow + (TRACK_COUNT - 1) * TRACK_GAP + TRACK_SLIDE;
  const expand = settled - EXPAND_LEAD;
  const end = expand + (SIDES.length - 1) * SIDE_GAP + SIDE_PUSH;
  return { lines: LINE_START, fill, field, reflow, expand, end };
}

function getMondrianSplitLayout({
  seed = mondrianSplitDefaults.seed,
  splits = mondrianSplitDefaults.splits,
  lineWeight = mondrianSplitDefaults.lineWeight,
  expandCell = mondrianSplitDefaults.expandCell,
  width = 1280,
  height = 720,
}                       = {}) {
  const w = Math.max(1, finite(width, 1280));
  const h = Math.max(1, finite(height, 720));
  const short = Math.min(w, h);
  const weight = clamp(finite(lineWeight, 14), 2, 48) * (short / 720);
  const count = splitCount(splits);
  const timeline = getMondrianSplitTimeline({ splits: count });
  const salt = Math.round(finite(seed, mondrianSplitDefaults.seed));
  const roll = (name        ) => random(`mondrian-split-${salt}-${name}`);
  const minSide = Math.max(short * 0.1, weight * 3);
  const snap = short * 0.045;
  const align = short * 0.075;
  const gap = Math.max(short * 0.07, weight * 2.5);
  const minMove = short * 0.06;
  const overscan = weight + short * 0.04;
  const nodes             = [
    {
      box: { x0: 0, y0: 0, x1: w, y1: h },
      bounds: { left: -1, top: -1, right: -1, bottom: -1 },
      line: -1,
    },
  ];
  const cuts            = [];

  const lean = (
    box                  ,
    ratio        ,
    name        ,
  )                    => {
    const wide = extent(box, "x");
    const tall = extent(box, "y");
    if (wide > tall * ratio) return "x";
    if (tall > wide * ratio) return "y";
    return roll(name) < 0.5 ? "x" : "y";
  };

  const cut = (node        , axis                   , position        ) => {
    const id = cuts.length;
    const { box, bounds: edges } = nodes[node];
    const vertical = axis === "x";
    nodes[node].line = id;
    cuts.push({ axis, position, node });
    nodes.push(
      {
        box: vertical ? { ...box, x1: position } : { ...box, y1: position },
        bounds: vertical ? { ...edges, right: id } : { ...edges, bottom: id },
        line: -1,
      },
      {
        box: vertical ? { ...box, x0: position } : { ...box, y0: position },
        bounds: vertical ? { ...edges, left: id } : { ...edges, top: id },
        line: -1,
      },
    );
  };

  const snapTo = (axis                   , position        ) => {
    let best = position;
    let distance = snap;
    for (const line of cuts) {
      const offset = Math.abs(line.position - position);
      if (line.axis === axis && offset < distance) {
        best = line.position;
        distance = offset;
      }
    }
    return best;
  };

  const nearMiss = (axis                   , position        ) =>
    cuts.some(
      (line) =>
        line.axis === axis &&
        line.position !== position &&
        Math.abs(line.position - position) < snap,
    );

  const tryCut = (
    node        ,
    axis                   ,
    fraction        ,
    strict         ,
  ) => {
    const { box } = nodes[node];
    const low = lowEdge(box, axis);
    const length = extent(box, axis);
    if (length < minSide * 2) return false;
    const position = clamp(
      snapTo(axis, low + length * fraction),
      low + minSide,
      low + length - minSide,
    );
    if (strict && nearMiss(axis, position)) return false;
    cut(node, axis, position);
    return true;
  };

  let anchor = -1;
  const longAxis = lean(nodes[0].box, 1.05, "square");
  const rootAxis = roll("root-axis") < 0.75 ? longAxis : other(longAxis);
  const rootFraction =
    roll("root-side") < 0.5
      ? mix(0.3, 0.4, roll("root-at"))
      : mix(0.6, 0.7, roll("root-at"));
  if (tryCut(0, rootAxis, rootFraction, false)) {
    const share = mix(0.6, 0.76, roll("anchor-at"));
    const anchorLow = roll("anchor-side") < 0.5;
    const big = rootFraction < 0.5 ? 2 : 1;
    if (tryCut(big, other(rootAxis), anchorLow ? share : 1 - share, false)) {
      anchor = anchorLow ? nodes.length - 2 : nodes.length - 1;
    }
  }

  const splittable = (index        ) => {
    const { box, line } = nodes[index];
    return (
      line === -1 &&
      index !== anchor &&
      Math.max(extent(box, "x"), extent(box, "y")) >= minSide * 2
    );
  };

  const budget = count * 24;
  for (let attempt = 0; cuts.length < count && attempt < budget; attempt++) {
    const tag = `${cuts.length}-${attempt}`;
    const pool = nodes.flatMap((_, index) =>
      splittable(index) ? [index] : [],
    );
    if (pool.length === 0) break;
    const weights = pool.map((index) => area(nodes[index].box) ** 1.2);
    const node = pool[choose(weights, roll(`${tag}-cell`))];
    const { box } = nodes[node];
    const preferred = lean(box, 1.25, `${tag}-axis`);
    const fits = extent(box, preferred) >= minSide * 2;
    const at = roll(`${tag}-at`);
    const fraction = at < 0.5 ? 0.28 + at * 0.34 : 0.55 + (at - 0.5) * 0.34;
    tryCut(node, fits ? preferred : other(preferred), fraction, true);
  }

  const byPriority = (a        , b        ) =>
    Number(a === anchor) - Number(b === anchor) ||
    area(nodes[b].box) - area(nodes[a].box);
  const fallback = () => {
    const pool = nodes.flatMap((node, index) =>
      node.line === -1 ? [index] : [],
    );
    pool.sort(byPriority);
    for (const strict of [true, false]) {
      for (const node of pool) {
        const { box } = nodes[node];
        const first                    =
          extent(box, "x") >= extent(box, "y") ? "x" : "y";
        for (const axis of [first, other(first)]) {
          for (const fraction of FALLBACK_CUTS) {
            if (tryCut(node, axis, fraction, strict)) return true;
          }
        }
      }
    }
    return false;
  };
  while (cuts.length < count) {
    if (!fallback()) break;
  }

  const trackKeys           = [];
  const lines = cuts.map((draft, id) => {
    const key = `${draft.axis}:${draft.position}`;
    if (!trackKeys.includes(key)) trackKeys.push(key);
    const { bounds } = nodes[draft.node];
    const vertical = draft.axis === "x";
    const near = vertical ? bounds.top : bounds.left;
    const far = vertical ? bounds.bottom : bounds.right;
    return {
      id,
      axis: draft.axis,
      position: draft.position,
      node: draft.node,
      track: trackKeys.indexOf(key),
      lowBound: vertical ? bounds.left : bounds.top,
      highBound: vertical ? bounds.right : bounds.bottom,
      fromEnd: near === far ? roll(`draw-${id}`) < 0.5 : far < near,
      start: LINE_START + id * LINE_GAP,
    };
  });

  const leaves = nodes.flatMap((node, index) =>
    node.line === -1 ? [index] : [],
  );
  const ranked = [...leaves].sort(
    (a, b) => area(nodes[b].box) - area(nodes[a].box) || a - b,
  );
  const pick = clamp(Math.round(finite(expandCell, 0)), 0, ranked.length - 1);
  const target = ranked[pick];
  const targetBox = nodes[target].box;

  const others = leaves.filter((index) => index !== target);
  const largest = Math.max(1, ...others.map((index) => area(nodes[index].box)));
  const candidates = others
    .map((index) => ({
      index,
      score:
        roll(`fill-${index}`) +
        (touches(nodes[index].box, targetBox) ? 0.45 : 0) +
        (0.3 * area(nodes[index].box)) / largest,
    }))
    .sort((a, b) => a.score - b.score);
  const painted                                               = [];
  const quota = Math.min(coloredCount(count), candidates.length);
  for (let order = 0; order < quota; order++) {
    const slot = SLOTS[order];
    const free = candidates.filter(
      ({ index }) => !painted.some((cell) => cell.index === index),
    );
    const clean = free.find(
      ({ index }) =>
        !painted.some(
          (cell) =>
            cell.slot === slot &&
            touches(nodes[cell.index].box, nodes[index].box),
        ) && !(slot === "red" && touches(nodes[index].box, targetBox)),
    );
    const choice = clean ?? free[0];
    if (choice) painted.push({ index: choice.index, slot });
  }

  const wipeOf = (index        )           => {
    const { box } = nodes[index];
    const axis = extent(box, "x") >= extent(box, "y") ? "x" : "y";
    const middle = axis === "x" ? box.x0 + box.x1 : box.y0 + box.y1;
    return { axis, fromEnd: middle < (axis === "x" ? w : h) };
  };
  const diagonal = (index        ) => {
    const { box } = nodes[index];
    return (box.x0 + box.x1) / w + (box.y0 + box.y1) / h;
  };
  const fills = [...painted]
    .sort((a, b) => diagonal(a.index) - diagonal(b.index))
    .map((cell, order) => ({
      node: cell.index,
      slot: cell.slot,
      ...wipeOf(cell.index),
      start: timeline.fill + order * FILL_GAP,
    }));
  const field = { node: target, ...wipeOf(target), start: timeline.field };

  const tracks = trackKeys.map((_, track) => {
    const members = lines.filter((line) => line.track === track);
    return {
      track,
      axis: members[0].axis,
      position: members[0].position,
      length: members.reduce(
        (sum, line) => sum + extent(nodes[line.node].box, other(line.axis)),
        0,
      ),
    };
  });
  const reserveLow = lines.map((line) => line.position);
  const reserveHigh = lines.map((line) => line.position);
  const limits = (track        ) => {
    let low = Number.NEGATIVE_INFINITY;
    let high = Number.POSITIVE_INFINITY;
    for (const line of lines) {
      if (line.track === track) {
        const size = line.axis === "x" ? w : h;
        const floor = line.lowBound === -1 ? 0 : reserveHigh[line.lowBound];
        const ceiling =
          line.highBound === -1 ? size : reserveLow[line.highBound];
        low = Math.max(low, floor + gap);
        high = Math.min(high, ceiling - gap);
      } else {
        if (line.lowBound !== -1 && lines[line.lowBound].track === track) {
          high = Math.min(high, reserveLow[line.id] - gap);
        }
        if (line.highBound !== -1 && lines[line.highBound].track === track) {
          low = Math.max(low, reserveHigh[line.id] + gap);
        }
      }
    }
    return { low, high };
  };
  const moves             = [];
  const settledAt = (track        , position        ) =>
    moves.find((move) => move.track === track)?.to ?? position;
  const borders = (side                   , track        ) => {
    const id = nodes[target].bounds[side];
    return id !== -1 && lines[id].track === track;
  };
  const inward = (track        ) => {
    if (borders("left", track) || borders("top", track)) return 1;
    if (borders("right", track) || borders("bottom", track)) return -1;
    return 0;
  };
  const heading = (track        , down        , up        ) => {
    const squeeze = inward(track);
    if (squeeze !== 0) {
      return (squeeze > 0 ? up : down) >= minMove ? squeeze : 0;
    }
    if (down < minMove) return up >= minMove ? 1 : 0;
    if (up < minMove) return -1;
    return roll(`track-way-${track}`) < up / (up + down) ? 1 : -1;
  };
  const order = tracks
    .map((track) => ({
      ...track,
      weight: track.length * (0.6 + 0.8 * roll(`track-${track.track}`)),
    }))
    .sort((a, b) => b.weight - a.weight);
  for (const track of order) {
    if (moves.length >= TRACK_COUNT) break;
    const { low, high } = limits(track.track);
    const down = (track.position - low) / (1 + RESERVE);
    const up = (high - track.position) / (1 + RESERVE);
    const direction = heading(track.track, down, up);
    if (direction === 0) continue;
    const span = track.axis === "x" ? w : h;
    const room = Math.min(direction > 0 ? up : down, span * 0.2);
    const stride = mix(0.6, 0.95, roll(`track-far-${track.track}`));
    const reach = track.position + direction * Math.max(minMove, room * stride);
    const nearest = tracks
      .filter((rival) => rival.axis === track.axis)
      .filter((rival) => rival.track !== track.track)
      .map((rival) => settledAt(rival.track, rival.position))
      .reduce(
        (best, position) =>
          Math.abs(position - reach) < Math.abs(best - reach) ? position : best,
        Number.POSITIVE_INFINITY,
      );
    const to = Math.abs(nearest - reach) < align ? nearest : reach;
    const margin = Math.abs(to - track.position) * RESERVE;
    if (
      Math.abs(to - track.position) < minMove ||
      to - margin < low ||
      to + margin > high
    ) {
      continue;
    }
    for (const line of lines) {
      if (line.track === track.track) {
        reserveLow[line.id] = Math.min(track.position, to) - margin;
        reserveHigh[line.id] = Math.max(track.position, to) + margin;
      }
    }
    moves.push({
      track: track.track,
      from: track.position,
      to,
      start: timeline.reflow + moves.length * TRACK_GAP,
    });
  }

  const settled = lines.map((line) => settledAt(line.track, line.position));
  const home = placeBoxes(lines, settled, w, h)[target];
  const travel                                    = {
    left: home.x0 + overscan,
    top: home.y0 + overscan,
    right: w + overscan - home.x1,
    bottom: h + overscan - home.y1,
  };
  const ranking = [...SIDES].sort((a, b) => travel[a] - travel[b]);
  const side = (name                   ) => {
    const across = name === "left" || name === "right" ? "x" : "y";
    const share = (extent(home, across) * DIP_SHARE) / travel[name];
    return {
      start: timeline.expand + ranking.indexOf(name) * SIDE_GAP,
      dip: nodes[target].bounds[name] === -1 ? 0 : Math.min(DIP, share),
    };
  };

  return {
    width: w,
    height: h,
    weight,
    minSide,
    gap,
    minMove,
    align,
    overscan,
    timeline,
    nodes,
    lines,
    leaves,
    target,
    fills,
    field,
    moves,
    sides: {
      left: side("left"),
      top: side("top"),
      right: side("right"),
      bottom: side("bottom"),
    },
  };
}

                                                                     

function getMondrianSplitState(
  frame        ,
  layout                      = getMondrianSplitLayout(),
) {
  const time = Math.max(0, finite(frame, 0));
  const { width, height, weight, overscan } = layout;
  const positions = layout.lines.map((line) => {
    const move = layout.moves.find((item) => item.track === line.track);
    if (!move) return line.position;
    const amount = slide(progress(time, move.start, TRACK_SLIDE));
    return line.position + (move.to - move.from) * amount;
  });
  const boxes = placeBoxes(layout.lines, positions, width, height);
  const home = boxes[layout.target];
  const reach = (name                   ) => {
    const { start, dip } = layout.sides[name];
    return push(progress(time, start, SIDE_PUSH), dip);
  };
  const mapX = stretch(
    home.x0,
    home.x1,
    mix(home.x0, -overscan, reach("left")),
    mix(home.x1, width + overscan, reach("right")),
    -overscan,
    width + overscan,
  );
  const mapY = stretch(
    home.y0,
    home.y1,
    mix(home.y0, -overscan, reach("top")),
    mix(home.y1, height + overscan, reach("bottom")),
    -overscan,
    height + overscan,
  );
  const project = (box                  )                   => ({
    x0: mapX(box.x0),
    y0: mapY(box.y0),
    x1: mapX(box.x1),
    y1: mapY(box.y1),
  });

  const lines = layout.lines.flatMap((line) => {
    const drawn = drawEase(progress(time, line.start, LINE_DRAW));
    if (drawn <= 0) return [];
    const box = boxes[line.node];
    const vertical = line.axis === "x";
    const low = vertical ? box.y0 : box.x0;
    const high = vertical ? box.y1 : box.x1;
    const along = vertical ? mapY : mapX;
    const start = along(line.fromEnd ? high - (high - low) * drawn : low);
    const end = along(line.fromEnd ? high : low + (high - low) * drawn);
    const position = (vertical ? mapX : mapY)(positions[line.id]);
    const half = weight / 2;
    const length = end - start;
    const rect                    = vertical
      ? { x: position - half, y: start, width: weight, height: length }
      : { x: start, y: position - half, width: length, height: weight };
    return inFrame(rect, width, height)
      ? [{ id: line.id, axis: line.axis, position, drawn, ...rect }]
      : [];
  });

  const fills = layout.fills.flatMap((fill) => {
    const amount = wipeEase(progress(time, fill.start, FILL_WIPE));
    if (amount <= 0) return [];
    const rect = wipe(project(boxes[fill.node]), fill, amount);
    return inFrame(rect, width, height)
      ? [{ id: fill.node, slot: fill.slot, ...rect }]
      : [];
  });

  const reveal = wipeEase(progress(time, layout.field.start, FIELD_WIPE));
  const field = reveal > 0 ? wipe(project(home), layout.field, reveal) : null;

  return {
    time,
    lines,
    fills,
    field: field && inFrame(field, width, height) ? field : null,
    cells: layout.leaves.map((id) => ({ id, ...project(boxes[id]) })),
  };
}


// The full-site intro keeps the reference video's composition across viewport ratios.
// Scale rectangle coordinates independently, then restore uniform screen-space line weight.
// Page content uses its own HTML layout and is never stretched with the illustration.
function layoutForViewport(settings                 ,width       ,height       ,compositionAspectRatio        ){
  const fixed=typeof compositionAspectRatio==='number'&&Number.isFinite(compositionAspectRatio)&&compositionAspectRatio>0;
  return getMondrianSplitLayout({...settings,width:fixed?1280:width,height:fixed?1280/compositionAspectRatio:height});
}

function stateForViewport(frame       ,layout                    ,width=layout.width,height=layout.height,lineWidthPx        ){
  const state=getMondrianSplitState(frame,layout),sx=width/layout.width,sy=height/layout.height;
  // A CSS pixel override follows the page rule instead of scaling with the artwork.
  const weight=lineWidthPx??layout.weight*Math.min(width,height)/Math.min(layout.width,layout.height);
  const rect=                             (value  )=>({...value,x:value.x*sx,y:value.y*sy,width:value.width*sx,height:value.height*sy});
  return {...state,
    fills:state.fills.map(rect),field:state.field?rect(state.field):null,
    cells:state.cells.map(cell=>({...cell,x0:cell.x0*sx,x1:cell.x1*sx,y0:cell.y0*sy,y1:cell.y1*sy})),
    lines:state.lines.map(line=>{
      const scaled=rect(line),position=line.position*(line.axis==='x'?sx:sy);
      return {...scaled,position,...(line.axis==='x'?{x:position-weight/2,width:weight}:{y:position-weight/2,height:weight})};
    }),
  };
}

function getMondrianSplitClip(
  field                          ,
  width        ,
  height        ,
) {
  if (!field) return "inset(50%)";
  const top = percent(field.y, height);
  const right = percent(width - field.x - field.width, width);
  const bottom = percent(height - field.y - field.height, height);
  const left = percent(field.x, width);
  return `inset(${top} ${right} ${bottom} ${left})`;
}


 function contentPose(frame       ,layout                    ,settings                 ,reduced=false){
  // Overlap the final push with the page reveal so there is no empty white hold.
  const start=layout.timeline.end-6,fadeFrames=settings.revealMs*30/1000;
  const opacity=reduced?1:contentEase(progress(frame,start,fadeFrames));
  return {opacity,y:settings.rise*(1-opacity),done:reduced||frame>=Math.max(layout.timeline.end,start+fadeFrames),end:Math.max(layout.timeline.end,start+fadeFrames)};
 }
 // Hold the fully colored composition before any tracks start moving.
 function loadingFrame(layout                    ){return layout.timeline.reflow-1}
 function advanceClock(frame       ,delay       ,elapsedMs       ,settings                 ,runtime                ,layout                    ){
  const delta=Math.max(0,elapsedMs)*Math.max(0,runtime.speed)*Math.max(0,settings.speed);
  const waiting=Math.max(0,runtime.delayMs-delay),playing=Math.max(0,delta-waiting);
  const next=frame+playing*30/1000*5233/Math.max(80,runtime.durationMs||5233);
  return {frame:Math.min(next,runtime.loading?loadingFrame(layout):contentPose(0,layout,settings).end),delay:Math.min(runtime.delayMs,delay+delta)};
 }
 function mount(host            ,content            ,initial                 ,initialRuntime                ,resume                  ){
  let settings=initial,runtime=initialRuntime,width=320,height=230,layout=layoutForViewport(settings,width,height,runtime.compositionAspectRatio);
  const firstFrame=()=>runtime.startFilled?loadingFrame(layout):0;
  let lineWidthPx                 ,lineColorOverride                 ,pixelRatio=1;
  let frame=resume?.frame??firstFrame(),delay=resume?.delay??0,raf=0,last=0,destroyed=false,reported             =null,completed=false;
  const canvas=document.createElement('canvas'),lines=document.createElement('canvas');
  for(const [node,z] of [[canvas,1],[lines,3]]         ){node.setAttribute('aria-hidden','true');Object.assign(node.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:String(z)});host.append(node)}
  const ctx=canvas.getContext('2d') ,lineCtx=lines.getContext('2d') ;
  const oldHost={position:host.style.position,overflow:host.style.overflow,isolation:host.style.isolation};
  Object.assign(host.style,{position:'relative',overflow:'hidden',isolation:'isolate'});
  const savedContentStyle=content.getAttribute('style'),savedHidden=content.getAttribute('aria-hidden'),savedInert=content.inert;
  // Keep the real document in its final layout throughout the intro.
  Object.assign(content.style,{position:runtime.flow?'relative':'absolute',inset:runtime.flow?'auto':'0',zIndex:'2',willChange:'opacity,transform,clip-path'});
  const announce=(running        )=>{if(reported!==running){reported=running;runtime.onRunning?.(running)}};
  const holding=()=>runtime.loading&&frame>=loadingFrame(layout);
  function paint(){
   // The authored frame numbers are continuous time coordinates, not a display FPS cap.
   const current=runtime.poster?loadingFrame(layout):runtime.reduced?(runtime.loading?loadingFrame(layout):contentPose(0,layout,settings,true).end):frame;
   const gridFinished=current>=layout.timeline.end;
   const state=gridFinished?null:stateForViewport(current,layout,width,height,lineWidthPx),pose=contentPose(current,layout,settings,runtime.reduced&&!runtime.loading);
   const done=!runtime.loading&&!runtime.poster&&pose.done;
   if(runtime.reduced&&!runtime.loading&&!runtime.poster)frame=pose.end;
   host.dataset.mondrianFrame=current.toFixed(4);host.dataset.stage=runtime.poster?'poster':done?'complete':holding()?'waiting':current>=layout.timeline.expand?'revealing':current>=layout.timeline.reflow?'reflow':current>=layout.timeline.fill?'fill':'build';
   host.setAttribute('aria-busy',String(!done));
   // Once the grid is offscreen, only opacity/transform need updating on the compositor.
   if(!gridFinished&&state){
    // A completed page intro releases its backing stores. Replays allocate them
    // again only when a frame actually needs drawing.
    if(canvas.width===1&&canvas.height===1)sizeBuffers();
    ctx.clearRect(0,0,width,height);lineCtx.clearRect(0,0,width,height);
    ctx.fillStyle=runtime.paperColor??'#ffffff';ctx.fillRect(0,0,width,height);
    for(const fill of state.fills){ctx.fillStyle=settings[fill.slot==='red'?'redColor':fill.slot==='yellow'?'yellowColor':'blueColor'];ctx.fillRect(fill.x,fill.y,fill.width,fill.height)}
    if(state.field){ctx.fillStyle=settings.fieldColor;ctx.fillRect(state.field.x,state.field.y,state.field.width,state.field.height)}
    // Match CSS borders: opaque page ink with edges on physical pixel boundaries.
    // Use the current screen density so browser zoom does not soften the canvas.
    lineCtx.fillStyle=lineColorOverride??settings.lineColor;
    const pixel=(value       )=>Math.round(value*pixelRatio)/pixelRatio;
    for(const line of state.lines)lineCtx.fillRect(pixel(line.x),pixel(line.y),pixel(line.width),pixel(line.height));
   }
   const visible=!runtime.loading&&!runtime.poster&&pose.opacity>0;
   content.style.background=settings.fieldColor;content.style.opacity=visible?String(pose.opacity):'0';content.style.transform=`translateY(${pose.y}px)`;
   content.style.clipPath=gridFinished?'none':getMondrianSplitClip(state?.field??null,width,height);
   if(runtime.flow){content.style.position='relative';content.style.inset='auto';content.style.willChange=done?'auto':'opacity,transform,clip-path';if(done)content.style.transform='none';host.style.overflow=done?'visible':'hidden';host.style.isolation=done?'auto':'isolate'}
   content.style.pointerEvents=done?'auto':'none';content.inert=!done;content.setAttribute('aria-hidden',String(!done));
   canvas.style.display=lines.style.display=gridFinished?'none':'block';
   if(done&&!completed){completed=true;if(runtime.flow)for(const node of [canvas,lines]){node.width=1;node.height=1}runtime.onComplete?.()}
   announce(!done&&!holding()&&!runtime.poster&&!runtime.reduced&&settings.speed>0);
  }
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0;last=0}
  function request(){if(!destroyed&&!raf&&runtime.enabled&&!runtime.paused&&!runtime.reduced&&!runtime.poster&&settings.speed>0&&runtime.speed>0&&!document.hidden&&!completed&&!holding()){last=performance.now();raf=requestAnimationFrame(tick)}}
  function tick(now       ){raf=0;if(destroyed)return;const next=advanceClock(frame,delay,now-last,settings,runtime,layout);last=now;frame=next.frame;delay=next.delay;
   paint();if(!completed&&!holding())raf=requestAnimationFrame(tick);
  }
  function sizeBuffers(){const dpr=window.devicePixelRatio||1;pixelRatio=dpr;for(const node of [canvas,lines]){node.width=Math.max(1,Math.round(width*dpr));node.height=Math.max(1,Math.round(height*dpr))}ctx.setTransform(dpr,0,0,dpr,0,0);lineCtx.setTransform(dpr,0,0,dpr,0,0)}
  function resize(){if(completed&&runtime.flow)return;const r=host.getBoundingClientRect();if(!r.width||!r.height)return;width=r.width;height=r.height;const rule=runtime.lineWidthSelector?host.querySelector(runtime.lineWidthSelector):null;const ruleStyle=rule?getComputedStyle(rule):null;const cssWidth=ruleStyle?parseFloat(ruleStyle.borderBottomWidth):runtime.lineWidthCssVar?parseFloat(getComputedStyle(host).getPropertyValue(runtime.lineWidthCssVar)):NaN;lineColorOverride=ruleStyle?.borderBottomColor;lineWidthPx=Number.isFinite(cssWidth)&&cssWidth>0?cssWidth*(Number.isFinite(runtime.lineWidthScale)&&runtime.lineWidthScale >0?runtime.lineWidthScale :1):undefined;layout=layoutForViewport(settings,width,height,runtime.compositionAspectRatio);sizeBuffers();paint()}
  function visibility(){stop();request()}
  const observer=new ResizeObserver(resize);observer.observe(host);document.addEventListener('visibilitychange',visibility);resize();paint();request();
  return {
   snapshot()                 {return raf?advanceClock(frame,delay,performance.now()-last,settings,runtime,layout):{frame,delay}},
   update(next                 ,nextRuntime                ){const restart=JSON.stringify(settings)!==JSON.stringify(next)||runtime.delayMs!==nextRuntime.delayMs||runtime.durationMs!==nextRuntime.durationMs||runtime.poster!==nextRuntime.poster||runtime.startFilled!==nextRuntime.startFilled||runtime.compositionAspectRatio!==nextRuntime.compositionAspectRatio||(!runtime.loading&&nextRuntime.loading);settings=next;runtime=nextRuntime;if(restart){delay=0;completed=false;layout=layoutForViewport(settings,width,height,runtime.compositionAspectRatio);frame=firstFrame()}stop();paint();request()},
   replay(){stop();frame=firstFrame();delay=0;completed=false;paint();request()},
   destroy(){destroyed=true;stop();observer.disconnect();document.removeEventListener('visibilitychange',visibility);canvas.remove();lines.remove();Object.assign(host.style,oldHost);host.removeAttribute('aria-busy');if(savedContentStyle===null)content.removeAttribute('style');else content.setAttribute('style',savedContentStyle);content.inert=savedInert;if(savedHidden===null)content.removeAttribute('aria-hidden');else content.setAttribute('aria-hidden',savedHidden);runtime.onRunning?.(false)},
  };
 }
 return {layout:getMondrianSplitLayout,state:getMondrianSplitState,layoutForViewport,stateForViewport,clip:getMondrianSplitClip,timeline:getMondrianSplitTimeline,contentPose,advanceClock,mount};
}
export const mondrianEngine=createMondrianEngine();
export const mondrianEngineCode='const mondrianEngine = ((__name) => ('+createMondrianEngine.toString()+'))((fn) => fn)();';
