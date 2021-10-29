from bs4 import BeautifulSoup
from selenium import webdriver
import time
import sys

sys.path.append(r"C:\Users\stagiaire.PORT-20B-11.000\Documents\amazon-api")

from addToJson import addToJSON

query = input("Que voulez vous ajouter comme articles ? ")

url = f'https://www.amazon.fr/s?k={query}'

driver = None

try:
    driver = webdriver.Chrome('./chromedriver')
except:
    driver = webdriver.Chrome('./amazon scrapping/chromedriver')

driver.get(url)

time.sleep(1)

soup = BeautifulSoup(driver.page_source, features="html.parser")

catalog_div = soup.find(class_='s-matching-dir').find(class_="sg-col-inner").find_all("span")[2].findChildren(recursive=False)[1].find_all(class_="s-result-item")

for product_div in catalog_div:
    try:
        nom = product_div.find("h2").text
        prix_str = product_div.find(class_='a-offscreen').text

        name = nom.strip()
        price = float(prix_str.replace('€', "").replace("\u00a0", "").replace('\u202f', "").replace(",", "."))

        image_url = product_div.find("img")['src']

        print(name)
        print(price)
        print(image_url)

        addToJSON(name, price, image_url)
    except:
        pass