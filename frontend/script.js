// 간단한 룰셋 (프론트엔드에서만 사용)
const blacklist = ["phishingsite.com", "malicious-login.net"];
const keywords = ["login-verification", "secure-update", "banking"];
const patterns = [/free-\w+-gift/i, /verify-\w+-account/i];

document.getElementById("checkBtn").addEventListener("click", () => {
    const url = document.getElementById("urlInput").value;
    let isPhishing = false;

    // 블랙리스트 검사
    if (blacklist.some(domain => url.includes(domain))) {
        isPhishing = true;
    }
    // 키워드 검사
    if (!isPhishing && keywords.some(word => url.includes(word))) {
        isPhishing = true;
    }
    // 패턴 검사
    if (!isPhishing && patterns.some(regex => regex.test(url))) {
        isPhishing = true;
    }

    const warning = document.getElementById("warning");
    if (isPhishing) {
        warning.classList.remove("hidden");
    } else {
        alert("✅ 안전한 사이트입니다!");
    }
});

document.getElementById("closeBtn").addEventListener("click", () => {
    document.getElementById("warning").classList.add("hidden");
});
