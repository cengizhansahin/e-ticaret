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
  $("#allProducts").click(function (e) {
    e.preventDefault();
    urunleriGoster(urunler);
  });

  function urunleriGoster(urunler) {
    $("#productList").empty();
    $.each(urunler, function (_, urun) {
      //   console.log(urun);
      const urunCard = $("<div>").addClass("col-lg-3 col-md-4 col-sm-12 mt-5")
        .html(`
                     <div class="card" style="width: 18rem;">
                         <img src="${urun.thumbnail}" class="card-img-top" style="height: 200px;" alt="...">
                         <div class="card-body">
                             <h5 class="card-title text-truncate">${urun.title}</h5>
                             <p class="card-text">${urun.price} $</p>
                             <button class="btn btn-success btn-add-to-cart" data-id="${urun.id}">Sepete Ekle</button>
                         </div>
                     </div>
               `);
      $("#productList").append(urunCard);
    });
    $(".btn-add-to-cart").on("click", function () {
      const urunId = $(this).data("id");
      const secilenUrun = urunler.find((urun) => urun.id === urunId);
      // console.log(secilenUrun);
      urunuSepeteEkle(secilenUrun);
    });
  }

  var sepet = [];
  function urunuSepeteEkle(secilenUrun) {
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
  function sepetMiktari() {
    let sepetMiktar = 0;
    for (let i of sepet) {
      sepetMiktar += i.quantity;
    }
    $("#sepetMiktar").text(sepetMiktar);
  }
  function sepetiGoster() {
    $("#sepetListesi").empty();
    $.each(sepet, function (_, urun) {
      let sepetCard = $("<div>").addClass(
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
    const toplam = sepet.reduce(
      (acc, cur) => acc + cur.price * cur.quantity,
      0
    );
    $("#toplamFiyat").text(toplam);
    $(document).on("click", ".btn-remove-from-cart", function () {
      const silinecekId = $(this).data("id");
      sepettenUrunSilme(silinecekId);
      sepetiGoster();
    });
  }
  function sepettenUrunSilme(silinecekId) {
    const indexNo = sepet.findIndex((urun) => urun.id === silinecekId);
    if (indexNo !== -1) {
      sepet.splice(indexNo, 1);
      sepetMiktari();
    }
  }
  function kategorileriGoster() {
    let kategoriler = new Set();
    for (let urun of urunler) {
      kategoriler.add(urun.category);
      // console.log(kategoriler);
    }
    for (let kategori of kategoriler) {
      const kategoriList = $("<li>")
        .addClass("list-group-item")
        .text(kategori)
        .on("click", function () {
          let secilenKategori = urunler.filter(
            (urun) => urun.category === kategori
          );
          urunleriGoster(secilenKategori);
        });
      $("#categoryList").append(kategoriList);
      //   console.log(kategori);
    }
  }
});
