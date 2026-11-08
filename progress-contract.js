export const IDS = ["finder-path-bar", "finder-show-all-file-extensions", "trackpad-tap-to-click", "trackpad-tracking-speed", "dock-hide-suggested-recent-apps", "dock-minimize-windows-into-application-icon", "hot-corners-desktop-and-display-sleep", "menu-bar-customize-controls", "finder-keep-folders-on-top", "finder-customize-toolbar", "keyboard-switch-input-source-by-document", "apple-watch-auto-unlock", "trackpad-three-finger-drag", "mos-separate-mouse-scroll-direction", "keyboard-shortcuts-quick-actions"];
export function validateTransfer(raw) {
  if(typeof raw!=="string" || raw.length>4096) throw new Error("Invalid transfer");
  const value=JSON.parse(decodeURIComponent(raw));
  if(!value || Array.isArray(value) || value.version!==1 || !Array.isArray(value.completed) || value.completed.length>15 || value.completed.some(id=>!IDS.includes(id)) || ![null,"zh-CN","en"].includes(value.language)) throw new Error("Invalid transfer");
  return {completed:[...new Set(value.completed)],language:value.language};
}
export function mergeProgress(existing, imported) {
  const next={}; for(const id of IDS) if(existing?.[id]===true || imported.includes(id)) next[id]=true;
  return next;
}
