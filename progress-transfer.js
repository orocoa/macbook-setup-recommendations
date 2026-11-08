(() => {
  if(!location.hash.startsWith("#macsetup-progress="))return;
  const raw=location.hash.slice("#macsetup-progress=".length);
  history.replaceState(history.state,"",location.pathname+location.search);
  const en=new URL(location.href).searchParams.get("lang")==="en" || location.pathname.startsWith("/en/");
  import("./progress-contract.js").then(({validateTransfer,mergeProgress})=>{
    let value;try{value=validateTransfer(raw);}catch{return;}
    const dialog=document.createElement("dialog");dialog.className="progress-dialog";
    const heading=document.createElement("h2");heading.textContent=en?"Import previous progress":"导入旧站进度";
    const detail=document.createElement("p");detail.textContent=en?`Import ${value.completed.length} handled recommendations? Existing checked items will be kept. This does not change Mac settings.`:`导入 ${value.completed.length} 项已处理记录？当前已勾选的项目会保留；这不会修改 Mac 设置。`;
    const accept=document.createElement("button");accept.textContent=en?"Import":"导入";
    const cancel=document.createElement("button");cancel.textContent=en?"Cancel":"取消";
    dialog.append(heading,detail,accept,cancel);document.body.append(dialog);
    cancel.onclick=()=>dialog.close();dialog.addEventListener("close",()=>dialog.remove());
    accept.onclick=()=>{try{let old={};try{old=JSON.parse(localStorage.getItem("mac-setup-completed-v1"))||{};}catch{}
      localStorage.setItem("mac-setup-completed-v1",JSON.stringify(mergeProgress(old,value.completed)));
      if(value.language)localStorage.setItem("mac-setup-language-v1",value.language);
      const target=new URL(location.href);if(value.language)target.searchParams.set("lang",value.language);location.replace(target.href);
    }catch{detail.textContent=en?"Browser storage is unavailable. Your old records are still on the previous site.":"当前浏览器无法保存进度；旧记录仍保留在原站。";}};
    dialog.showModal();
  }).catch(()=>{});
})();
