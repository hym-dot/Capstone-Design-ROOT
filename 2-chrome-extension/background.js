// 1. 탐지 규칙 정의
const BLACKLIST = ['phishing-site.html'];
const SUSPICIOUS_KEYWORDS = ['login', 'secure', 'account', 'bank'];

// 2. URL 분석 함수
function analyzeUrl(url) {
  for (const malicious of BLACKLIST) {
    if (url.includes(malicious)) {
      return { status: 'phishing', reason: `블랙리스트 항목 포함: ${malicious}` };
    }
  }
  if (!url.startsWith('file://')) {
    let suspiciousCount = 0;
    for (const keyword of SUSPICIOUS_KEYWORDS) {
      if (url.includes(keyword)) suspiciousCount++;
    }
    if (suspiciousCount >= 2) {
      return { status: 'suspicious', reason: `의심 키워드 (${suspiciousCount}개) 포함` };
    }
  }
  return { status: 'safe', reason: '안전한 페이지입니다.' };
}

// 3. 페이지 이동 감지 및 로직 실행
chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId === 0) {
    const analysisResult = analyzeUrl(details.url);
    chrome.storage.local.set({ [details.tabId]: analysisResult });
    updateIcon(details.tabId, analysisResult.status);

    if (analysisResult.status === 'phishing') {
      chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL('blocked.html') });
    }
  }
});

// 4. 아이콘 상태 업데이트 함수
function updateIcon(tabId, status) {
  const iconPaths = {
    safe: 'images/icon48.png',
    suspicious: 'images/icon48.png',
    phishing: 'images/icon48-danger.png'
  };
  const badgeTexts = {
    safe: '',
    suspicious: '!',
    phishing: 'X'
  };
  const badgeColors = {
    safe: '#4CAF50',
    suspicious: '#FFC107',
    phishing: '#F44336'
  };

  chrome.action.setIcon({ tabId: tabId, path: iconPaths[status] || iconPaths.safe });
  chrome.action.setBadgeText({ tabId: tabId, text: badgeTexts[status] || '' });
  chrome.action.setBadgeBackgroundColor({ tabId: tabId, color: badgeColors[status] || badgeColors.safe });
}

// 탭이 닫힐 때 저장된 정보 삭제
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove(tabId.toString());
});