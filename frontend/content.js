import { blacklist, keywords, patterns } from "./rules.js";

// 현재 탭 URL 검사
function isPhishing(url) {
    if (blacklist.some(domain => url.includes(domain))) return true;
    if (keywords.some(word => url.includes(word))) return true;
    if (patterns.some(regex => regex.test(url))) return true;
    return false;
}

// 위험 시 경고 UI 생성
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
    console.log("✅ 안전한 사이트입니다:", window.location.href);
}
