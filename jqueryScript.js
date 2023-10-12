$(document).ready(function () {
  var urunler = [];
  $.ajax({
    type: "GET",
    url: "https://dummyjson.com/products",
    dataType: "json",
    success: function (data) {
      // console.log(data);
      urunler = data.products;
      urunleriGoster(urunler);
      kategorileriGoster();
    },
  });

  /********************************************************************************************* */

  $("#allProducts").click(function (e) {
    e.preventDefault();
    urunleriGoster(urunler);
  });

  /********************************************************************************************* */

  function urunleriGoster(urunler) {
    $("#productList").empty();
    $.each(urunler, function (_, urun) {
      //   console.log(urun);
      const urunCard = $("<div>").addClass("col-lg-3 col-md-4 col-sm-12 mt-5")
        .html(`
                     <div class="card">
                         <img src="${urun.thumbnail}" class="card-img-top" style="height: 200px;" alt="...">
                         <div class="card-body" style="background-color: antiquewhite;">
                             <h5 class="card-title text-truncate">${urun.title}</h5>
                             <p class="card-text">${urun.price} $</p>
                             <button class="btn btn-success btn-add-to-cart" data-id="${urun.id}">Sepete Ekle</button>
                         </div>
                     </div>
               `);
      $("#productList").append(urunCard);
    });

    $(document).on("click", ".btn-add-to-cart", function () {
      const urunId = $(this).data("id");
      const secilenUrun = urunler.find((urun) => urun.id === urunId);
      // console.log(secilenUrun);
      urunuSepeteEkle(secilenUrun);
    });
  }

  /********************************************************************************************* */

  var sepet = [];
  function urunuSepeteEkle(secilenUrun) {
    // console.log(secilenUrun);

    if (sepet.includes(secilenUrun)) {
      secilenUrun.quantity++;
    } else {
      secilenUrun.quantity = 1;
      sepet.push(secilenUrun);
    }
    // console.log(secilenUrun.quantity);
    sepetiGoster();
    sepetMiktari();
  }

  /********************************************************************************************* */

  function sepetiGoster() {
    $("#sepetListesi").empty();
    $.each(sepet, function (_, urun) {
      const sepetCard = $("<div>").addClass(
        "d-flex justify-content-between align-items-center mb-2"
      ).html(`
              <div class="d-flex align-items-center">
                  <img src=${urun.thumbnail} alt=${urun.title} width="100px" height="100px"/>
                  <div class="ms-3" >
                    <p>${urun.title}</p>
                    <p>Fiyat: ${urun.price}</p>
                    <p>Miktar: ${urun.quantity}</p>
                  </div>
              </div>
              <button class="btn btn-danger btn-remove-from-cart" data-id="${urun.id}">Kaldır</button>
      `);
      $("#sepetListesi").append(sepetCard);
    });
    let toplam = sepet.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    $("#toplamFiyat").text(toplam);
    $(document).on("click", ".btn-remove-from-cart", function () {
      const silinecekId = $(this).data("id");
      sepettenUrunSilme(silinecekId);
      sepetiGoster();
    });
  }

  /********************************************************************************************* */

  function sepetMiktari() {
    let sepetMiktar = 0;
    for (let i of sepet) {
      sepetMiktar += i.quantity;
    }
    $("#sepetMiktar").text(sepetMiktar);
  }

  /********************************************************************************************* */

  function sepettenUrunSilme(silinecekId) {
    const indexNo = sepet.findIndex((urun) => urun.id === silinecekId);
    if (indexNo !== -1) {
      sepet.splice(indexNo, 1);
      sepetMiktari();
    }
  }

  /********************************************************************************************* */

  function kategorileriGoster() {
    let kategoriler = new Set();
    for (let urun of urunler) {
      kategoriler.add(urun.category);
      // console.log(kategoriler);
    }
    for (let kategori of kategoriler) {
      const kategoriListesi = $("<li>")
        .addClass("list-group-item mx-2 tiklaGelsin")
        .css({
          "background-color": "antiquewhite",
          "border-radius": "5px",
          cursor: "pointer",
        })
        .text(kategori);
      $("#categoryList").append(kategoriListesi);
    }
    $(document).on("click", ".tiklaGelsin", function () {
      let tiklananKategori = $(this).text();
      let secilenKategori = urunler.filter(
        (urun) => urun.category === tiklananKategori
      );
      urunleriGoster(secilenKategori);
    });
  }

  /********************************************************************************************* */

  $("#searchButton").click(function (e) {
    e.preventDefault();
    const inputDegeri = $("#searchInput").val().toLowerCase();
    const arananDeger = urunler.filter(
      (urun) =>
        urun.title.toLowerCase().includes(inputDegeri) ||
        urun.description.includes(inputDegeri)
    );
    urunleriGoster(arananDeger);
  });
});
