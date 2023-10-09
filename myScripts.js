const API_URL = "https://dummyjson.com/products";
const urunListesi = document.querySelector("#productList");
const kategoriListesi = document.querySelector("#categoryList");
const searchButton = document.querySelector("#searchButton");
const searchInput = document.querySelector("#searchInput");
var urunler = [];
var sepet = [];
fetch(API_URL)
  .then((resp) => resp.json())
  .then((data) => {
    urunler = data.products;
    urunleriGoster(urunler);
    kategorileriGoster();
  });

/**************************************************************************************************** */

const tumUrunler = document.querySelector("#allProducts");
tumUrunler.addEventListener("click", () => {
  urunleriGoster(urunler);
});

function urunleriGoster(urunler) {
  urunListesi.innerHTML = "";
  urunler.map((urun) => {
    const card = document.createElement("div");
    card.classList.add("col-lg-3", "col-md-4", "col-sm-12", "mt-5");
    card.innerHTML = `
                  <div class="card" style="width: 18rem;">
                     <img src="${urun.thumbnail}" class="card-img-top" style="height: 200px;" alt="...">
                     <div class="card-body">
                         <h5 class="card-title text-truncate">${urun.title}</h5>
                         <p class="card-text">${urun.price} $</p>
                         <button class="btn btn-success btn-add-to-cart" data-id="${urun.id}">Sepete Ekle</button>
                     </div>
                  </div>`;
    urunListesi.append(card);
    const sepeteEkleButon = card.querySelector(".btn-add-to-cart");
    sepeteEkleButon.addEventListener("click", () => {
      const urunId = parseInt(sepeteEkleButon.getAttribute("data-id"));
      const secilenUrun = urunler.find((p) => p.id === urunId);
      urunuSepeteEkle(secilenUrun);
    });
  });
}

var sepet = [];
function urunuSepeteEkle(urun) {
  const sepettekiUrun = sepet.find((i) => i.id === urun.id);
  // console.log(sepettekiUrun);
  if (sepettekiUrun) {
    sepettekiUrun.quantity++;
  } else {
    urun.quantity = 1;
    sepet.push(urun);
  }
  sepetiGoster();
  sepetMiktari();
}
const sepetMiktar = document.querySelector("#sepetMiktar");
function sepetMiktari() {
  var toplamMiktar = 0;
  for (var i of sepet) {
    toplamMiktar += i.quantity;
  }
  sepetMiktar.textContent = toplamMiktar;
  // console.log(sepetMiktar);
}

function sepetiGoster() {
  const sepetListesi = document.querySelector("#sepetListesi");
  const toplamFiyat = document.querySelector("#toplamFiyat");
  sepetListesi.innerHTML = "";
  sepet.forEach((urun) => {
    const sepeticerigi = document.createElement("div");
    sepeticerigi.classList.add(
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "mb-2"
    );
    sepeticerigi.innerHTML = `
    <div class="d-flex align-items-center">
      <img src=${urun.thumbnail} alt=${urun.title} width="100px" height="100px"/>
      <div class="ms-3" >
        <p>${urun.title}</p>
        <p>Fiyat: ${urun.price}</p>
        <p>Miktar: ${urun.quantity}</p>
      </div>
    </div>
    <button class="btn btn-danger btn-remove-from-cart" data-id="${urun.id}">Kaldır</button>
    `;
    sepetListesi.append(sepeticerigi);

    const silmeButon = sepeticerigi.querySelector(".btn-remove-from-cart");
    silmeButon.addEventListener("click", () => {
      const silinecekId = parseInt(silmeButon.getAttribute("data-id"));
      // console.log(silinecekId);
      sepettenUrunSilme(silinecekId);
      sepetiGoster();
    });
  });
  const toplam = sepet.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
  toplamFiyat.textContent = toplam;
}

function sepettenUrunSilme(silinecekId) {
  const indexNo = sepet.findIndex((urun) => urun.id === silinecekId);
  if (indexNo !== -1) {
    sepet.splice(indexNo, 1);
    sepetMiktari();
  }
}

/**************************************************************************************************** */

function kategorileriGoster() {
  const kategoriler = [];
  urunler.forEach((kategori) => {
    if (!kategoriler.includes(kategori.category)) {
      kategoriler.push(kategori.category);
    }
  });
  kategoriler.forEach((k) => {
    let kategoriList = document.createElement("li");
    kategoriList.classList.add("list-group-item");
    kategoriList.textContent = k;
    kategoriListesi.append(kategoriList);

    kategoriList.addEventListener("click", () => {
      const filterUrun = urunler.filter((u) => u.category === k);
      urunleriGoster(filterUrun);
    });
  });
}

/**************************************************************************************************** */

searchButton.addEventListener("click", searchUrun);
function searchUrun() {
  const searchItem = searchInput.value.toLowerCase().trim();
  const filterUrun2 = urunler.filter(
    (x) =>
      x.title.toLowerCase().includes(searchItem) ||
      x.description.includes(searchItem)
  );
  urunleriGoster(filterUrun2);
}
