from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import json
import time
import os

# 設定絕對路徑
folder_path = r"D:\台灣失業人口"
chrome_driver_path = os.path.join(folder_path, "chromedriver.exe")
output_json = os.path.join(folder_path, "data.json")

# 啟動瀏覽器
service = Service(chrome_driver_path)
driver = webdriver.Chrome(service=service)

# 開啟網站
driver.get("https://www.stat.gov.tw/Point.aspx?sid=t.3&n=3582&sms=11480")

# ✅ 等待「失業率」文字出現在頁面
WebDriverWait(driver, 15).until(
    EC.presence_of_element_located((By.XPATH, "//*[contains(text(), '失業率')]"))
)

# 抓渲染後的 HTML
soup = BeautifulSoup(driver.page_source, "html.parser")
driver.quit()

# 搜尋資料
data = {
    "unemployment_rate": "無資料",
    "seasonal_adjusted": "無資料",
    "unemployed_thousands": "無資料",
    "employed_thousands": "無資料",
    "participation_rate": "無資料"
}

for tr in soup.find_all("tr"):
    tds = tr.find_all("td")
    if not tds or len(tds) < 2:
        continue
    title = tds[0].text.strip()
    value = tds[1].text.strip().split("（")[0]
    # 失業率
    if "失業率" in title and "季節" not in title:
        data["unemployment_rate"] = value
    # 失業率(經季節調整後)
    elif "失業率" in title and "季節" in title:
        data["seasonal_adjusted"] = value
    # 失業人數
    elif "失業人數" in title:
        data["unemployed_thousands"] = value
    # 就業人數
    elif "就業人數" in title:
        data["employed_thousands"] = value
    # 勞動力參與率
    elif "勞動力參與率" in title:
        data["participation_rate"] = value

with open(output_json, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False)

print("✅ 成功擷取失業率：", data)
print("📁 已儲存至：", output_json)
