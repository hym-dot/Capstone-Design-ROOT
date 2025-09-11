import { blacklist, keywords, patterns } from "./rules.js";

// URL이 피싱인지 검사
function isPhishing(url) {
  if (blacklist.some(domain => url.includes(domain))) return true;
  if (keywords.some(word => url.includes(word))) return true;
  if (patterns.some(regex => regex.test(url))) return true;
  return false;
}

// 경고창 표시
async function showWarning(url) {
  if (document.getElementById("phishing-warning")) return;

  const res = await fetch(chrome.runtime.getURL("warning.html"));
  const html = await res.text();
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  document.getElementById("currentUrl").textContent += url;
  document.getElementById("exitBtn").onclick = () => {
    document.body.innerHTML = "<h1 style='text-align:center; margin-top:50px;'>사이트 접속이 차단되었습니다!</h1>";
  };
}

// 실제 검사 실행
if (isPhishing(window.location.href)) {
  showWarning(window.location.href);
} else {
  // 안전한 사이트면 화면 상단에 메시지 표시
  const safeDiv = document.createElement("div");
  safeDiv.textContent = "✅ 안전한 사이트입니다.";
  safeDiv.style.position = "fixed";
  safeDiv.style.top = "0";
  safeDiv.style.left = "0";
  safeDiv.style.width = "100%";
  safeDiv.style.background = "green";
  safeDiv.style.color = "white";
  safeDiv.style.textAlign = "center";
  safeDiv.style.padding = "5px";
  safeDiv.style.zIndex = "9999";
  document.body.appendChild(safeDiv);
}
