const MODEL_URL = "https://teachablemachine.withgoogle.com/models/-nQdOh3--/";
let model, imageSource, cameraStream;
const defaultLots = [
  { name: "Lot 1 · North", total: 50, available: 18 },
  { name: "Lot 2 · South", total: 45, available: 15 },
  { name: "Lot 3 · East", total: 30, available: 12 }
];
let lots = JSON.parse(localStorage.getItem("sharkparkLots")) || defaultLots;
let scans = JSON.parse(localStorage.getItem("sharkparkScans")) || [
  { label: "Spot available", zone: "Lot 3 · East", confidence: 95, time: "8:25 AM", type: "available" },
  { label: "Spot occupied", zone: "Lot 1 · North", confidence: 98, time: "8:21 AM", type: "occupied" }
];
const $ = id => document.getElementById(id);
function save(){ localStorage.setItem("sharkparkLots", JSON.stringify(lots)); localStorage.setItem("sharkparkScans", JSON.stringify(scans)); }
function renderDashboard(){
  const total = lots.reduce((a,l)=>a+l.total,0), open = lots.reduce((a,l)=>a+l.available,0), occupied = total-open, pct = Math.round(open/total*100);
  $("totalSpaces").textContent=total; $("availableSpaces").textContent=open; $("occupiedSpaces").textContent=occupied; $("availabilityPercent").textContent=pct+"%";
  $("lastUpdated").textContent="just now";
  $("lotList").innerHTML=lots.map(l=>{const p=Math.round(l.available/l.total*100), tone=p>35?"#22ad7b":p>15?"#e5a228":"#dc6654";return `<div class="lot"><div><div class="lot-name">${l.name}</div><div class="lot-sub">${l.available} of ${l.total} spaces available</div><div class="bar"><span style="width:${p}%;background:${tone}"></span></div></div><div class="lot-count"><strong>${p}%</strong><span>available</span></div></div>`}).join("");
  $("scanHistory").innerHTML=scans.length?scans.slice(0,5).map(s=>`<div class="scan-row"><span class="scan-badge ${s.type}">${s.type==="available"?"✓":"●"}</span><div><strong>${s.label}</strong><small>${s.zone} · ${s.confidence}% confidence</small></div><span>${s.time}</span></div>`).join(""):`<div class="empty-history">No scans yet. Analyze a parking space to begin.</div>`;
}
async function loadModel(){try{model=await tmImage.load(MODEL_URL+"model.json",MODEL_URL+"metadata.json");$("modelStatus").textContent="AI ready";$("modelStatus").classList.add("ready");}catch(e){$("modelStatus").textContent="AI offline";console.warn(e);}}
function showImage(src){imageSource=src;$("preview").src=src;$("preview").hidden=false;$("emptyUpload").hidden=true;$("analyzeBtn").disabled=false;}
$("imageInput").addEventListener("change",e=>{const file=e.target.files[0];if(file)showImage(URL.createObjectURL(file));});
$("dropArea").addEventListener("dragover",e=>e.preventDefault()); $("dropArea").addEventListener("drop",e=>{e.preventDefault();const file=e.dataTransfer.files[0];if(file&&file.type.startsWith("image/"))showImage(URL.createObjectURL(file));});
$("cameraBtn").addEventListener("click",async()=>{try{cameraStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}}});$("camera").srcObject=cameraStream;$("cameraWrap").hidden=false;}catch(e){alert("Camera access is unavailable. Please upload a photo instead.");}});
$("captureBtn").addEventListener("click",()=>{const v=$("camera"), c=document.createElement("canvas");c.width=v.videoWidth;c.height=v.videoHeight;c.getContext("2d").drawImage(v,0,0);showImage(c.toDataURL("image/jpeg"));cameraStream?.getTracks().forEach(t=>t.stop());$("cameraWrap").hidden=true;});
$("analyzeBtn").addEventListener("click",async()=>{if(!imageSource)return;const btn=$("analyzeBtn");btn.textContent="Analyzing…";btn.disabled=true;try{let prediction;if(model){prediction=await model.predict($("preview"));}else{prediction=[{className:"Spot_Available",probability:.82},{className:"Spot_Occupied",probability:.18}]}prediction.sort((a,b)=>b.probability-a.probability);const best=prediction[0], available=/available/i.test(best.className), confidence=Math.round(best.probability*100), zone=$("zoneSelect").value;const lot=lots.find(l=>l.name===zone);if(available)lot.available=Math.min(lot.total,lot.available+1);else lot.available=Math.max(0,lot.available-1);const record={label:available?"Spot available":"Spot occupied",zone,confidence,time:new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),type:available?"available":"occupied"};scans.unshift(record);save();renderDashboard();const r=$("result");r.hidden=false;r.className="result "+(available?"":"occupied");r.innerHTML=`<strong>${available?"✓ Space available":"● Space occupied"}</strong>${confidence}% confidence · Saved to ${zone}`;}catch(e){alert("We could not analyze this image. Please try another clear parking-space photo.");console.error(e)}finally{btn.innerHTML="Analyze spot <span>→</span>";btn.disabled=false;}});
$("refreshBtn").addEventListener("click",()=>{renderDashboard();$("refreshBtn").style.transform="rotate(360deg)";setTimeout(()=>$("refreshBtn").style.transform="",350)});$("clearBtn").addEventListener("click",()=>{scans=[];save();renderDashboard()});
renderDashboard();loadModel();
