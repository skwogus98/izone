import time 
from selenium import webdriver
 
options = webdriver.ChromeOptions()
 
#options.add_argument('headless')
#options.add_argument("disable-gpu")
 
options.add_argument('window-size=1920x1080') 
options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36")
 
 
 
#chrome_options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36")
 
 
driver = webdriver.Chrome('driver/chromedriver',options=options) #크롬버젼과 맞는걸로

driver.get("https://m.dcinside.com/auth/login?r_url=https%3A%2F%2Fm.dcinside.com")

time.sleep(3)

driver.find_element_by_name('user_id').send_keys(u'testizone')#닉네임
 
driver.implicitly_wait(1)

time.sleep(2)

 
driver.find_element_by_name('user_pw').send_keys(u'mswallow9*8')#비밀번호
 
time.sleep(3) 

driver.find_element_by_id("login_ok").click()

driver.get("https://gall.dcinside.com/board/lists/?id=top12") #갤러리 목록 주소

driver.implicitly_wait(3)
 
time.sleep(3)
 
driver.get("https://gall.dcinside.com/board/write/?id=top12") #갤러리 글쓰기 주소
 
time.sleep(3)
 
 
driver.find_element_by_name('subject').send_keys(u'테스트중')#제목
 
 
 
driver.implicitly_wait(1)
 
time.sleep(30)
 
 
 
driver.switch_to_frame(driver.find_element_by_xpath("//iframe[@name='tx_canvas_wysiwyg']"))
 
time.sleep(1)
 
 
 
 
 
driver.find_element_by_tag_name("body").send_keys(u"ㅎㅇㅎㅇ")
 
time.sleep(1),
 
 
 
#글등록
 
driver.switch_to_default_content()
 
time.sleep(30),
 
 
 
 
 
driver.find_element_by_css_selector('.btn_blue.btn_svc.write').click()
