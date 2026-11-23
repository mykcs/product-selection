const button=document.getElementById('copy');
const context=document.getElementById('context');
const status=document.getElementById('status');
if(button&&context&&status){
  button.hidden=false;
  button.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(context.value);status.textContent='已复制通用阅读上下文。';}
    catch{context.focus();context.select();status.textContent='自动复制不可用；已选中文本，请手动复制。';}
  });
}
